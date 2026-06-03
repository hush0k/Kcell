import { Brand } from './Brand';

interface AsidePoint {
  text: string;
}

interface Props {
  headline: string;
  subtext: string;
  points: AsidePoint[];
  children: React.ReactNode;
}

function CheckTick() {
  return (
    <span className="w-7 h-7 rounded-[9px] flex-none bg-white/22 grid place-items-center">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M5 12.5l4 4L19 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function AuthLayout({ headline, subtext, points, children }: Props) {
  return (
    <div className="min-h-screen grid grid-cols-[1.05fr_0.95fr] max-[860px]:grid-cols-1">
      <aside
        className="relative overflow-hidden text-white p-[56px_54px] flex flex-col justify-between max-[860px]:hidden"
        style={{
          background:
            'radial-gradient(120% 80% at 15% 10%, #c084fc 0%, transparent 55%), radial-gradient(120% 90% at 90% 90%, #e879f9 0%, transparent 50%), linear-gradient(150deg, #7314b3, #4a0d7a)',
        }}
      >
        <Brand light />

        <div>
          <h2 className="text-[40px] font-extrabold leading-[1.08] tracking-tight mb-[18px] text-balance">
            {headline}
          </h2>
          <p className="text-[16.5px] opacity-[.92] max-w-[30ch] leading-[1.55]">{subtext}</p>
        </div>

        <ul className="flex flex-col gap-[14px] list-none">
          {points.map((p, i) => (
            <li key={i} className="flex items-center gap-[13px] text-[15.5px] font-medium">
              <CheckTick />
              {p.text}
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex items-center justify-center p-[48px_40px]">
        <div className="w-full max-w-[410px]">{children}</div>
      </main>
    </div>
  );
}
