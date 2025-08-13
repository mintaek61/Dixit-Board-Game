import { useEffect, useRef, useState } from "react";

type Props = {
  title?: string;
  className?: string;
  children: React.ReactNode; // 도움말 내용
};

export default function HelpHint({ title, className, children }: Props) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div ref={boxRef} className={`relative ${className || ""}`}>
      <button
        type="button"
        aria-label="도움말"
        onClick={() => setOpen(v => !v)}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50"
      >
        ?
      </button>

      <div
        className={`absolute right-0 z-20 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-700 shadow-lg transition-all ${
          open
            ? "opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-1"
        }`}
        role="dialog"
        aria-modal="false"
      >
        {title && (
          <div className="mb-1 text-[13px] font-semibold text-gray-900">
            {title}
          </div>
        )}
        <div className="space-y-1">{children}</div>
      </div>
    </div>
  );
}
