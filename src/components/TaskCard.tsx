'use client';

import { Task } from "@/types/task";
import Link from "next/link";
import { deleteTask, toggleStatus } from "@/app/actions";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const deleteAction = deleteTask.bind(null, task.id);
  const toggleAction = toggleStatus.bind(null, task.id);

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col h-full relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <form action={deleteAction}>
            <button className="text-red-500 hover:text-red-700 p-1" title="Usuń zadanie">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        </form>
      </div>
      <div className="flex justify-between items-start mb-2">
        <form action={toggleAction}>
             <button type="submit" className={`text-xs font-semibold px-2 py-1 rounded-full cursor-pointer hover:opacity-80 ${getStatusColor(task.status)}`}>
                {task.status}
             </button>
        </form> 
        <span className="text-xs text-gray-400 mr-6">
          {task.priority}
        </span>
      </div>
      <Link href={`/tasks/${task.id}`} className="hover:underline">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {task.title}
        </h3>
      </Link>
      <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
        {task.description}
      </p>
      <div className="mt-4 pt-2 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
        <span>ID: {task.id?.substring(0,4)}...</span> 
        <span>{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : ''}</span>
      </div>
    </div>
  );
}