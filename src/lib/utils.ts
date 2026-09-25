import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export const BANNED_WORDS: Record<string, string> = {
  "toneladas de coca": "grandes cantidades de sustancias ilícitas",
  "cocaína": "sustancias ilícitas",
  narco: "tráfico ilegal",
  cartel: "organización criminal",
  asesinato: "muerte violenta",
  matar: "eliminar",
  drogas: "sustancias controladas",
};

export function sanitizeScript(text: string): string {
  let result = text;
  for (const [banned, replacement] of Object.entries(BANNED_WORDS)) {
    const regex = new RegExp(banned, "gi");
    result = result.replace(regex, replacement);
  }
  return result;
}
