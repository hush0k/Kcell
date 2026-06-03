interface Props {
  light?: boolean;
}

export function Brand({ light }: Props) {
  return (
    <span className={`inline-flex items-center gap-[11px] font-extrabold text-[20px] tracking-tight no-underline ${light ? 'text-white' : 'text-ink'}`}>
      <span
        className={`w-[38px] h-[38px] rounded-[12px] grid place-items-center flex-none ${
          light
            ? 'bg-white/20 backdrop-blur-sm'
            : 'bg-gradient-to-br from-purple-400 to-accent-600 shadow-accent'
        }`}
      >
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
          <path d="M4 12.5l5 5L20 6" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      TaskFlow
    </span>
  );
}
