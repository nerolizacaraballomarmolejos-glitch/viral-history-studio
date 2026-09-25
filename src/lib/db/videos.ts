import { randomUUID } from "crypto";

export interface SavedVideo {
  id: string;
  characterName: string;
  tone: string;
  duration: number;
  voice: string;
  status: "ready" | "exported" | "error";
  script?: string;
  titleCover?: string;
  description?: string;
  hashtags?: string[];
  imageCount?: number;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  createdAt: string;
  userId?: string | null;
}

const memoryStore: SavedVideo[] = [];

async function readAll(): Promise<SavedVideo[]> {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const DATA_FILE = path.join(process.cwd(), "data", "videos.json");
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as SavedVideo[];
  } catch {
    return [...memoryStore];
  }
}

async function writeAll(videos: SavedVideo[]) {
  memoryStore.length = 0;
  memoryStore.push(...videos);
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const DATA_FILE = path.join(process.cwd(), "data", "videos.json");
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(videos, null, 2), "utf-8");
  } catch {
    /* Vercel read-only */
  }
}

export async function listVideos(userId?: string | null): Promise<SavedVideo[]> {
  const all = await readAll();
  if (!userId) return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return all.filter((v) => !v.userId || v.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveVideo(
  data: Omit<SavedVideo, "id" | "createdAt"> & { id?: string }
): Promise<SavedVideo> {
  const all = await readAll();
  const video: SavedVideo = {
    ...data,
    id: data.id || randomUUID(),
    createdAt: new Date().toISOString(),
  };
  all.unshift(video);
  await writeAll(all.slice(0, 100));
  return video;
}

export async function deleteVideo(id: string): Promise<boolean> {
  const all = await readAll();
  const next = all.filter((v) => v.id !== id);
  if (next.length === all.length) return false;
  await writeAll(next);
  return true;
}
