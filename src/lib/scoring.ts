import type { Player, PlayerId, VoteMap, ScoreRule } from "../types";

export const DEFAULT_RULES: ScoreRule = {
  storytellerCorrect: 3,
  guesserCorrect: 3,
  voteReceived: 1,
};

export function scoreRound(
  players: Player[],
  storytellerId: PlayerId,
  votes: VoteMap,
  rule: ScoreRule = DEFAULT_RULES,
): Record<PlayerId, number> {
  const score: Record<PlayerId, number> = Object.fromEntries(
    players.map(p => [p.id, 0]),
  );

  const voters = players.filter(p => p.id !== storytellerId);
  const correctGuessers = voters.filter(v => votes[v.id] === storytellerId);
  const k = correctGuessers.length;
  const allOrNone = k === 0 || k === voters.length;

  if (!allOrNone) {
    score[storytellerId] += rule.storytellerCorrect;
    correctGuessers.forEach(g => {
      score[g.id] += rule.guesserCorrect;
    });
  }

  const received: Record<PlayerId, number> = Object.fromEntries(
    players.map(p => [p.id, 0]),
  );
  voters.forEach(v => {
    const target = votes[v.id];
    if (target) received[target] += 1;
  });
  players.forEach(p => {
    if (p.id !== storytellerId)
      score[p.id] += received[p.id] * rule.voteReceived;
  });

  return score;
}
