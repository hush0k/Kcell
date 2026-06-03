import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TaskList } from './TaskList';
import { CreateTaskModal } from './CreateTaskModal';
import { Toast } from './Toast';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../hooks/useToast';
import type { TaskStatus } from '../types';

type SortDir = 'asc' | 'desc';
type Filter = 'all' | TaskStatus;

function SegButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`font-semibold text-[13.5px] border-none cursor-pointer px-[15px] py-[7px] rounded-full transition-all inline-flex items-center gap-[6px] ${
        active ? 'bg-accent text-white shadow-accent' : 'bg-transparent text-ink-2 hover:text-accent-700'
      }`}
    >
      {children}
    </button>
  );
}

export function TasksPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { tasks, loading, fetchTasks, createTask, markDone } = useTasks();
  const { message, showToast } = useToast();

  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filter, setFilter] = useState<Filter>('all');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    fetchTasks();
  }, []);

  const handleCreate = async (title: string) => {
    await createTask(title);
    showToast('Задача создана');
  };

  const handleMarkDone = async (id: number) => {
    await markDone(id);
    showToast('Задача выполнена 🎉');
  };

  const done = tasks.filter(t => t.status === 'done').length;
  const subText = tasks.length
    ? `${done} из ${tasks.length} задач выполнено`
    : 'Управляйте задачами и отмечайте выполненные.';

  return (
    <>
      <div className="grid grid-cols-[296px_1fr] min-h-screen max-[880px]:grid-cols-1">
        <Sidebar tasks={tasks} user={user} onLogout={logout} />

        <main className="p-[34px_40px_60px] max-w-[1100px] max-[880px]:p-[26px_20px_50px]">
          <div className="flex items-start justify-between gap-5 mb-[26px]">
            <div>
              <h1 className="text-[30px] font-extrabold tracking-tight">Мои задачи</h1>
              <p className="text-muted text-[15px] mt-[3px]">{subText}</p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="font-bold text-[15px] text-white rounded-full px-[22px] py-[13px] bg-gradient-to-br from-purple-400 to-accent-600 shadow-accent hover:shadow-accent-hover transition-all inline-flex items-center gap-[9px] flex-none"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              Новая задача
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap mb-5">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-muted">Сортировка</span>
              <div className="inline-flex bg-surface border-[1.5px] border-border-2 rounded-full p-1 gap-[2px] shadow-sm">
                <SegButton active={sortDir === 'asc'} onClick={() => setSortDir('asc')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M7 4v16M7 4L3 8M7 4l4 4M14 7h7M14 12h5M14 17h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  А→Я
                </SegButton>
                <SegButton active={sortDir === 'desc'} onClick={() => setSortDir('desc')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M7 4v16M7 20l-4-4M7 20l4-4M14 7h7M14 12h5M14 17h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Я→А
                </SegButton>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-2">
              <span className="text-[13px] font-semibold text-muted">Статус</span>
              <div className="inline-flex bg-surface border-[1.5px] border-border-2 rounded-full p-1 gap-[2px] shadow-sm">
                <SegButton active={filter === 'all'} onClick={() => setFilter('all')}>Все</SegButton>
                <SegButton active={filter === 'pending'} onClick={() => setFilter('pending')}>В ожидании</SegButton>
                <SegButton active={filter === 'done'} onClick={() => setFilter('done')}>Выполнено</SegButton>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-muted font-semibold">Загрузка…</div>
          ) : (
            <TaskList tasks={tasks} sortDir={sortDir} filter={filter} onMarkDone={handleMarkDone} />
          )}
        </main>
      </div>

      <CreateTaskModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
      <Toast message={message} />
    </>
  );
}
