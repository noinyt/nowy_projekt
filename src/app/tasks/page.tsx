// src/app/tasks/page.tsx
import { auth } from "@/../auth";
import { prisma } from "@/lib/db";
import { TaskList } from "@/components/TaskList";
import { Pagination } from "@/components/Pagination";
import { redirect } from "next/navigation";

export default async function TasksPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const session = await auth();

  // Middleware niby chroni, ale double-check nie zaszkodzi
  if (!session?.user?.email) redirect("/login");

  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const PAGE_SIZE = 6;

  const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  
  if (!currentUser) return <div>Błąd konta</div>;

  const totalTasks = await prisma.task.count({ where: { userId: currentUser.id } });

  const tasks = await prisma.task.findMany({
    where: { userId: currentUser.id },
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
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
       <div className="max-w-5xl mx-auto">
         <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Twoje Zadania</h1>
         <TaskList initialTasks={serializedTasks} />
         <Pagination totalItems={totalTasks} pageSize={PAGE_SIZE} baseUrl="/tasks" />
       </div>
    </main>
  );
}