import { useEffect, useMemo, useState } from "react";

const COLOR_NAMES = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "Orange",
] as const;

export function SetupScreen({
  onStart,
}: {
  onStart: (names: string[], victory: number) => void;
}) {
  const [count, setCount] = useState(4); // 3 ~ 6
  const [useColors, setUseColors] = useState(false);
  const [names, setNames] = useState<string[]>(["", "", "", ""]);
  const [victory, setVictory] = useState<number>(30);

  // 인원 변경 시 이름 배열 길이 맞추기
  useEffect(() => {
    setNames(prev =>
      prev.length >= count
        ? prev.slice(0, count)
        : [...prev, ...Array(count - prev.length).fill("")],
    );
  }, [count]);

  // 실제 시작 시 사용할 이름 목록
  const finalNames = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const typed = names[i]?.trim();
      if (useColors || !typed) return COLOR_NAMES[i];
      return typed;
    });
  }, [count, names, useColors]);

  const canStart = finalNames.every(n => n && n.length > 0);

  return (
    <div className="mx-auto w-full max-w-md p-1">
      {/* 헤더 */}
      <div className="relative overflow-hidden rounded-t-3xl rounded-b-none bg-[var(--violet-1)] p-5 text-white">
        <div className="pointer-events-none absolute right-[-18%] top-[-28%] h-36 w-36 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute left-[-12%] bottom-[-22%] h-28 w-28 rounded-full bg-white/10" />
        <h1 className="text-2xl font-bold">Dixit 점수판</h1>
        <p className="mt-1 text-sm text-white/80">
          플레이어 인원과 이름을 설정하세요.
        </p>
      </div>

      {/* 입력 카드 */}
      <div className="rounded-t-none rounded-b-3xl border border-gray-200 bg-white p-5 shadow-sm space-y-5">
        {/* 인원 수 선택 */}
        <div>
          <div className="mb-2 text-sm font-medium text-gray-800">인원 수</div>
          <div className="flex gap-2">
            {[3, 4, 5, 6].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  count === n
                    ? "border-[var(--violet-1)] bg-[var(--violet-1)] text-white"
                    : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                {n}명
              </button>
            ))}
          </div>
        </div>

        {/* 승리 점수 선택 */}
        <div>
          <div className="mb-2 text-sm font-medium text-gray-800">
            승리 점수
          </div>
          <div className="flex gap-2">
            {[10, 20, 30].map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setVictory(v)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  victory === v
                    ? "border-[var(--violet-1)] bg-[var(--violet-1)] text-white"
                    : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                {v}점
              </button>
            ))}
          </div>
        </div>

        {/* 이름 입력 생략 필터 */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div>
            <div className="text-sm font-medium">색상 이름 표시</div>
            <div className="text-xs text-gray-500">
              활성화 시, 모든 플레이어 이름을 색상으로 대체합니다.
            </div>
          </div>
          <label className="inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={useColors}
              onChange={e => setUseColors(e.target.checked)}
            />
            <span
              className="
              relative h-6 w-11 rounded-full
              bg-gray-300 transition-colors duration-300 ease-in-out
              peer-checked:bg-[var(--violet-1)]
              /* thumb (before) */
              before:absolute before:left-1 before:top-1
              before:h-4 before:w-4 before:rounded-full before:bg-white
              before:transition-transform before:duration-300 before:ease-in-out
              peer-checked:before:translate-x-5
              "
            />
          </label>
        </div>

        {/* 이름 입력 */}
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: count }, (_, i) => (
            <label key={i} className="flex items-center gap-2">
              <span className="w-20 text-sm text-gray-500">Player {i + 1}</span>
              <input
                className="flex-1 rounded-xl border border-gray-300 bg-white p-2 text-sm focus:border-[var(--violet-1)] focus:outline-none focus:ring-2 focus:ring-[var(--violet-1)] disabled:bg-gray-100"
                placeholder={COLOR_NAMES[i]}
                disabled={useColors}
                value={names[i] ?? ""}
                onChange={e =>
                  setNames(prev =>
                    prev.map((x, idx) => (idx === i ? e.target.value : x)),
                  )
                }
              />
            </label>
          ))}
        </div>

        {/* 시작 버튼 */}
        <button
          className="w-full rounded-2xl bg-[var(--violet-1)] px-4 py-3 text-white transition hover:brightness-110 active:scale-[0.99] disabled:opacity-40"
          disabled={!canStart}
          onClick={() => onStart(finalNames, victory)}
        >
          게임 시작
        </button>

        {/* 안내 문구 */}
        <div className="rounded-md border border-purple-200 bg-purple-50 p-3 text-xs text-gray-700">
          <div className="mb-1 font-bold text-sm">점수 및 진행 규칙</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <b>일부 정답 시</b> — 스토리텔러와 맞춘 플레이어는 각각{" "}
              <b>+3점</b>, 나머지 플레이어는 자신의 카드에 들어온 표 1개당{" "}
              <b>+1점</b>
            </li>
            <li>
              <b>전원 정답 또는 오답 시</b> — 스토리텔러는 <b>추가 점수 없음</b>
              , 다른 플레이어는 자신의 카드에 들어온 표 1개당 <b>+1점</b>
            </li>
            <li>
              <b>스토리텔러 배정</b> — 첫 라운드는 랜덤 선정, 이후에는 플레이어
              순서대로 한 칸씩 돌아가며 진행
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
