"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, CheckCircle2, AlertCircle, Download } from "lucide-react";

type Tone = "viral-polemico" | "documental-educativo" | "motivacional";
type Duration = 30 | 70 | 90;
type VoiceId = "masculina-viral" | "femenina-misterio" | "dominicana";

export default function NuevoVideoPage() {
  const [name, setName] = useState("");
  const [tone, setTone] = useState<Tone>("viral-polemico");
  const [duration, setDuration] = useState<Duration>(70);
  const [voice, setVoice] = useState<VoiceId>("masculina-viral");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const n = new URLSearchParams(window.location.search).get("nombre");
      if (n) setName(n);
    } catch {}
  }, []);

  async function handleGenerate() {
    if (!name.trim()) return;
    setError(null);
    setResult(null);
    setDownloadUrl(null);
    setLoading(true);
    setProgress(10);
    const t = setInterval(() => setProgress((p) => Math.min(p + 5, 90)), 400);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterName: name.trim(), tone, duration, voice }),
      });
      clearInterval(t);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Error en la generacion");
      }
      const data = await res.json();
      setResult(data);
      setProgress(100);
      await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterName: data.meta?.characterName || name,
          tone, duration, voice, status: "ready",
          script: data.script?.fullScript,
          titleCover: data.script?.titleCover,
          description: data.script?.description,
          hashtags: data.script?.hashtags,
          imageCount: data.meta?.imageCount,
        }),
      }).catch(() => {});
    } catch (e: any) {
      clearInterval(t);
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    if (!result) return;
    setExporting(true);
    setExportMsg(null);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterName: result.meta?.characterName,
          script: result.script,
          images: result.images,
          audio: result.audio,
          titleCover: result.script?.titleCover,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error exportando");
      if (data.downloadUrl) {
        setDownloadUrl(data.downloadUrl);
        setExportMsg(`Video listo · ${data.durationSec}s`);
      } else {
        setExportMsg(data.message || data.error || "Sin URL");
      }
    } catch (e: any) {
      setExportMsg(e.message || "Error");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="p-4 md:p-8 pb-24 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Nuevo Video</h1>
      <p className="text-muted text-sm mb-6">Escribe un personaje historico. La app hace el resto.</p>
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <input value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Rafael Trujillo, Simon Bolivar..."
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neon/50"
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()} />
        <div className="grid grid-cols-3 gap-2">
          {(["viral-polemico", "documental-educativo", "motivacional"] as Tone[]).map((t) => (
            <button key={t} type="button" onClick={() => setTone(t)}
              className={`rounded-lg border px-2 py-2 text-xs ${tone === t ? "border-neon bg-neon/10 text-neon" : "border-border"}`}>
              {t.replace(/-/g, " ")}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {([30, 70, 90] as Duration[]).map((d) => (
            <button key={d} type="button" onClick={() => setDuration(d)}
              className={`flex-1 rounded-lg border py-2 text-sm ${duration === d ? "border-neon bg-neon/10 text-neon" : "border-border"}`}>
              {d}s
            </button>
          ))}
        </div>
        <select value={voice} onChange={(e) => setVoice(e.target.value as VoiceId)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
          <option value="masculina-viral">Masculina Viral</option>
          <option value="femenina-misterio">Femenina Misterio</option>
          <option value="dominicana">Dominicana</option>
        </select>
        <button onClick={handleGenerate} disabled={!name.trim() || loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-neon py-3.5 text-sm font-bold text-black disabled:opacity-50">
          {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Generando...</> : <><Sparkles className="h-5 w-5" /> GENERAR VIDEO</>}
        </button>
      </div>
      {(loading || result || error) && (
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          {loading && (
            <>
              <p className="text-sm mb-2">Procesando pipeline...</p>
              <div className="h-2 rounded-full bg-background overflow-hidden">
                <div className="h-full bg-neon transition-all" style={{ width: `${progress}%` }} />
              </div>
            </>
          )}
          {error && <div className="flex items-center gap-2 text-danger text-sm"><AlertCircle className="h-5 w-5" />{error}</div>}
          {result && !loading && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-success text-sm font-semibold">
                <CheckCircle2 className="h-5 w-5" /> Listo · {result.meta?.imageCount || 0} imagenes
              </div>
              {result.images?.length > 0 && (
                <div className="grid grid-cols-4 gap-1.5">
                  {result.images.slice(0, 8).map((img: any, i: number) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={img.thumb || img.url} alt="" className="aspect-[9/16] object-cover rounded-md border border-border" />
                  ))}
                </div>
              )}
              <div className="rounded-lg border border-border bg-background p-4 text-sm whitespace-pre-wrap">{result.script?.fullScript}</div>
              <button onClick={handleExport} disabled={exporting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-neon py-3 text-sm font-bold text-black">
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {exporting ? "Renderizando..." : "Exportar MP4"}
              </button>
              {downloadUrl && <a href={downloadUrl} download className="block text-center text-success text-sm font-medium">Descargar video</a>}
              {exportMsg && <p className="text-xs text-muted">{exportMsg}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
