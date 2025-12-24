import { auth } from "@/../auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Pagination } from "@/components/Pagination";
import { DeleteUserButton } from "@/components/DeleteUserButton";
import Link from "next/link";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const session = await auth();

  // Podwójne zabezpieczenie
  if ((session?.user as any)?.role !== 'ADMIN') {
    redirect('/');
  }

  const params = await searchParams;
    const currentPage = Number(params?.page) || 1;
    const PAGE_SIZE = 10;

    const totalUsers = await prisma.user.count();
    
    const users = await prisma.user.findMany({
        include: { _count: { select: { tasks: true } } },
        orderBy: { createdAt: 'desc' },
        take: PAGE_SIZE,
        skip: (currentPage - 1) * PAGE_SIZE
    });

  return (
    <main className="min-h-scree p-8">
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
                    {user.email !== session?.user?.email && (<DeleteUserButton userId={user.id} />)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination totalItems={totalUsers} pageSize={PAGE_SIZE} baseUrl="/admin" />
        </div>
      </div>
    </main>
  );
}