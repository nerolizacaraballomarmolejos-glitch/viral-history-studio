export interface RenderInput {
  characterName: string;
  titleCover: string;
  script: string;
  images: { url: string }[];
  durationSec?: number;
  audioUrl?: string | null;
  tone?: string;
}

export interface RenderResult {
  success: boolean;
  videoUrl?: string;
  filePath?: string;
  durationSec?: number;
  error?: string;
}

/** Local FFmpeg render — en Vercel falla; usa RENDER_WORKER_URL (Railway). */
export async function renderVideo(input: RenderInput): Promise<RenderResult> {
  try {
    const { execFile } = await import("child_process");
    const { promisify } = await import("util");
    const execFileAsync = promisify(execFile);
    await execFileAsync("ffmpeg", ["-version"], { timeout: 5000 });
  } catch {
    return {
      success: false,
      error:
        "FFmpeg no disponible aqui. Configura RENDER_WORKER_URL (worker en Railway) o ejecuta en local con FFmpeg.",
    };
  }
  return {
    success: false,
    error: "Usa el worker Railway (RENDER_WORKER_URL) para render completo en produccion.",
  };
}
