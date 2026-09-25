import { NextRequest, NextResponse } from "next/server";
import { searchImages } from "@/lib/images";

export async function POST(req: NextRequest) {
  try {
    const { name, count = 16 } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    }
    const images = await searchImages(name, count);
    return NextResponse.json({ images, count: images.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error buscando imágenes" }, { status: 500 });
  }
}
