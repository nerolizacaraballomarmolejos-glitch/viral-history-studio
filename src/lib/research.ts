import type { ResearchData } from "./types";

export async function researchCharacter(name: string): Promise<ResearchData> {
  const cleaned = name.trim();
  if (!cleaned) return fallback(cleaned);
  try {
    const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleaned)}&format=json&origin=*&srlimit=3`;
    const searchRes = await fetch(searchUrl, { headers: { "User-Agent": "ViralHistoryStudio/1.0" } });
    const searchData = await searchRes.json();
    const first = searchData?.query?.search?.[0];
    if (!first) return fallback(cleaned);
    const title = first.title;
    const summaryUrl = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const summary = await (await fetch(summaryUrl, { headers: { "User-Agent": "ViralHistoryStudio/1.0" } })).json();
    const extract = summary.extract || first.snippet?.replace(/<[^>]+>/g, "") || "";
    return {
      name: summary.title || title || cleaned,
      birth: extract.match(/\d{4}/)?.[0] ? `Contexto temporal cercano a ${extract.match(/\d{4}/)?.[0]}` : "Origenes documentados de forma incompleta.",
      rise: "Su ascenso reordeno el mapa de poder de su epoca.",
      peak: "Alcanzo un nivel de poder o influencia dificil de igualar.",
      fall: "Su trayectoria termino de forma controvertida o dramatica.",
      summary: extract.slice(0, 800),
      keyFacts: extract.split(/(?<=[.!?])\s+/).filter((s: string) => s.length > 40).slice(0, 5),
      sources: [summary.content_urls?.desktop?.page || `https://es.wikipedia.org/wiki/${encodeURIComponent(title)}`],
    };
  } catch {
    return fallback(cleaned);
  }
}

function fallback(name: string): ResearchData {
  return {
    name: name || "Personaje",
    birth: "Origenes no del todo claros en fuentes abiertas.",
    rise: "Logro un ascenso notable en poder o influencia.",
    peak: "Llego a un punto de maxima relevancia historica.",
    fall: "Su trayectoria termino de forma controvertida o dramatica.",
    summary: `${name} es una figura historica cuyo relato sigue generando debate.`,
    keyFacts: ["Figura con fuerte impacto en su region o epoca."],
    sources: [`https://es.wikipedia.org/wiki/${encodeURIComponent(name)}`],
  };
}
