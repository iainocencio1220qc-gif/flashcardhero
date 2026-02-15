/**
 * Power Paste: split by newlines, then each line by separator (: or -)
 */

const DEFAULT_SEPARATORS = [":", "–", "—", "-"];

export interface ParsedCard {
  front: string;
  back: string;
}

export function parsePowerPaste(
  text: string,
  separator?: string
): ParsedCard[] {
  const sep = separator?.trim() || null;
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const result: ParsedCard[] = [];
  const separators = sep ? [sep] : DEFAULT_SEPARATORS;

  for (const line of lines) {
    let found = false;
    for (const s of separators) {
      const idx = line.indexOf(s);
      if (idx !== -1) {
        const front = line.slice(0, idx).trim();
        const back = line.slice(idx + s.length).trim();
        if (front && back) {
          result.push({ front, back });
          found = true;
        }
        break;
      }
    }
    if (!found && line) {
      result.push({ front: line, back: "" });
    }
  }
  return result.filter((c) => c.front);
}
