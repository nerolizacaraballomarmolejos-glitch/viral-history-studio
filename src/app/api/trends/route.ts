import { NextResponse } from "next/server";
import { analyzeViralTrends } from "@/lib/trends";

export async function GET() {
  try {
    const report = await analyzeViralTrends();
    return NextResponse.json(report);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Error analizando tendencias" },
      { status: 500 }
    );
  }
}
