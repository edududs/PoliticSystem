import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // Este código SÓ RODA NO SERVIDOR (BFF)

  // 1. Obter email e senha do corpo da requisição enviada pelo formulário de login.
  const { username, password } = await request.json();

  if (!username || !password) {
    return new NextResponse(
      JSON.stringify({ error: "Usuário e senha são obrigatórios" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // 2. Validar se a URL da API do Django está configurada no ambiente.
  const djangoApiUrl = process.env.DJANGO_API_URL;
  if (!djangoApiUrl) {
    console.error("A variável de ambiente DJANGO_API_URL não está definida.");
    return new NextResponse("Erro de configuração no servidor.", {
      status: 500,
    });
  }

  try {
    // 3. O BFF faz a chamada segura para o endpoint de token do Django.
    // O endpoint padrão do ninja-jwt para obter o token é /api2/token/pair
    const response = await axios.post(`${djangoApiUrl}/token/pair`, {
      username: username, // django-ninja-jwt espera 'username' por padrão
      password: password,
    });

    const { access, refresh } = response.data;

    // 4. Se a chamada for bem-sucedida, o BFF armazena o token de acesso
    // em um cookie HttpOnly, que é a prática recomendada de segurança.
    const cookieStore = await cookies();
    cookieStore.set("access_token", access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    });

    // O refresh token poderia ser armazenado de forma similar se necessário
    if (refresh) {
      cookieStore.set("refresh_token", refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 dias
      });
    }

    // 5. Retorna uma resposta de sucesso para o cliente (nosso hook useLogin).
    return NextResponse.json({ message: "Login bem-sucedido" });
  } catch (error) {
    // 6. Tratamento de erro. Se o Django retornar um erro (ex: 401 Unauthorized),
    // repassamos um erro genérico para o cliente.
    const axiosError = error as AxiosError;
    console.error(
      "Erro na autenticação com o backend Django:",
      axiosError.response?.data || axiosError.message
    );

    const status = axiosError.response?.status || 500;
    const errorMessage =
      status === 401
        ? "Credenciais inválidas"
        : "Erro ao comunicar com o serviço de autenticação.";

    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
