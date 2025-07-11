import Link from "next/link";

export function HomeUnauthenticated() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[hsl(var(--color-background))] px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-[hsl(var(--color-primary))]">
          Home
        </h1>
        <p className="text-lg text-[hsl(var(--color-muted-foreground))] text-center">
          Bem-vindo à Home!
        </p>
        <Link
          href="/login"
          className="bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] px-5 py-2 rounded-md shadow transition hover:brightness-95 font-medium"
        >
          Entrar
        </Link>
      </div>
    </main>
  );
}
