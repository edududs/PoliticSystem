import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import axios from "axios";
import type { User } from "@/lib/types";

/**
 * Função auxiliar para fazer requisições para o BFF no servidor
 * Lê cookies manualmente e envia para o endpoint BFF
 */
async function serverApiFetch<T>(endpoint: string): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  console.log(
    "🍪 serverApiFetch: Cookie access_token:",
    accessToken ? "Presente" : "Ausente"
  );

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = `${baseURL}/api${endpoint}`;

  console.log("🔗 serverApiFetch: Fazendo requisição para BFF:", url);

  const response = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      // Enviar cookie como header (simulando requisição do browser)
      ...(accessToken && { Cookie: `access_token=${accessToken}` }),
    },
  });

  return response.data;
}

/**
 * Função utilitária para verificar se o usuário está autenticado no servidor
 * Usa o BFF mantendo o padrão arquitetural
 */
export async function getServerUser(): Promise<User | null> {
  try {
    const userData = await serverApiFetch<User>("/users/me");
    return userData;
  } catch (error: unknown) {
    // Type guard para axios error
    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosError = error as { response: { status: number } };

      if (axiosError.response.status === 401) {
        return null;
      }
    }

    console.error("❌ getServerUser: Erro inesperado:", error);
    return null;
  }
}

/**
 * Função que verifica autenticação e redireciona se não autenticado
 * Use em Server Components que precisam de autenticação
 */
export async function requireAuth(): Promise<User> {
  console.log("🛡️ requireAuth: Verificando autenticação obrigatória");

  const user = await getServerUser();

  if (!user) {
    console.log(
      "🔄 requireAuth: Usuário não autenticado, redirecionando para /login"
    );
    redirect("/login");
  }

  console.log("✅ requireAuth: Usuário autenticado, permitindo acesso");
  return user;
}

/**
 * Função que apenas verifica se está logado sem redirecionar
 * Útil para componentes que precisam de lógica condicional
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getServerUser();
  const isAuth = !!user;
  console.log("🔍 isAuthenticated: Resultado:", isAuth);
  return isAuth;
}
