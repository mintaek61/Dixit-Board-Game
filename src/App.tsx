import { useState } from "react";
import type { Player, PlayerId, Round } from "./types";
import { detectWinner } from "./lib/winner";
import { SetupScreen } from "./components/SetupScreen";
import { FinishedScreen } from "./components/FinishedScreen";
import { RoundManual } from "./components/RoundManual";

const DEFAULT_VICTORY_POINTS = 30;

type Phase = "setup" | "round" | "finished";

export default function App() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [stStart, setStStart] = useState<number | null>(null);
  const [victoryPoints, setVictoryPoints] = useState<number>(
    DEFAULT_VICTORY_POINTS,
  );

  const onStart = (names: string[], victory: number) => {
    const nextPlayers: Player[] = names.map((name, idx) => ({
      id: `P${idx + 1}`,
      name: name.trim() || `Player ${idx + 1}`,
      total: 0,
    }));
    setPlayers(nextPlayers);
    setRounds([]);
    setStStart(Math.floor(Math.random() * nextPlayers.length));
    setVictoryPoints(victory || DEFAULT_VICTORY_POINTS);
    setPhase("round");
  };

  const resetGame = () => {
    setPhase("setup");
    setPlayers([]);
    setRounds([]);
    setStStart(null);
    setVictoryPoints(DEFAULT_VICTORY_POINTS);
  };

  const resetTotalsAndRounds = () => {
    setPlayers(prev => prev.map(p => ({ ...p, total: 0 })));
    setRounds([]);
  };

  return (
    <div className="min-h-[100dvh] bg-app p-4">
      <div className="mx-auto w-full max-w-md">
        {phase === "setup" && <SetupScreen onStart={onStart} />}

        {phase === "round" &&
          (() => {
            const roundIndex = rounds.length + 1;
            if (stStart === null || players.length === 0) return null;

            const storyteller =
              players[(stStart + rounds.length) % players.length];

            return (
              <RoundManual
                players={players}
                rounds={rounds}
                roundIndex={roundIndex}
                storyteller={storyteller}
                victory={victoryPoints}
                onConfirm={scoresById => {
                  // 총점 업데이트
                  const updated = players.map(p => ({
                    ...p,
                    total: p.total + (scoresById[p.id] ?? 0),
                  }));
                  setPlayers(updated);

                  // 라운드 기록에 storyteller 포함
                  setRounds([
                    ...rounds,
                    {
                      index: roundIndex,
                      scores: scoresById,
                      storyteller: storyteller.id,
                    } as Round,
                  ]);

                  // 승리 검사
                  const totals = Object.fromEntries(
                    updated.map(p => [p.id, p.total]),
                  ) as Record<PlayerId, number>;
                  const winner = detectWinner(totals, victoryPoints);
                  if (winner) setPhase("finished");
                }}
                onResetTotals={resetTotalsAndRounds}
              />
            );
          })()}

        {phase === "finished" && (
          <FinishedScreen
            players={players}
            victoryPoints={victoryPoints}
            onRestart={resetGame}
          />
        )}
      </div>
    </div>
  );
}
