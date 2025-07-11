import { requireAuth } from "@/lib/server-auth";
import Link from "next/link";

export default async function PerfilPage() {
  const user = await requireAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(var(--color-background))] px-4 py-12">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-[hsl(var(--color-primary))] mb-6 text-center">
          Meu Perfil
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--color-muted-foreground))] mb-1">
              Nome
            </label>
            <p className="text-[hsl(var(--color-foreground))] font-medium">
              {user.name}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[hsl(var(--color-muted-foreground))] mb-1">
              Email
            </label>
            <p className="text-[hsl(var(--color-foreground))]">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[hsl(var(--color-muted-foreground))] mb-1">
              Usuário
            </label>
            <p className="text-[hsl(var(--color-foreground))]">
              {user.username}
            </p>
          </div>

          {user.date_birth && (
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-muted-foreground))] mb-1">
                Data de Nascimento
              </label>
              <p className="text-[hsl(var(--color-foreground))]">
                {new Date(user.date_birth).toLocaleDateString("pt-BR")}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] px-6 py-2 rounded-md shadow transition hover:brightness-95 font-medium"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  );
}
