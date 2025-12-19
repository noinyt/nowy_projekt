import { auth } from "@/../auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { deleteUser } from "@/app/actions";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();

  // Podwójne zabezpieczenie
  if ((session?.user as any)?.role !== 'ADMIN') {
    redirect('/');
  }

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { tasks: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel Administratora</h1>
          <Link href="/" className="text-blue-600 hover:underline">Wróć do aplikacji</Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nazwa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rola</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zadania</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcje</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                  <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name || '—'}
                          {user.email === session?.user?.email && <span className="ml-2 text-green-600">(Ty)</span>}
                      </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href={`/admin/tasks/${user.id}`}className="text-blue-600 hover:text-blue-900 font-medium">Pokaż zadania ({user._count.tasks})</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.email !== session?.user?.email && (
                      <form action={async () => {
                        'use server';
                        await deleteUser(user.id);
                      }}>
                        <button className="text-red-600 hover:text-red-900 font-bold">Usuń</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}