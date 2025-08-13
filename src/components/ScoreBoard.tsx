import type { Player, Round } from "../types";
import { useState } from "react";
import HelpHint from "./HelpHint";

export function ScoreBoard({
  players,
  rounds,
  compact = false,
  victory = 30,
  onResetTotals,
}: {
  players: Player[];
  rounds: Round[];
  compact?: boolean;
  victory?: number;
  onResetTotals?: () => void;
}) {
  const top = Math.max(0, ...players.map(p => p.total));
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (id: string) =>
    setOpen(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="card-glass rounded-3xl border border-gray-200/50 p-5 shadow-sm bg-white">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">스코어보드</h3>
          <HelpHint title="스코어보드 이용 안내">
            <p>• 카드를 탭하면 라운드별 상세 점수가 펼쳐집니다.</p>
            <p>• 진행 바는 승리 점수(30점) 대비 진행률을 뜻합니다.</p>
            <p>
              • <b>초기화</b>를 누르면 누적 점수와 라운드 기록이 모두
              삭제됩니다.
            </p>
            <p className="text-[11px] text-gray-500">
              ※ 되돌릴 수 없으니 주의하세요.
            </p>
          </HelpHint>
        </div>
        {onResetTotals && (
          <button
            type="button"
            className="rounded-full bg-gray-100 px-3 py-1 text-xs hover:bg-[var(--violet-2)] hover:text-white transition"
            onClick={() => {
              if (confirm("누적 점수와 라운드 기록을 모두 초기화할까요?")) {
                onResetTotals();
              }
            }}
          >
            초기화
          </button>
        )}
      </div>

      {/* 플레이어 목록 */}
      <div className="mt-3 grid grid-cols-1 gap-3">
        {players.map(p => {
          const isLeader = p.total === top && top > 0;
          const pct = Math.min(100, Math.round((p.total / victory) * 100));

          return (
            <div
              key={p.id}
              className={`rounded-2xl p-3 transition shadow-sm ${
                isLeader
                  ? "bg-[var(--violet-3)] border border-[var(--violet-2)]"
                  : "bg-white border border-gray-200/50"
              }`}
            >
              {/* 플레이어 정보 (클릭 → 드롭다운) */}
              <button
                type="button"
                onClick={() => toggle(p.id)}
                aria-expanded={!!open[p.id]}
                className="flex w-full items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--violet-1)] text-white text-[11px]">
                    {p.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className={`text-sm ${isLeader ? "font-bold" : ""}`}>
                    {p.name}
                  </span>
                  {isLeader && (
                    <span className="ml-1 rounded-full bg-[var(--violet-2)] text-white text-[10px] px-2 py-0.5">
                      LEAD
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-sm font-semibold">
                    {p.total}점
                  </span>
                </div>
              </button>

              {/* 진행 바 */}
              <div
                className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200/50"
                aria-hidden
              >
                <div
                  className="h-full rounded-full bg-[var(--violet-1)] transition-[width]"
                  style={{ width: `${pct}%` }}
                  aria-label={`progress ${pct}%`}
                />
              </div>

              {/* 요약 칩: 접혀 있을 때만 표시 */}
              {!compact && !open[p.id] && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {rounds.map(r => (
                    <span
                      key={`${r.index}-${p.id}`}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs shadow-sm"
                    >
                      R{r.index}: +{r.scores?.[p.id] ?? 0}
                    </span>
                  ))}
                </div>
              )}

              {/* 상세 표 (드롭다운) */}
              <div
                className={`mt-3 overflow-hidden rounded-xl bg-gray-50 transition-all ${
                  open[p.id] ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {open[p.id] && (
                  <div className="p-2">
                    {rounds.length === 0 ? (
                      <div className="px-1 py-1.5 text-xs text-gray-500">
                        아직 라운드 기록이 없습니다.
                      </div>
                    ) : (
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-gray-500">
                            <th className="py-1 pl-2 text-left font-medium">
                              라운드
                            </th>
                            <th className="py-1 text-left font-medium">역할</th>
                            <th className="py-1 text-right font-medium">
                              변동
                            </th>
                            <th className="py-1 pr-2 text-right font-medium">
                              누적
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            let running = 0;
                            return rounds.map(r => {
                              const delta = r.scores?.[p.id] ?? 0;
                              running += delta;
                              const isST = (r as any).storyteller === p.id;
                              return (
                                <tr
                                  key={`${r.index}-${p.id}`}
                                  className="border-t border-gray-200/50"
                                >
                                  <td className="py-1.5 pl-2">R{r.index}</td>
                                  <td className="py-1.5">
                                    {isST ? (
                                      <span className="rounded-full bg-[var(--violet-2)]/90 px-2 py-0.5 text-white">
                                        ST
                                      </span>
                                    ) : (
                                      <span className="text-gray-500">-</span>
                                    )}
                                  </td>
                                  <td
                                    className={`py-1.5 text-right ${
                                      delta > 0
                                        ? "text-emerald-700"
                                        : delta < 0
                                        ? "text-rose-700"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {delta > 0 ? `+${delta}` : delta}
                                  </td>
                                  <td className="py-1.5 pr-2 text-right font-semibold">
                                    {running}
                                  </td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
