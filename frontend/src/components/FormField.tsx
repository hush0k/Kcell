import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormField({ label, error, id, ...props }: Props) {
  return (
    <div className="mb-[18px]">
      <label htmlFor={id} className="block text-[13.5px] font-semibold text-ink-2 mb-[7px]">
        {label}
      </label>
      <input
        id={id}
        className={`w-full font-[inherit] text-[15px] text-ink bg-[#fdfaf7] border-[1.5px] rounded-[16px] px-[15px] py-[13px] outline-none transition-all duration-[180ms] placeholder:text-[#b7ada4] focus:border-accent focus:bg-white focus:shadow-[0_0_0_4px_rgba(138,27,209,.13)] ${
          error ? 'border-[#e11d48] bg-[#fff6f7]' : 'border-border-2'
        }`}
        {...props}
      />
      {error && <p className="text-[12.5px] mt-[6px] text-[#e11d48] font-semibold">{error}</p>}
    </div>
  );
}
