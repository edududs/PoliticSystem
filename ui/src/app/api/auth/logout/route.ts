import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // Este código SÓ RODA NO SERVIDOR (BFF)

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    // Se não há token, considera como logout bem-sucedido
    if (!accessToken) {
      return NextResponse.json({ message: "Logout realizado com sucesso" });
    }

    // Validar se a URL da API do Django está configurada no ambiente
    const djangoApiUrl = process.env.DJANGO_API_URL;
    if (!djangoApiUrl) {
      console.error("A variável de ambiente DJANGO_API_URL não está definida.");
      return new NextResponse("Erro de configuração no servidor.", {
        status: 500,
      });
    }

    // Chamar o endpoint de logout do Django
    try {
      await axios.post(
        `${djangoApiUrl}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      // Mesmo se o logout no Django falhar, vamos limpar os cookies locais
      console.warn("Erro ao fazer logout no Django:", error);
    }

    // Remover os cookies do cliente
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Erro no logout:", axiosError.message);

    // Mesmo em caso de erro, remover os cookies para forçar logout
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json({ message: "Logout realizado com sucesso" });
  }
}
