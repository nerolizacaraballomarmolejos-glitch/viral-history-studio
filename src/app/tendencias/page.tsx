"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Loader2, Sparkles, RefreshCw, ArrowRight } from "lucide-react";

export default function TendenciasPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/trends");
      if (!res.ok) throw new Error("No se pudieron cargar tendencias");
      setReport(await res.json());
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4 md:p-8 pb-24 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-7 w-7 text-neon" /> Tendencias IA
        </h1>
        <button onClick={load} className="rounded-lg border border-border px-3 py-2 text-sm flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Actualizar
        </button>
      </div>
      {loading && <div className="flex justify-center py-20 text-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>}
      {error && <p className="text-danger text-sm">{error}</p>}
      {report && !loading && (
        <div className="space-y-4">
          <div className="rounded-xl border border-neon/30 bg-neon/5 p-5">
            <div className="flex items-center gap-2 text-neon mb-2"><Sparkles className="h-4 w-4" /><span className="text-xs font-semibold">Resumen IA</span></div>
            <p className="text-sm">{report.summary}</p>
          </div>
          {report.topTrends?.map((t: any) => (
            <div key={t.id} className="rounded-xl border border-border bg-card p-4 flex justify-between gap-3">
              <div>
                <p className="text-xs text-neon font-bold">{t.score}/100</p>
                <h3 className="font-semibold text-sm">{t.title}</h3>
                <p className="text-xs text-muted mt-1">{t.whyViral}</p>
              </div>
              {t.characterHint && (
                <Link href={`/nuevo?nombre=${encodeURIComponent(t.characterHint)}`}
                  className="shrink-0 rounded-lg bg-neon px-3 py-2 text-xs font-bold text-black flex items-center gap-1">
                  Crear <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            {report.suggestedCharacters?.map((c: string) => (
              <Link key={c} href={`/nuevo?nombre=${encodeURIComponent(c)}`}
                className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-neon hover:text-neon">{c}</Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
