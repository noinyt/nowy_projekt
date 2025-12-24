'use client';

import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react"; // Używamy client-side signOut
import { ConfirmationModal } from "./ConfirmationModal";

interface NavbarProps {
  user?: { email?: string | null; role?: string } | null;
}

export function Navbar({ user }: NavbarProps) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: '/' });
  };
  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-gray-600">TaskManager</Link>

          <div className="flex gap-4 items-center text-sm font-medium">
            <Link href="/" className="bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800">Dashboard</Link>
            
            {user ? (
              <>
                <Link href="/tasks" className="bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800">Moje Zadania</Link>
                {user.role === 'ADMIN' && (
                   <Link href="/admin" className="bg-purple-200 text-purple-600 hover:text-purple-800">Panel Admina</Link>
                )}
                
                <div className="border-l pl-4 ml-2 flex gap-4 items-center">
                    <span className="text-gray-400 text-xs hidden sm:inline">{user.email}</span>
                    <button 
                        onClick={() => setModalOpen(true)} 
                        className="text-red-600 hover:text-red-800"
                    >
                        Wyloguj
                    </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800">Zaloguj</Link>
                <Link href="/register" className="bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800">Rejestracja</Link>
              </>
            )}
          </div>
        </div>
          </nav>
          <ConfirmationModal
                isOpen={isModalOpen}
                title="Potwierdzenie Wylogowania"
                message="Czy na pewno chcesz się wylogować?"
                confirmLabel="Wyloguj"
                cancelLabel="Anuluj"
                isDangerous={true}
                isLoading={isLoggingOut}
                onClose={() => setModalOpen(false)}
                onConfirm={handleLogout}
          />
    </>
  );
}