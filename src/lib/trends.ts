export interface ViralTrend {
  id: string;
  title: string;
  characterHint?: string;
  format: string;
  hookTemplate: string;
  whyViral: string;
  platforms: ("tiktok" | "reels" | "shorts")[];
  score: number;
  tags: string[];
  exampleAngle: string;
}

export interface TrendReport {
  generatedAt: string;
  summary: string;
  topTrends: ViralTrend[];
  winningFormats: string[];
  advice: string[];
  suggestedCharacters: string[];
}

const CHARS = ["Rafael Trujillo", "Nayib Bukele", "Simon Bolivar", "Evita Peron", "Fidel Castro", "Frida Kahlo", "Nikola Tesla", "Cleopatra"];

const FORMATS = [
  { format: "De X a Y y perderlo todo", why: "Contraste extremo + curiosidad." },
  { format: "Lo que NO te ensenaron en la escuela", why: "Sensacion de informacion oculta." },
  { format: "3 datos que cambian como lo ves", why: "Lista clara, alta retencion." },
  { format: "El precio del poder", why: "Tono documental + tension." },
];

export async function analyzeViralTrends(): Promise<TrendReport> {
  const topTrends: ViralTrend[] = FORMATS.map((f, i) => {
    const char = CHARS[i % CHARS.length];
    return {
      id: `trend-${i + 1}`,
      title: `${f.format} · ${char}`,
      characterHint: char,
      format: f.format,
      hookTemplate: `Fines educativos. ${char}. ${f.format}.`,
      whyViral: f.why,
      platforms: ["tiktok", "reels", "shorts"],
      score: 92 - i * 4,
      tags: ["#historia", "#viral", "#documental"],
      exampleAngle: `Fines educativos. Historia de ${char}.`,
    };
  });
  return {
    generatedAt: new Date().toISOString(),
    summary: "En Shorts/Reels/TikTok de historia ganan ganchos de contraste (ascenso/caida) y listas de 3 datos, siempre con sello educativo.",
    topTrends,
    winningFormats: FORMATS.map((f) => f.format),
    advice: [
      "Primeros 3 segundos: promesa clara + Fines educativos.",
      "Subtitulos amarillos; sin digitos en voz.",
      "70s rinde mejor que 90s en historia polemica.",
      "CTA al final: Parte 2? sube guardados.",
    ],
    suggestedCharacters: CHARS,
  };
}

export function recommendFormatForCharacter(name: string): ViralTrend {
  return {
    id: "rec-1",
    title: `De X a Y · ${name}`,
    characterHint: name,
    format: FORMATS[0].format,
    hookTemplate: `Fines educativos. ${name}. De la nada a todo.`,
    whyViral: FORMATS[0].why,
    platforms: ["tiktok", "reels", "shorts"],
    score: 90,
    tags: ["#historia", "#viral"],
    exampleAngle: `Fines educativos. ${name}.`,
  };
}
