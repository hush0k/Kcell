const PATH_LENGTH = 327;

interface Props {
  done: number;
  total: number;
}

export function DonutChart({ done, total }: Props) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  const arc = (pct / 100) * PATH_LENGTH;
  const pending = total - done;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[168px] h-[168px]">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#ece4f4" strokeWidth="14" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#8a1bd1"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${arc} ${PATH_LENGTH}`}
            pathLength={PATH_LENGTH}
            className="transition-[stroke-dasharray] duration-700 ease-[cubic-bezier(.4,0,.2,1)]"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-[34px] font-extrabold leading-none tracking-tight">{pct}%</div>
            <div className="text-[11.5px] font-semibold text-muted mt-[3px] uppercase tracking-[.05em]">выполнено</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[11px] mt-5 w-full">
        <div className="flex items-center gap-[10px] text-[14px] font-semibold">
          <span className="w-[13px] h-[13px] rounded-[5px] flex-none bg-accent" />
          Выполнено
          <span className="ml-auto font-extrabold text-ink">{done}</span>
        </div>
        <div className="flex items-center gap-[10px] text-[14px] font-semibold">
          <span className="w-[13px] h-[13px] rounded-[5px] flex-none bg-[#ece4f4] shadow-[inset_0_0_0_1.5px_#ddd0ec]" />
          В ожидании
          <span className="ml-auto font-extrabold text-ink">{pending}</span>
        </div>
      </div>
    </div>
  );
}
