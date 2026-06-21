type ClassValue = string | number | null | false | undefined | ClassValue[];

/** Tiny className joiner (clsx-style) — keeps the demo dependency-free. */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else {
      out.push(String(input));
    }
  }
  return out.join(" ");
}

/** Format a number as JPY, e.g. 24200 -> "¥24,200". */
export function jpy(amount: number): string {
  return "¥" + amount.toLocaleString("ja-JP");
}
