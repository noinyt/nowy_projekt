'use client';

import { Task } from "@/types/task";
import Link from "next/link";
import { deleteTask, toggleStatus, updateDescription } from "@/app/actions";
import { useState } from "react";
import { ConfirmationModal } from "./ConfirmationModal";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  // State dla modala usuwania
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // State dla edycji opisu
  const [isEditing, setIsEditing] = useState(false);
  const [editedDesc, setEditedDesc] = useState(task.description);
  const [isSaving, setIsSaving] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const deleteAction = deleteTask.bind(null, task.id);
  const toggleAction = toggleStatus.bind(null, task.id);
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
        await deleteAction(); // Wywołujemy Server Action jak funkcję JS
    } catch (e) {
        console.error(e);
        setIsDeleting(false); // W razie błędu odblokuj
    }
  };
  const handleSaveDescription = async () => {
    setIsSaving(true);
    try {
      await updateDescription(task.id, editedDesc);
      setIsEditing(false); // Wyjdź z trybu edycji
    } catch (error) {
      console.error("Błąd zapisu opisu", error);
      alert("Nie udało się zapisać zmian.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleCancelEdit = () => {
    setEditedDesc(task.description);
    setIsEditing(false);
  };
  return (
    <>
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col h-full relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div onClick={() => setDeleteModalOpen(true)}
                className="text-red-500 hover:text-red-700 p-1" 
                title="Usuń zadanie"
            >
            <button className="text-red-500 hover:text-red-700 p-1" title="Usuń zadanie">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        </div>
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
      <div className="flex-1 mb-4 mt-2 group/desc relative">
            {isEditing ? (
                // TRYB EDYCJI
                <div className="space-y-2">
                    <textarea 
                        value={editedDesc}
                        onChange={(e) => setEditedDesc(e.target.value)}
                        className="w-full text-sm text-gray-700 border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-100 min-h-[80px]"
                        autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                        <button 
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 border rounded"
                        >
                            Anuluj
                        </button>
                        <button 
                            onClick={handleSaveDescription}
                            disabled={isSaving}
                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
                        >
                            {isSaving ? '...' : 'Zapisz'}
                        </button>
                    </div>
                </div>
            ) : (
                // TRYB PODGLĄDU
                <div className="relative">
                    <p className="text-gray-600 text-sm line-clamp-3 min-h-[1.25rem]">
                        {task.description}
                    </p>
                    <button 
                        onClick={() => {
                            setEditedDesc(task.description); // Resetuj tekst przy otwarciu
                            setIsEditing(true);
                        }}
                        className="absolute -top-1 -right-1 opacity-0 group-hover/desc:opacity-100 transition-opacity text-gray-400 hover:text-blue-600 bg-white/80 p-1 rounded"
                        title="Edytuj opis"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
      <div className="mt-4 pt-2 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
        <span>ID: {task.id?.substring(0,4)}...</span> 
        <span>{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : ''}</span>
      </div>
      </div>
      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Usuń zadanie"
        message={`Czy na pewno chcesz usunąć zadanie "${task.title}"? Tej operacji nie można cofnąć.`}
        confirmLabel="Usuń"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </>
  );
}