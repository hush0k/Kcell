import type { Task } from '../types';

function formatRelative(dateStr: string): string {
  const ts = new Date(dateStr).getTime();
  const diff = Date.now() - ts;
  const min = 60_000, hour = 3_600_000, day = 86_400_000;
  if (diff < min) return 'только что';
  if (diff < hour) return `${Math.floor(diff / min)} мин назад`;
  if (diff < day) return `${Math.floor(diff / hour)} ч назад`;
  if (diff < 7 * day) return `${Math.floor(diff / day)} дн назад`;
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' });
}

interface Props {
  task: Task;
  onMarkDone: (id: number) => void;
}

export function TaskItem({ task, onMarkDone }: Props) {
  const isDone = task.status === 'done';

  return (
    <div
      className={`border rounded-lg p-[18px_20px] flex items-center gap-[18px] shadow-sm hover:shadow transition-all ${
        isDone ? 'bg-accent-softer border-border' : 'bg-surface border-border hover:border-border-2'
      }`}
    >
      <span className="text-[12px] font-bold text-muted font-[tabular-nums] bg-[var(--bg)] border border-border rounded-[8px] px-2 py-1 flex-none">
        #{String(task.id).padStart(2, '0')}
      </span>

      <div className="flex-1 min-w-0">
        <div className={`text-[16.5px] font-bold tracking-tight ${isDone ? 'text-ink-2 line-through decoration-[rgba(180,160,140,.6)]' : ''}`}>
          {task.title}
        </div>
        <div className="flex gap-4 mt-[6px] text-[12.5px] text-muted flex-wrap">
          <span
            className={`inline-flex items-center gap-[6px] text-[12px] font-bold px-[11px] py-[5px] rounded-full flex-none ${
              isDone ? 'bg-done-soft text-done' : 'bg-pending-soft text-pending'
            }`}
          >
            <span className={`w-[6px] h-[6px] rounded-full ${isDone ? 'bg-done' : 'bg-pending'}`} />
            {isDone ? 'Выполнено' : 'В ожидании'}
          </span>
          <span>
            Создано: <b className="font-semibold text-ink-2">{formatRelative(task.created_at)}</b>
          </span>
          <span>
            Обновлено: <b className="font-semibold text-ink-2">{formatRelative(task.updated_at)}</b>
          </span>
        </div>
      </div>

      <div className="flex-none">
        {isDone ? (
          <span className="inline-flex items-center gap-[7px] font-extrabold text-[14px] text-done">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" fill="#16a34a" />
              <path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Done!
          </span>
        ) : (
          <button
            onClick={() => onMarkDone(task.id)}
            className="font-bold text-[13.5px] rounded-full px-[18px] py-[9px] border-[1.5px] border-accent bg-surface text-accent-700 hover:bg-accent hover:text-white hover:shadow-accent transition-all inline-flex items-center gap-[7px]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Done
          </button>
        )}
      </div>
    </div>
  );
}
