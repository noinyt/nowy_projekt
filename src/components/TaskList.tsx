'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './TaskCard';
import { createTask } from '@/app/actions';

interface TaskListProps {
  initialTasks: Task[];
  targetUserId?: string;
}

export function TaskList({ initialTasks, targetUserId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<'ALL' | TaskStatus>('ALL');

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const createAction = createTask.bind(null, targetUserId || null);

  const clientAction = async (formData: FormData) => {
    await createAction(formData);
    const form = document.querySelector('form') as HTMLFormElement;
    form?.reset();
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'ALL') return true;
    return task.status === filter;
  });

  const buttonColor = targetUserId ? 'bg-purple-600 hover:bg-purple-700' : 'bg-black hover:bg-gray-800';
  const placeholderText = targetUserId ? "Dodaj zadanie dla tego użytkownika..." : "Co masz do zrobienia?";

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        
        <form action={clientAction} className="flex gap-2 mb-4">
          <input
            name="title"
            type="text"
            placeholder={placeholderText}
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-black"
            required
          />
          <button 
            type="submit"
            className={`${buttonColor} text-white px-4 py-2 rounded transition`}
          >
            {targetUserId ? 'Dodaj (Admin)' : 'Dodaj'}
          </button>
        </form>

        <div className="flex gap-2 text-sm">
             <span className="text-gray-500 py-1">Filtruj:</span>
             {(['ALL', 'TODO', 'IN_PROGRESS', 'DONE'] as const).map((s) => (
                <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1 rounded border ${
                    filter === s 
                    ? 'bg-gray-900 text-white border-gray-900' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
                >
                {s === 'ALL' ? 'Wszystkie' : s}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
            ))
        ) : (
            <p className="text-gray-500 col-span-full text-center py-10">
                {targetUserId ? 'Ten użytkownik nie ma zadań.' : 'Brak zadań.'}
            </p>
        )}
      </div>
    </div>
  );
}