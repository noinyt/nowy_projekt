import { TaskList } from "@/components/TaskList";
import { prisma } from "@/lib/db";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import { signOut } from "@/../auth";
export default async function Home() {
  
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  if (!currentUser) {
    signOut();
    redirect("/login");
  }
  const tasks = await prisma.task.findMany({
    where: {
      userId: currentUser.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const serializedTasks = tasks.map(t => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    status: t.status as any, 
    priority: t.priority as any
  }));

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menedżer Zadań</h1>
          <p className="text-gray-500">Zalogowany jako: <span className="font-semibold text-black">{session.user.name}</span></p>
        </div>
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button className="text-sm text-red-600 hover:text-red-800 underline">
            Wyloguj się
          </button>
        </form>
      </div>

      <div className="max-w-5xl mx-auto">
        <TaskList initialTasks={serializedTasks} />
      </div>
    </main>
  );
}