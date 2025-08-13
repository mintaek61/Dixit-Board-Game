import type { Player } from "../types";

export function FinishedScreen({
  players,
  victoryPoints,
  onRestart,
}: {
  players: Player[];
  victoryPoints: number;
  onRestart: () => void;
}) {
  const top = Math.max(...players.map(p => p.total));
  const winners = players.filter(p => p.total === top);

  return (
    <div className="mx-auto w-full max-w-md p-1">
      {/* 헤더 */}
      <div className="relative overflow-hidden rounded-t-3xl rounded-b-none bg-[var(--violet-1)] p-5 text-white">
        <div className="pointer-events-none absolute right-[-18%] top-[-28%] h-36 w-36 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute left-[-12%] bottom-[-22%] h-28 w-28 rounded-full bg-white/10" />
        <h1 className="text-2xl font-bold">Dixit 점수판</h1>
        <p className="mt-1 text-sm text-white/85">
          게임 종료 · 승리 점수 <b>{victoryPoints}</b>
        </p>
      </div>

      <div className="card-glass rounded-t-none rounded-b-3xl border border-gray-200/50 p-5 shadow-sm">
        {/* 우승 배너 */}
        <div className="rounded-xl border border-emerald-300/50 bg-emerald-50 p-3 text-base">
          🏆 우승: <b>{winners.map(w => w.name).join(", ")}</b>
        </div>

        {/* 최종 점수 목록 */}
        <h2 className="mt-4 text-base font-semibold text-gray-800">
          최종 점수
        </h2>
        <div className="mt-2 grid grid-cols-1 gap-2">
          {players.map(p => {
            const isWinner = winners.some(w => w.id === p.id);
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between rounded-xl px-3 py-2 shadow-sm ${
                  isWinner
                    ? "bg-[var(--violet-3)] border border-[var(--violet-2)]/60"
                    : "bg-white border border-gray-200/50"
                }`}
              >
                <span className="text-sm font-medium">{p.name}</span>
                <span className="font-semibold">{p.total}점</span>
              </div>
            );
          })}
        </div>

        {/* 새 게임 버튼 */}
        <button
          className="mt-6 w-full rounded-xl bg-[var(--violet-1)] px-4 py-3 text-white transition hover:brightness-110 active:scale-[0.99]"
          onClick={onRestart}
        >
          새 게임 시작
        </button>
      </div>
    </div>
  );
}
