import path from "path";

export interface MusicTrack {
  id: string;
  title: string;
  filePath: string;
  durationSec: number;
  bpm: number;
  genre: string;
}

export interface SfxClip {
  id: string;
  name: string;
  filePath: string;
  trigger: "hook" | "money" | "fall" | "transition";
  atSec?: number;
}

const PUBLIC = path.join(process.cwd(), "public");

export const LOCAL_MUSIC: MusicTrack = {
  id: "dark-suspense-1",
  title: "Dark Suspense Trailer",
  filePath: path.join(PUBLIC, "music", "dark_suspense.mp3"),
  durationSec: 40,
  bpm: 90,
  genre: "Dark Suspense Trailer",
};

export const LOCAL_SFX: SfxClip[] = [
  { id: "whoosh", name: "Whoosh", filePath: path.join(PUBLIC, "sfx", "whoosh.mp3"), trigger: "hook", atSec: 0.3 },
  { id: "click", name: "Click", filePath: path.join(PUBLIC, "sfx", "click.mp3"), trigger: "money", atSec: 8 },
  { id: "impact", name: "Low Impact", filePath: path.join(PUBLIC, "sfx", "impact.mp3"), trigger: "fall", atSec: 22 },
];

export function selectBackgroundMusic(_tone?: string): MusicTrack {
  return LOCAL_MUSIC;
}

export function getSfxTimeline(script: string, totalSec: number): SfxClip[] {
  const result: SfxClip[] = [{ ...LOCAL_SFX[0], atSec: 0.2 }];
  if (/fortuna|dinero|poder|barriles|millones|riqueza/i.test(script)) {
    result.push({ ...LOCAL_SFX[1], atSec: Math.min(totalSec * 0.35, 12) });
  }
  if (/caída|perdió|final|muerte|cayó|todo/i.test(script)) {
    result.push({ ...LOCAL_SFX[2], atSec: Math.min(totalSec * 0.75, totalSec - 2) });
  }
  return result;
}
