import { NextRequest, NextResponse } from "next/server";
import { renderVideo } from "@/lib/render";

export const maxDuration = 180;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { characterName, script, images, titleCover, audio } = body;

    if (!characterName || !script) {
      return NextResponse.json(
        { error: "Datos incompletos para export" },
        { status: 400 }
      );
    }

    const fullScript =
      typeof script === "string" ? script : script.fullScript || "";

    const imageList = Array.isArray(images)
      ? images
          .map((img: any) => ({ url: img.url || img.thumb }))
          .filter((i: any) => i.url)
      : [];

    const workerUrl = process.env.RENDER_WORKER_URL?.replace(/\/$/, "");

    if (workerUrl) {
      const payload: Record<string, unknown> = {
        characterName,
        titleCover:
          titleCover || `DE ${String(characterName).toUpperCase()} A TODO`,
        script: fullScript,
        images: imageList,
        durationSec: audio?.durationSec || 35,
      };

      if (audio?.audioUrl && String(audio.audioUrl).startsWith("data:")) {
        payload.audioBase64 = audio.audioUrl;
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (process.env.WORKER_SECRET) {
        headers["x-worker-secret"] = process.env.WORKER_SECRET;
      }

      const wRes = await fetch(`${workerUrl}/render`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(170000),
      });

      const data = await wRes.json().catch(() => ({}));
      if (!wRes.ok || !data.success) {
        return NextResponse.json(
          {
            error:
              data.error ||
              `Worker error (${wRes.status}). Revisa RENDER_WORKER_URL y WORKER_SECRET.`,
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        exportJobId: data.jobId || `export_${Date.now()}`,
        status: "ready",
        message: "Video renderizado en worker FFmpeg (Railway)",
        downloadUrl: data.videoUrl,
        durationSec: data.durationSec,
        output: {
          format: "mp4",
          resolution: "1080x1920",
          fps: 30,
          codec: "h264",
          via: "railway-worker",
        },
      });
    }

    const result = await renderVideo({
      characterName,
      titleCover:
        titleCover || `DE ${String(characterName).toUpperCase()} A TODO`,
      script: fullScript,
      images: imageList,
      durationSec: audio?.durationSec || 35,
      audioUrl: audio?.audioUrl || null,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            result.error ||
            "Sin FFmpeg local ni RENDER_WORKER_URL. Configura el worker en Railway.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      exportJobId: `export_${Date.now()}`,
      status: "ready",
      message: "Video MP4 generado (FFmpeg local)",
      downloadUrl: result.videoUrl,
      durationSec: result.durationSec,
      output: {
        format: "mp4",
        resolution: "1080x1920",
        fps: 30,
        codec: "h264",
        via: "local",
      },
    });
  } catch (e: any) {
    console.error("Export error:", e);
    return NextResponse.json(
      { error: e.message || "Error en export" },
      { status: 500 }
    );
  }
}
