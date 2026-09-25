import { NextRequest, NextResponse } from "next/server";
import { researchCharacter } from "@/lib/research";
import { generateViralScript } from "@/lib/script-generator";
import { searchImages } from "@/lib/images";
import { generateVoiceOver } from "@/lib/voice";
import type { Tone, Duration, VoiceId } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      characterName,
      tone = "viral-polemico",
      duration = 70,
      voice = "masculina-viral",
    } = body as {
      characterName: string;
      tone: Tone;
      duration: Duration;
      voice: VoiceId;
    };

    if (!characterName?.trim()) {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    }

    const research = await researchCharacter(characterName.trim());
    const script = generateViralScript(research, tone, duration);
    const images = await searchImages(characterName.trim(), 16);
    const audio = await generateVoiceOver(script.fullScript, voice);

    return NextResponse.json({
      jobId: `job_${Date.now()}`,
      status: "ready",
      research,
      script,
      images,
      audio,
      meta: {
        characterName: research.name,
        tone,
        duration,
        voice,
        imageCount: images.length,
        audioMock: audio.mock,
        estimatedRenderSec: 45,
      },
    });
  } catch (e: any) {
    console.error("Generate pipeline error:", e);
    return NextResponse.json(
      { error: e.message || "Error en el pipeline de generación" },
      { status: 500 }
    );
  }
}
