"use client";

import { useLogout } from "@/lib/hooks";
import Link from "next/link";
import { Sidebar } from "@/components/shared/sidebar/Sidebar";
import type { User } from "@/lib/types";

interface HomeAuthenticatedProps {
  user: User;
}

function calcularIdade(dateBirth?: string | Date): number | null {
  if (!dateBirth) {
    return null;
  }
  const birth = new Date(dateBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function HomeAuthenticated({ user }: HomeAuthenticatedProps) {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const idade = calcularIdade(user.date_birth);

  return (
    <div className="min-h-screen flex bg-[hsl(var(--color-background))]">
      <Sidebar />
      <main className="flex-1 flex flex-col items-start justify-start px-8 py-12 sm:px-16 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--color-primary))] mb-2">
          Bem-vindo, {user.name}!
        </h1>
        <p className="text-base text-[hsl(var(--color-muted-foreground))] mb-8">
          {idade !== null ? `Idade: ${idade} anos` : ""}
        </p>
        <div className="flex gap-4">
          <Link
            href="/perfil"
            className="bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] px-5 py-2 rounded-md shadow transition hover:brightness-95 font-medium"
          >
            Perfil
          </Link>
          <button
            className="bg-[hsl(var(--color-destructive))] text-[hsl(var(--color-destructive-foreground))] px-5 py-2 rounded-md shadow transition hover:brightness-95 font-medium"
            onClick={() => logout()}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Saindo..." : "Sair"}
          </button>
        </div>
      </main>
    </div>
  );
}
