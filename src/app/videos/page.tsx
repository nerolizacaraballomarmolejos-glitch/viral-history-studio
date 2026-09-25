"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Film, Download, Trash2, PlusCircle, Loader2 } from "lucide-react";

interface SavedVideo {
  id: string;
  characterName: string;
  duration: number;
  status: string;
  titleCover?: string;
  videoUrl?: string | null;
  imageCount?: number;
  createdAt: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<SavedVideo[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/videos");
      const data = await res.json();
      setVideos(data.videos || []);
    } catch {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este video?")) return;
    await fetch(`/api/videos?id=${id}`, { method: "DELETE" });
    setVideos((v) => v.filter((x) => x.id !== id));
  }

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mis Videos</h1>
          <p className="text-sm text-muted mt-1">{videos.length} guardados</p>
        </div>
        <Link href="/nuevo" className="inline-flex items-center gap-2 rounded-lg bg-neon px-4 py-2.5 text-sm font-bold text-black">
          <PlusCircle className="h-4 w-4" /> Nuevo
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted" /></div>
      ) : videos.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Film className="h-10 w-10 text-muted mx-auto mb-3" />
          <p className="text-muted text-sm mb-4">Aún no tienes videos.</p>
          <Link href="/nuevo" className="text-neon text-sm font-medium">Crear video</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <div key={v.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="aspect-[9/16] max-h-52 bg-background flex items-center justify-center">
                <Film className="h-10 w-10 text-muted" />
              </div>
              <div className="p-4">
                <p className="font-semibold truncate">{v.characterName}</p>
                <p className="text-xs text-muted mt-1">{v.duration}s</p>
                <div className="flex gap-2 mt-3">
                  {v.videoUrl ? (
                    <a href={v.videoUrl} download className="flex-1 text-center rounded-lg bg-neon/10 text-neon py-2 text-xs font-medium">MP4</a>
                  ) : (
                    <span className="flex-1 text-center rounded-lg border border-border py-2 text-xs text-muted">Sin export</span>
                  )}
                  <button onClick={() => handleDelete(v.id)} className="px-3 py-2 rounded-lg border border-border text-muted hover:text-danger">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
