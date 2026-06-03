import { useState } from 'react';

interface Props {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
}

export function PasswordField({ label, id, value, onChange, error, autoComplete, placeholder = '••••••••' }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-[18px]">
      <label htmlFor={id} className="block text-[13.5px] font-semibold text-ink-2 mb-[7px]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full font-[inherit] text-[15px] text-ink bg-[#fdfaf7] border-[1.5px] rounded-[16px] px-[15px] pr-[46px] py-[13px] outline-none transition-all duration-[180ms] placeholder:text-[#b7ada4] focus:border-accent focus:bg-white focus:shadow-[0_0_0_4px_rgba(138,27,209,.13)] ${
            error ? 'border-[#e11d48] bg-[#fff6f7]' : 'border-border-2'
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          className="absolute right-[13px] top-1/2 -translate-y-1/2 text-muted hover:text-accent-700 transition-colors"
          tabIndex={-1}
          aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
        >
          {visible ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-[12.5px] mt-[6px] text-[#e11d48] font-semibold">{error}</p>}
    </div>
  );
}
