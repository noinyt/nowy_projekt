import { auth } from "@/../auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { TaskList } from "@/components/TaskList";
import Link from "next/link";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function AdminUserTasksPage({ params }: Props) {
  const session = await auth();

  if ((session?.user as any)?.role !== 'ADMIN') {
    redirect('/');
  }

  const { userId } = await params;

  const userToCheck = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tasks: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!userToCheck) {
    return <div className="p-8">Użytkownik nie istnieje.</div>;
  }

  const serializedTasks = userToCheck.tasks.map(t => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    status: t.status as any,
    priority: t.priority as any
  }));

  return (
    <main className="min-h-screen bg-gray-100 p-8">
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

      </div>
    </main>
  );
}