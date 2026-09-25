import type { ResearchData, ScriptResult, Tone, Duration } from "./types";
import { sanitizeScript } from "./utils";

export function generateViralScript(
  data: ResearchData,
  tone: Tone,
  duration: Duration,
  viralFormat?: string
): ScriptResult {
  const name = data.name;
  const hooks: Record<Tone, string[]> = {
    "viral-polemico": [
      `Fines educativos. ${name}. De la nada... a controlarlo todo. Y luego perderlo todo.`,
    ],
    "documental-educativo": [
      `Fines educativos. La historia de ${name}: como el poder se construye... y como se desmorona.`,
    ],
    motivacional: [
      `Fines educativos. ${name} demostro que desde abajo se puede llegar muy lejos... pero el poder tiene un precio.`,
    ],
  };
  let hook = hooks[tone][0];
  if (viralFormat?.toLowerCase().includes("3 datos")) {
    hook = `Fines educativos. Tres datos de ${name} que cambian como lo miras.`;
  }
  const body = [data.birth, data.rise, data.peak, data.fall, ...(data.keyFacts || []).slice(0, 2)].join(" ");
  const close =
    tone === "viral-polemico"
      ? "Fue codicia... o simple sed de poder? Guarda este video. Parte dos viene."
      : "Esta es solo una parte de su historia. Que opinas tu?";
  const fullScript = sanitizeScript([hook, body, close].join(" "));
  return {
    hook,
    fullScript,
    segments: [
      { text: hook, durationSec: 12 },
      { text: body, durationSec: Math.max(20, duration - 25) },
      { text: close, durationSec: 10 },
    ],
    description: `Fines educativos. ${name}: de X a Y. Codicia o poder? Guarda parte 2.`,
    hashtags: ["#historia", "#viral", "#documental", "#shorts", "#fineseducativos"],
    titleCover: `DE ${name.toUpperCase().split(" ")[0]} A TODO... Y A NADA`,
  };
}
