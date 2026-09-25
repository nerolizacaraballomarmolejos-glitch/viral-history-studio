import type { VoiceId } from "./types";

const VOICE_MAP: Record<VoiceId, string> = {
  "masculina-viral": process.env.ELEVENLABS_VOICE_ID || "pNInz6obpgDQGcFmaJgB",
  "femenina-misterio": "EXAVITQu4vr4xnSDxMaL",
  dominicana: process.env.ELEVENLABS_VOICE_DOMINICANA || "pNInz6obpgDQGcFmaJgB",
};

export interface AudioResult {
  audioUrl: string | null;
  durationSec: number;
  voiceId: string;
  mock: boolean;
}

export async function generateVoiceOver(script: string, voice: VoiceId): Promise<AudioResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = VOICE_MAP[voice];
  const words = script.split(/\s+/).length;
  const durationSec = Math.round(words / 2.6);

  if (!apiKey) {
    return { audioUrl: null, durationSec, voiceId, mock: true };
  }

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: script,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.45, similarity_boost: 0.75, style: 0.35, use_speaker_boost: true },
      }),
    });
    if (!res.ok) throw new Error(`ElevenLabs ${res.status}`);
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return {
      audioUrl: `data:audio/mpeg;base64,${base64}`,
      durationSec,
      voiceId,
      mock: false,
    };
  } catch {
    return { audioUrl: null, durationSec, voiceId, mock: true };
  }
}
