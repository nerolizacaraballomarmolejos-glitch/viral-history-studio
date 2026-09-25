export type Tone = "viral-polemico" | "documental-educativo" | "motivacional";
export type Duration = 30 | 70 | 90;
export type VoiceId = "masculina-viral" | "femenina-misterio" | "dominicana";

export interface VideoJob {
  id: string;
  characterName: string;
  tone: Tone;
  duration: Duration;
  voice: VoiceId;
  status: "pending" | "researching" | "scripting" | "images" | "audio" | "editing" | "ready" | "error";
  progress: number;
  script?: string;
  hook?: string;
  images?: string[];
  audioUrl?: string;
  videoUrl?: string;
  description?: string;
  hashtags?: string[];
  createdAt: string;
  error?: string;
}

export interface ResearchData {
  name: string;
  birth: string;
  rise: string;
  peak: string;
  fall: string;
  death?: string;
  summary: string;
  keyFacts: string[];
  sources: string[];
}

export interface ScriptResult {
  hook: string;
  fullScript: string;
  segments: { text: string; durationSec: number }[];
  description: string;
  hashtags: string[];
  titleCover: string;
}
