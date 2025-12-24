'use client';

import { useState } from "react";
import { deleteUser } from "@/app/actions";
import { ConfirmationModal } from "./ConfirmationModal";

interface DeleteUserButtonProps {
  userId: string;
}

export function DeleteUserButton({ userId }: DeleteUserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteUser(userId);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-red-600 hover:text-red-900 font-bold text-sm"
      >
        Usuń
      </button>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Usuń użytkownika"
        message="Czy na pewno chcesz usunąć tego użytkownika? Zostaną usunięte również WSZYSTKIE jego zadania."
        confirmLabel="Usuń definitywnie"
        isDangerous={true}
        isLoading={isLoading}
      />
    </>
  );
}