import express from "express";
import cors from "cors";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const TMP = path.join(ROOT, "tmp");
const EXPORTS = path.join(ROOT, "exports");
const PORT = process.env.PORT || 8080;
const API_SECRET = process.env.WORKER_SECRET || "";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/exports", express.static(EXPORTS));

function auth(req, res, next) {
  if (!API_SECRET) return next();
  const key = req.headers["x-worker-secret"] || req.query.secret;
  if (key !== API_SECRET) return res.status(401).json({ error: "Unauthorized" });
  next();
}

app.get("/health", async (_req, res) => {
  try {
    await execFileAsync("ffmpeg", ["-version"], { timeout: 5000 });
    res.json({ ok: true, ffmpeg: true, service: "vhs-ffmpeg-worker" });
  } catch {
    res.status(500).json({ ok: false, ffmpeg: false });
  }
});

app.post("/render", auth, async (req, res) => {
  const jobId = randomUUID().slice(0, 8);
  const workDir = path.join(TMP, jobId);
  try {
    await fs.mkdir(TMP, { recursive: true });
    await fs.mkdir(EXPORTS, { recursive: true });
    await fs.mkdir(workDir, { recursive: true });

    const {
      characterName = "video",
      titleCover = "HISTORIA VIRAL",
      script = "",
      images = [],
      durationSec = 35,
    } = req.body || {};

    const targetDuration = Math.min(Math.max(Number(durationSec) || 30, 15), 70);
    const localImages = [];
    for (let i = 0; i < Math.min(images.length, 8); i++) {
      const url = images[i]?.url || images[i];
      if (!url) continue;
      const dest = path.join(workDir, `img_${i}.jpg`);
      try {
        const r = await fetch(url, { headers: { "User-Agent": "VHS-Worker/1.0" }, signal: AbortSignal.timeout(12000) });
        if (!r.ok) continue;
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length < 1000) continue;
        await fs.writeFile(dest, buf);
        localImages.push(dest);
      } catch {}
    }

    const outName = `${String(characterName).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)}_${jobId}.mp4`;
    const outFile = path.join(EXPORTS, outName);
    const title = String(titleCover).slice(0, 50).replace(/:/g, "\\:").replace(/'/g, "\u2019");

    if (localImages.length === 0) {
      await execFileAsync("ffmpeg", [
        "-f", "lavfi", "-i", `color=c=0x0a0a0b:s=1080x1920:d=${targetDuration}`,
        "-vf", `drawtext=text='Fines Educativos':fontsize=22:fontcolor=white@0.6:x=(w-text_w)/2:y=50,drawtext=text='${title}':fontsize=36:fontcolor=yellow:x=(w-text_w)/2:y=(h-text_h)/2:borderw=3:bordercolor=black`,
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-pix_fmt", "yuv420p",
        "-t", String(targetDuration), "-y", outFile,
      ], { timeout: 90000 });
    } else {
      const seg = targetDuration / localImages.length;
      const args = [];
      for (const img of localImages) {
        args.push("-loop", "1", "-t", String(seg), "-i", img);
      }
      const filters = localImages.map((_, i) =>
        `[${i}:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30[v${i}]`
      ).join(";");
      const concat = localImages.map((_, i) => `[v${i}]`).join("") + `concat=n=${localImages.length}:v=1:a=0[vout]`;
      args.push("-filter_complex", filters + ";" + concat,
        "-map", "[vout]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
        "-pix_fmt", "yuv420p", "-t", String(targetDuration), "-movflags", "+faststart", "-y", outFile);
      await execFileAsync("ffmpeg", args, { timeout: 180000, maxBuffer: 20 * 1024 * 1024 });
    }

    await fs.rm(workDir, { recursive: true, force: true }).catch(() => {});
    const base = process.env.PUBLIC_URL || (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : "");
    const videoUrl = base ? `${base.replace(/\/$/, "")}/exports/${outName}` : `/exports/${outName}`;
    res.json({ success: true, jobId, videoUrl, fileName: outName, durationSec: targetDuration, resolution: "1080x1920" });
  } catch (e) {
    console.error(e?.message || e);
    await fs.rm(workDir, { recursive: true, force: true }).catch(() => {});
    res.status(500).json({ success: false, error: e?.message || "Render failed" });
  }
});

app.listen(PORT, () => console.log(`VHS FFmpeg worker on :${PORT}`));
