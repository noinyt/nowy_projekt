'use server';
import { auth } from "@/../auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs"; 
import { redirect } from "next/navigation"; 
import { signIn } from "../../auth";
import { AuthError } from "next-auth";

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if ((error as Error).message.includes('NEXT_REDIRECT')) {
        throw error;
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Błędne dane logowania.';
        default:
          return 'Coś poszło nie tak.';
      }
    }
    throw error;
  }
}

export async function createTask(targetUserId: string | null, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!currentUser) throw new Error("User not found");

  let ownerId = currentUser.id;

  if (targetUserId) {
    if (currentUser.role !== 'ADMIN') {
        throw new Error("Tylko administrator może dodawać zadania innym użytkownikom.");
    }
    ownerId = targetUserId;
  }

  const title = formData.get('title') as string;
  if (!title) return;

  await prisma.task.create({
    data: {
      title,
      description: targetUserId ? "Zadanie dodane przez Administratora" : "Opis dodany z bazdy",
      status: "TODO",
      priority: "MEDIUM",
      userId: ownerId
    },
  });

  revalidatePath('/');
  revalidatePath('/admin/tasks/[userId]', 'page');
}

export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  // Pobieramy aktualnie zalogowanego użytkownika (żeby sprawdzić czy jest adminem)
  const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });

  // Pobieramy zadanie, które chcemy usunąć
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw new Error("Zadanie nie istnieje");
  }

  // LOGIKA UPRAWNIEŃ:
  // Pozwól usunąć, jeśli:
  // 1. Użytkownik jest właścicielem zadania (task.userId === currentUser.id)
  // 2. LUB Użytkownik jest administratorem (currentUser.role === 'ADMIN')
  const isOwner = task.userId === currentUser?.id;
  const isAdmin = currentUser?.role === 'ADMIN';

  if (!isOwner && !isAdmin) {
     throw new Error("Nie masz uprawnień do usunięcia tego zadania");
  }

  await prisma.task.delete({
    where: { id: taskId }
  });

  // Revalidate: Odświeżamy zarówno stronę główną (dla usera), jak i admina
  revalidatePath('/');
  revalidatePath('/admin/tasks/[userId]', 'page'); // Odśwież widok admina
}

// Prosta zmiana statusu (np. TODO -> DONE)
export async function toggleStatus(taskId: string) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    // 1. Pobieramy dane zalogowanego użytkownika (żeby sprawdzić jego ID i ROLĘ)
    const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    
    if (!currentUser) throw new Error("Błąd użytkownika");

    // 2. ZMIANA: Pobieramy zadanie TYLKO po ID. 
    // Nie filtrujemy tu po userId, bo admin też musi je znaleźć.
    const task = await prisma.task.findUnique({
        where: { id: taskId }
    });

    if (!task) throw new Error("Zadanie nie znalezione");

    const isOwner = task.userId === currentUser.id;
    const isAdmin = currentUser.role === 'ADMIN';

    // Jeśli nie jesteś ani właścicielem, ani adminem -> Stop.
    if (!isOwner && !isAdmin) {
        throw new Error("Brak uprawnień do zmiany statusu tego zadania");
    }

    const getNextStatus = (status: string) => {
        if (status === 'TODO') return 'IN_PROGRESS';
        if (status === 'IN_PROGRESS') return 'DONE';
        return 'TODO'; // Jeśli DONE to wraca na TODO
    };

    const newStatus = getNextStatus(task.status);

    await prisma.task.update({
        where: { id: taskId },
        data: { status: newStatus }
    });

    revalidatePath('/');
    revalidatePath('/admin/tasks/[userId]', 'page');
}

// Definiujemy typ zwracanego stanu
export type RegisterState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
};

// Funkcja rejestrująca użytkownika
export async function registerUser(prevState: RegisterState, formData: FormData): Promise<RegisterState>{
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  const errors: RegisterState['errors'] = {};

  if (!email || !email.includes('@')) {
    errors.email = ["Niepoprawny format email"];
  }
  if (!password || password.length < 6) {
    errors.password = ["Niepoprawny format hasła, powinno mieć minimum 6 znaków"];
  }
  if (!name || name.trim().length === 0) {
    errors.name = ['Nazwa jest wymagana'];
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const [existingEmail, existingUser] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.user.findUnique({ where: { name } })
  ]);

  if (existingEmail) {
    errors.email = ['Ten email jest już zajęty'];
  }

  if (existingUser) {
    errors.name = ['Ta nazwa użytkownika jest już zajęta'];
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  };
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      name: name,
      role: 'USER' // Domyślna rola
    }
  });

  console.log("Utworzono użytkownika:", name);
  redirect('/login');
}
export async function deleteUser(userId: string) {
  const session = await auth();
  const currentUser = await prisma.user.findUnique({ where: { email: session?.user?.email || '' } });
  
  if (currentUser?.role !== 'ADMIN') {
    throw new Error("Brak uprawnień administratorskich!");
  }
  await prisma.user.delete({
    where: { id: userId }
  });

  revalidatePath('/admin');
}