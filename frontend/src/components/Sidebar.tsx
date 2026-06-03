import { useNavigate } from 'react-router-dom';
import { Brand } from './Brand';
import { DonutChart } from './DonutChart';
import type { Task, User } from '../types';

interface Props {
  tasks: Task[];
  user: User | null;
  onLogout: () => void;
}

export function Sidebar({ tasks, user, onLogout }: Props) {
  const navigate = useNavigate();
  const done = tasks.filter(t => t.status === 'done').length;
  const total = tasks.length;
  const initial = (user?.first_name || user?.username || 'U')[0].toUpperCase();
  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : 'Пользователь';

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <aside className="bg-surface border-r border-border p-[26px_22px] flex flex-col gap-[26px] sticky top-0 h-screen overflow-y-auto">
      <Brand />

      <div className="bg-accent-softer border border-border rounded-lg p-[22px_20px]">
        <h3 className="text-[13px] font-bold uppercase tracking-[.06em] text-muted mb-[18px]">Прогресс</h3>
        <DonutChart done={done} total={total} />
      </div>

      <div className="flex gap-3">
        <div className="flex-1 bg-surface border border-border rounded-[16px] p-[14px]">
          <div className="text-[26px] font-extrabold tracking-tight">{total}</div>
          <div className="text-[12px] font-semibold text-muted mt-[2px]">Всего задач</div>
        </div>
        <div className="flex-1 bg-surface border border-border rounded-[16px] p-[14px]">
          <div className="text-[26px] font-extrabold tracking-tight">{done}</div>
          <div className="text-[12px] font-semibold text-muted mt-[2px]">Завершено</div>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-3 pt-[18px] border-t border-border">
        <div className="w-[42px] h-[42px] rounded-[13px] flex-none bg-gradient-to-br from-purple-400 to-accent-600 text-white font-extrabold text-[16px] grid place-items-center">
          {initial}
        </div>
        <div className="leading-[1.25]">
          <div className="font-bold text-[14.5px]">{fullName}</div>
          <div className="text-[12.5px] text-muted">@{user?.username}</div>
        </div>
        <button onClick={handleLogout} title="Выйти" className="ml-auto text-muted hover:text-accent-700 grid place-items-center transition-colors">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
            <path d="M15 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
