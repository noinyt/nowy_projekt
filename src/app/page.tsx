import { prisma } from "@/lib/db";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import { signOut } from "@/../auth";
import { StatsDashboard } from "@/components/StatsDashboard";
export default async function Home() {
  
  const session = await auth();
  // --- POBIERANIE STATYSTYK (Dla Dashboardu) ---
  const userCount = await prisma.user.count();
  
  // GroupBy w Prisma (agregacja statusów)
  const stats = await prisma.task.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
  });
  const taskStats = stats.map(s => ({ status: s.status, count: s._count.status }));
  if (!session?.user?.email) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Witaj w TaskManager</h1>
            <StatsDashboard userCount={userCount} taskStats={taskStats} />
            <div className="text-center mt-12">
                <p className="text-lg text-gray-600 mb-4">Zaloguj się, aby zarządzać swoimi zadaniami.</p>
            </div>
        </div>
      </main>
    );
  }
  const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!currentUser) {
    signOut();
    redirect("/");
  }

  return (
    <main className="min-h-scree p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl text-gray-950 mb-6">Dashboard</h1>
         <StatsDashboard userCount={userCount} taskStats={taskStats} />
       </div>
    </main>
  );
}