'use client'; // Formularz wymaga interakcji
import { useActionState } from 'react';
import { registerUser } from "@/app/actions";

const initialState = { errors: {} };
export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(registerUser, initialState);
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Rejestracja</h1>
        
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nazwa</label>
            <input name="name" type="text" required className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-black" />
            {state.errors?.name && (
             <p className="text-red-500 text-sm mb-4">{state.errors?.name}</p>
             )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input name="email" type="email" required className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-black" />
            {state.errors?.email && (
             <p className="text-red-500 text-sm mb-4">{state.errors?.email}</p>
             )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Hasło</label>
                      <input name="password" type="password" required className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-black" />
            {state.errors?.password && (
             <p className="text-red-500 text-sm mb-4">{state.errors?.password}</p>
             )}
            </div>
                  <button disabled={isPending} type="submit" className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition">
                {isPending ? 'Rejestrowanie...' : 'Zarejestruj'}
            </button>
        </form>
      </div>
    </main>
  );
}