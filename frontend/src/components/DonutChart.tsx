import { PieChart, Pie, Cell } from 'recharts';

interface Props {
  done: number;
  total: number;
}

export function DonutChart({ done, total }: Props) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  const pending = total - done;

  const data = [
    { value: done || 0 },
    { value: pending || 1 },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <PieChart width={168} height={168}>
          <Pie
            data={data}
            cx={84}
            cy={84}
            innerRadius={52}
            outerRadius={66}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            animationBegin={0}
            animationDuration={700}
            animationEasing="ease-in-out"
            strokeWidth={0}
          >
            <Cell fill="#8a1bd1" />
            <Cell fill="#ece4f4" />
          </Pie>
        </PieChart>

        <div className="absolute inset-0 grid place-items-center text-center pointer-events-none">
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
