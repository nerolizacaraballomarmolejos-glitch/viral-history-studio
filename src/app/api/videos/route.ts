import { NextRequest, NextResponse } from "next/server";
import { listVideos, saveVideo, deleteVideo } from "@/lib/db/videos";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const videos = await listVideos(userId);
    return NextResponse.json({ videos });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const video = await saveVideo({
      characterName: body.characterName,
      tone: body.tone || "viral-polemico",
      duration: body.duration || 70,
      voice: body.voice || "masculina-viral",
      status: body.status || "ready",
      script: body.script,
      titleCover: body.titleCover,
      description: body.description,
      hashtags: body.hashtags,
      imageCount: body.imageCount || 0,
      videoUrl: body.videoUrl || null,
      thumbnailUrl: body.thumbnailUrl || null,
      userId: body.userId || null,
    });
    return NextResponse.json({ video });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });
    const ok = await deleteVideo(id);
    return NextResponse.json({ deleted: ok });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
