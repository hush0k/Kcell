import { useState, useCallback } from 'react';
import { tasksApi } from '../lib/api';
import type { Task, TaskStatus } from '../types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.getAll();
      setTasks(data.tasks);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (title: string): Promise<Task> => {
    const task = await tasksApi.create(title);
    setTasks(prev => [...prev, task]);
    return task;
  };

  const markDone = async (id: number): Promise<void> => {
    const task = await tasksApi.update(id, 'done');
    setTasks(prev => prev.map(t => (t.id === id ? task : t)));
  };

  return { tasks, loading, error, fetchTasks, createTask, markDone };
}
