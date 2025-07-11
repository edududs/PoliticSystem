import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Este código SÓ RODA NO SERVIDOR (BFF)

  let token: string | undefined;

  // 1. Tentar ler token dos cookies do browser (requisições client-side)
  const cookieStore = await cookies();
  token = cookieStore.get("access_token")?.value;

  // 2. Se não encontrou, tentar ler do header Cookie (requisições server-side)
  if (!token) {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split("=");
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>
      );

      token = cookies.access_token;
    }
  }

  // 3. Se não houver token, o usuário não está logado. Retornamos um erro 401.
  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: "Não autorizado: Nenhum token encontrado" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // 4. Verificamos se a URL da API do Django está configurada.
  const djangoApiUrl = process.env.DJANGO_API_URL;
  if (!djangoApiUrl) {
    console.error("❌ A variável de ambiente DJANGO_API_URL não está definida.");
    return new NextResponse("Erro de configuração no servidor.", {
      status: 500,
    });
  }

  try {
    // 5. O BFF faz a chamada segura para o endpoint 'me' do Django,
    //    repassando o token no header de autorização.
    console.log(
      "🔗 BFF: Fazendo requisição para Django:",
      `${djangoApiUrl}/users/me`
    );
    const response = await axios.get(`${djangoApiUrl}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 6. Retornamos os dados do usuário para o cliente.
    return NextResponse.json(response.data);
  } catch (error) {
    // 7. Se a chamada ao Django falhar (ex: token inválido), logamos o erro
    //    e retornamos uma resposta de erro.
    console.error("❌ BFF: Erro ao buscar dados do usuário logado:", error);
    return new NextResponse("Erro ao comunicar com o serviço de backend.", {
      status: 502,
    });
  }
}
