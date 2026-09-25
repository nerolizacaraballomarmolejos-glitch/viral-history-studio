import { NextRequest, NextResponse } from "next/server";
import { generateViralScript } from "@/lib/script-generator";
import type { ResearchData, Tone, Duration } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { research, tone, duration } = body as {
      research: ResearchData;
      tone: Tone;
      duration: Duration;
    };
    if (!research || !tone || !duration) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }
    const script = generateViralScript(research, tone, duration);
    return NextResponse.json(script);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error generando guion" }, { status: 500 });
  }
}
