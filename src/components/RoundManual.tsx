import { useMemo, useState } from "react";
import type { Player, PlayerId, Round } from "../types";
import { ScoreBoard } from "./ScoreBoard";
import HelpHint from "./HelpHint";

export function RoundManual({
  players,
  rounds,
  roundIndex,
  storyteller,
  victory,
  onConfirm,
  onResetTotals,
}: {
  players: Player[];
  rounds: Round[];
  roundIndex: number;
  storyteller: Player;
  victory: number;
  onConfirm: (scores: Record<PlayerId, number>) => void;
  onResetTotals: () => void;
}) {
  // 0점 객체를 플레이어 변동에 맞춰 메모이즈
  const zeroScores = useMemo(
    () =>
      Object.fromEntries(players.map(p => [p.id, 0])) as Record<
        PlayerId,
        number
      >,
    [players],
  );

  const [scores, setScores] = useState<Record<PlayerId, number>>(zeroScores);
  const [submitting, setSubmitting] = useState(false);

  const totalThisRound = useMemo(
    () => Object.values(scores).reduce((a, b) => a + (b || 0), 0),
    [scores],
  );
  const allZero = totalThisRound === 0;

  const set = (id: PlayerId, v: number) =>
    setScores(prev => ({ ...prev, [id]: Math.max(-99, Math.min(99, v | 0)) }));

  const handleConfirm = () => {
    if (submitting) return;
    setSubmitting(true);
    onConfirm(scores); // 부모(App)에 라운드 확정 알림
    setScores(zeroScores); // 다음 라운드를 위해 즉시 0으로 리셋
    setSubmitting(false);
  };

  return (
    <div className="mx-auto w-full max-w-md p-1">
      {/* 헤더 */}
      <div className="relative overflow-hidden rounded-t-3xl rounded-b-none bg-[var(--violet-1)] p-5 text-white">
        <div className="pointer-events-none absolute right-[-18%] top-[-28%] h-36 w-36 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute left-[-12%] bottom-[-22%] h-28 w-28 rounded-full bg-white/10" />
        <h1 className="text-2xl font-bold">Dixit 점수판</h1>
        <p className="mt-1 text-white/80 text-sm">
          Round {roundIndex} · ST: <b>{storyteller.name}</b>
        </p>
      </div>

      <div className="card-glass rounded-t-none rounded-b-3xl border border-gray-300 p-5 shadow-md">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-800">점수 입력</h2>
            <HelpHint title="라운드 점수 입력 안내">
              <p>
                • 각 플레이어의 이번 라운드에서 얻은 점수를 버튼으로 증감하세요.
              </p>
              <p>
                • <b>ST</b> 배지는 이번 라운드 스토리텔러를 의미합니다.
              </p>
              <p>
                • <b>라운드 확정</b>을 누르면 점수가 누적되고 다음 라운드로
                이동합니다.
              </p>
            </HelpHint>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {players.map(p => (
            <div key={p.id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--violet-1)] text-white text-xs">
                  {p.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="text-sm">{p.name}</span>
                {p.id === storyteller.id && (
                  <span className="badge bg-[var(--violet-2)] text-[var(--violet-1)]">
                    ST
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="rounded-full border border-gray-300 px-3 py-0.5 text-sm"
                  onClick={() => set(p.id, (scores[p.id] ?? 0) - 1)}
                >
                  −
                </button>
                <input
                  type="text"
                  className="w-12 rounded-lg border border-gray-300 p-0.5 text-center"
                  value={scores[p.id] ?? 0}
                  onChange={e => set(p.id, Number(e.target.value))}
                />
                <button
                  className="rounded-full border border-gray-300 px-3 py-0.5 text-sm"
                  onClick={() => set(p.id, (scores[p.id] ?? 0) + 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 확정 버튼 */}
        <button
          className="mt-4 w-full rounded-xl bg-[var(--violet-1)] px-4 py-2 text-white transition hover:brightness-110 active:scale-[0.99] disabled:opacity-40"
          disabled={allZero || submitting}
          onClick={handleConfirm}
        >
          라운드 확정
        </button>
      </div>

      {/* 하단 스코어 */}
      <div className="mt-4">
        <ScoreBoard
          players={players}
          rounds={rounds}
          compact
          victory={victory}
          onResetTotals={onResetTotals}
        />
      </div>
    </div>
  );
}
