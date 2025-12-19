'use client';
import { useActionState } from 'react';
import { authenticate } from '@/app/actions';

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-xl text-black font-bold mb-4">Zaloguj się</h1>
        <form action={formAction} className="space-y-4">
          <input name="email" type="email" placeholder="Email" required className="w-full border p-2 rounded text-black" />
          <input name="password" type="password" placeholder="Hasło" required className="w-full border p-2 rounded text-black" />
          
          <div className="text-red-500 text-sm h-4">{errorMessage}</div>
          
          <button disabled={isPending} className="w-full hover:bg-black bg-gray-800 text-white p-2 rounded">
            {isPending ? 'Logowanie...' : 'Zaloguj'}
          </button>
        </form>
      </div>
    </main>
  );
}