import type { PlayerId } from "../types";

export function detectWinner(
  totals: Record<PlayerId, number>,
  victory: number,
): { ids: PlayerId[]; score: number } | null {
  const entries = Object.entries(totals);
  const reached = entries.filter(([, s]) => s >= victory);
  if (reached.length === 0) return null;
  const topScore = Math.max(...reached.map(([, s]) => s));
  const ids = reached.filter(([, s]) => s === topScore).map(([id]) => id);
  return { ids, score: topScore };
}
