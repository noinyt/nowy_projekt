import { auth } from "@/../auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { TaskList } from "@/components/TaskList";
import { Pagination } from "@/components/Pagination";
import Link from "next/link";

interface Props {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminUserTasksPage({ params, searchParams }: Props) {
  const session = await auth();
  
  if ((session?.user as any)?.role !== 'ADMIN') {
    redirect('/');
  }
  const { userId } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const PAGE_SIZE = 6;

  const userToCheck = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!userToCheck) {
    return <div className="p-8">Użytkownik nie istnieje.</div>;
  }
  const totalTasks = await prisma.task.count({
    where: { userId: userId }
  });
  const tasks = await prisma.task.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
    take: PAGE_SIZE,
    skip: (currentPage - 1) * PAGE_SIZE
  });
  const serializedTasks = tasks.map(t => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    status: t.status as any,
    priority: t.priority as any
  }));

  return (
    <main className="min-h-scree p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
            <div>
                <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block">
                &larr; Wróć do listy użytkowników
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                    Zarządzanie użytkownikiem: <span className="text-purple-600">{userToCheck.email}</span>
                </h1>
                <p className="text-sm text-gray-500 mt-1">Panel Administratora</p>
            </div>
        </div>
        <TaskList initialTasks={serializedTasks} targetUserId={userId} />
        <Pagination totalItems={totalTasks} pageSize={PAGE_SIZE} baseUrl={`/admin/tasks/${userId}`} />
      </div>
    </main>
  );
}