import { NextRequest, NextResponse } from "next/server";
import { researchCharacter } from "@/lib/research";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    }
    const data = await researchCharacter(name.trim());
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error de investigación" }, { status: 500 });
  }
}
