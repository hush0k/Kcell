import { useEffect, useRef, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string) => Promise<void>;
}

export function CreateTaskModal({ open, onClose, onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
    else { setTitle(''); setError(''); }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Введите название задачи'); return; }
    setLoading(true);
    try {
      await onCreate(title.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ошибка создания');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      className={`fixed inset-0 bg-ink/40 backdrop-blur-[3px] grid place-items-center z-[100] transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      <div
        className={`bg-surface rounded-xl p-[30px_30px_26px] w-[92%] max-w-[460px] shadow-lg transition-transform duration-250 ${open ? 'translate-y-0 scale-100' : 'translate-y-[14px] scale-[.97]'}`}
        style={{ transition: 'transform .25s cubic-bezier(.34,1.56,.64,1)' }}
      >
        <div className="flex items-center gap-[13px] mb-[6px]">
          <span className="w-[44px] h-[44px] rounded-[13px] flex-none grid place-items-center bg-accent-soft text-accent-700">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 className="text-[21px] font-extrabold tracking-tight">Новая задача</h2>
        </div>
        <p className="text-muted text-[14px] mb-5">Введите название — остальное заполнится автоматически.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-0">
            <label htmlFor="taskTitle" className="block text-[13.5px] font-semibold text-ink-2 mb-[7px]">
              Название задачи
            </label>
            <input
              ref={inputRef}
              id="taskTitle"
              type="text"
              placeholder="например, Подготовить отчёт"
              autoComplete="off"
              value={title}
              onChange={e => { setTitle(e.target.value); setError(''); }}
              className={`w-full font-[inherit] text-[15px] text-ink bg-[#fdfaf7] border-[1.5px] rounded-[16px] px-[15px] py-[13px] outline-none transition-all duration-[180ms] placeholder:text-[#b7ada4] focus:border-accent focus:bg-white focus:shadow-[0_0_0_4px_rgba(138,27,209,.13)] ${
                error ? 'border-[#e11d48] bg-[#fff6f7]' : 'border-border-2'
              }`}
            />
            {error && <p className="text-[12.5px] mt-[6px] text-[#e11d48] font-semibold">{error}</p>}
          </div>

          <div className="flex gap-3 mt-[22px]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 font-bold text-[15px] bg-surface text-ink border-[1.5px] border-border-2 rounded-full px-[22px] py-[13px] shadow-sm hover:border-accent hover:text-accent-700 transition-all"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 font-bold text-[15px] text-white rounded-full px-[22px] py-[13px] bg-gradient-to-br from-purple-400 to-accent-600 shadow-accent hover:shadow-accent-hover transition-all disabled:opacity-60"
            >
              {loading ? 'Создаём…' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
