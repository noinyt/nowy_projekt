import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/../auth";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TaskPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const task = await prisma.task.findUnique({ where: { id: id } });

  if (!task) {
    return <div className="p-8">Nie znaleziono zadania</div>;
  }

  let backLink = "/";
  let backLabel = "Wróć do listy";

  if (session?.user?.email) {
    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (currentUser?.role === 'ADMIN') {
        backLink = `/admin/tasks/${task.userId}`;
        backLabel = "Wróć do panelu użytkownika";
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Link href={backLink} className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block items-center gap-1">
          <span>&larr;</span> {backLabel}
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
           <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-500">
              {task.status}
            </span>
          </div>

          <div className="prose max-w-none text-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Opis</h3>
            <p className="whitespace-pre-wrap">{task.description}</p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span className="block font-medium text-gray-900">Priorytet</span>
              {task.priority}
            </div>
            <div>
              <span className="block font-medium text-gray-900">Utworzono</span>
              {new Date(task.createdAt).toLocaleDateString()}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}