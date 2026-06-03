import { TaskItem } from './TaskItem';
import type { Task, TaskStatus } from '../types';

type SortDir = 'asc' | 'desc';
type Filter = 'all' | TaskStatus;

interface Props {
  tasks: Task[];
  sortDir: SortDir;
  filter: Filter;
  onMarkDone: (id: number) => void;
}

export function TaskList({ tasks, sortDir, filter, onMarkDone }: Props) {
  let view = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  view = [...view].sort((a, b) => {
    const r = a.title.localeCompare(b.title, 'ru', { sensitivity: 'base' });
    return sortDir === 'asc' ? r : -r;
  });

  if (view.length === 0) {
    return (
      <div className="text-center py-[60px] px-5 text-muted border-2 border-dashed border-border-2 rounded-lg">
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" className="opacity-40 mb-3 mx-auto">
          <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-[15px] font-semibold">Здесь пока пусто. Создайте первую задачу!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {view.map(task => (
        <TaskItem key={task.id} task={task} onMarkDone={onMarkDone} />
      ))}
    </div>
  );
}
