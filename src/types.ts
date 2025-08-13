export type PlayerId = string;

export type Player = {
  id: PlayerId;
  name: string;
  total: number;
};

export type VoteMap = Record<PlayerId, PlayerId>; // voter -> target(owner of chosen card)

export type Round = {
  index: number;
  storyteller: PlayerId;
  votes: VoteMap;
  scores?: Record<PlayerId, number>; // per-round scores after confirm
};

export type ScoreRule = {
  storytellerCorrect: number; // +3 when some (not all/none) correct
  guesserCorrect: number; // +3 to each correct guesser
  voteReceived: number; // +1 per vote received (non-storyteller only)
};

export type PreviewResult = {
  delta: Record<PlayerId, number>; // round delta scores
  previewTotal: Record<PlayerId, number>; // totals if confirmed
  roundPreview: Round; // round snapshot
  winner: { ids: PlayerId[]; score: number } | null;
};
