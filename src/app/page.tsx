"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Film, Clock, TrendingUp, Play } from "lucide-react";

interface SavedVideo {
  id: string;
  characterName: string;
  duration: number;
  status: string;
  videoUrl?: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const [videos, setVideos] = useState<SavedVideo[]>([]);

  useEffect(() => {
    fetch("/api/videos")
      .then((r) => r.json())
      .then((d) => setVideos(d.videos || []))
      .catch(() => {});
  }, []);

  const ready = videos.filter((v) => v.status === "ready" || v.status === "exported");
  const exported = videos.filter((v) => v.videoUrl);

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted mt-1 text-sm">Crea videos virales de historia en minutos</p>
        </div>
        <Link
          href="/nuevo"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-neon px-5 py-3 text-sm font-bold text-black shadow-neon hover:bg-neon-300 transition-all"
        >
          <PlusCircle className="h-5 w-5" />
          Nuevo Video
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        {[
          { label: "Videos listos", value: String(ready.length), icon: Film, color: "text-neon" },
          { label: "Exportados", value: String(exported.length), icon: Play, color: "text-success" },
          { label: "En proceso", value: "0", icon: Clock, color: "text-blue-400" },
          { label: "Views", value: "—", icon: TrendingUp, color: "text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <s.icon className={`h-4 w-4 ${s.color} mb-2`} />
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold">Videos recientes</h2>
          <Link href="/videos" className="text-xs text-neon hover:underline">Ver todos</Link>
        </div>
        {videos.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted">
            Aún no hay videos.{" "}
            <Link href="/nuevo" className="text-neon hover:underline">Crea el primero</Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {videos.slice(0, 5).map((job) => (
              <div key={job.id} className="flex items-center gap-4 px-5 py-4">
                <div className="h-12 w-12 rounded-lg bg-background border border-border flex items-center justify-center">
                  <Film className="h-5 w-5 text-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{job.characterName}</p>
                  <p className="text-xs text-muted">{job.duration}s</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
