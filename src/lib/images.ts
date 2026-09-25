export interface ImageResult {
  url: string;
  thumb: string;
  source: "wikimedia" | "pexels" | "fallback";
  title?: string;
  width?: number;
  height?: number;
}

export async function searchImages(characterName: string, count: number = 16): Promise<ImageResult[]> {
  const results: ImageResult[] = [];
  try {
    const wikiImages = await searchWikimedia(characterName, count);
    results.push(...wikiImages);
  } catch (e) {
    console.warn("Wikimedia search failed:", e);
  }
  if (results.length < count && process.env.PEXELS_API_KEY) {
    try {
      const pexelsImages = await searchPexels(characterName, count - results.length);
      results.push(...pexelsImages);
    } catch (e) {
      console.warn("Pexels search failed:", e);
    }
  }
  while (results.length < Math.min(count, 8)) {
    results.push({
      url: `https://picsum.photos/seed/${encodeURIComponent(characterName)}-${results.length}/1080/1920`,
      thumb: `https://picsum.photos/seed/${encodeURIComponent(characterName)}-${results.length}/270/480`,
      source: "fallback",
      title: `${characterName} placeholder`,
    });
  }
  return results.slice(0, count);
}

async function searchWikimedia(query: string, limit: number): Promise<ImageResult[]> {
  const searchUrl =
    `https://commons.wikimedia.org/w/api.php?` +
    new URLSearchParams({
      action: "query",
      format: "json",
      origin: "*",
      generator: "search",
      gsrsearch: `${query} portrait OR photo OR painting`,
      gsrnamespace: "6",
      gsrlimit: String(Math.min(limit, 20)),
      prop: "imageinfo",
      iiprop: "url|size|mime",
      iiurlwidth: "1080",
    });
  const res = await fetch(searchUrl, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Wikimedia request failed");
  const data = await res.json();
  const pages = data?.query?.pages || {};
  const images: ImageResult[] = [];
  for (const page of Object.values(pages) as any[]) {
    const info = page.imageinfo?.[0];
    if (!info?.url) continue;
    if (!(info.mime || "").startsWith("image/")) continue;
    images.push({
      url: info.thumburl || info.url,
      thumb: info.thumburl || info.url,
      source: "wikimedia",
      title: page.title?.replace("File:", ""),
      width: info.width,
      height: info.height,
    });
  }
  return images;
}

async function searchPexels(query: string, limit: number): Promise<ImageResult[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query + " historical portrait")}&orientation=portrait&per_page=${limit}`;
  const res = await fetch(url, { headers: { Authorization: key }, next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Pexels request failed");
  const data = await res.json();
  return (data.photos || []).map((p: any) => ({
    url: p.src?.large2x || p.src?.large || p.src?.original,
    thumb: p.src?.medium || p.src?.small,
    source: "pexels" as const,
    title: p.alt || query,
    width: p.width,
    height: p.height,
  }));
}
