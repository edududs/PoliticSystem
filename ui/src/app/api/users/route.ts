import { NextResponse } from "next/server";
import axios from "axios";

// Por padrão, o Next.js cacheia as respostas de Route Handlers.
// A opção 'force-dynamic' força a rota a ser dinâmica, buscando dados frescos a cada chamada.
// Vamos começar com isso para garantir que vemos os dados mais recentes.
// Mais tarde, podemos implementar estratégias de cache mais avançadas (revalidate).
export const dynamic = "force-dynamic";

export async function GET() {
  // Este código SÓ RODA NO SERVIDOR (BFF)

  // 1. Verificamos se a URL da API do Django está configurada no ambiente do servidor.
  const djangoApiUrl = process.env.DJANGO_API_URL;
  if (!djangoApiUrl) {
    console.error("A variável de ambiente DJANGO_API_URL não está definida.");
    return new NextResponse("Erro de configuração no servidor.", {
      status: 500,
    });
  }

  try {
    // 2. O BFF faz a chamada segura para o backend real do Django.
    // Note que não estamos usando nossa instância 'api.ts' aqui, pois ela é para o cliente.
    // Esta é uma chamada de servidor para servidor.
    const response = await axios.get(`${djangoApiUrl}/users/`);

    // 3. O BFF retorna os dados que recebeu do Django para quem o chamou (o nosso 'api.ts' no cliente).
    return NextResponse.json(response.data);
  } catch (error) {
    // 4. Tratamento de erro: se a chamada ao Django falhar, logamos o erro no servidor
    //    e retornamos uma resposta de erro genérica para o cliente.
    console.error("Erro ao buscar dados da API do Django:", error);
    return new NextResponse(
      "Erro ao comunicar com o serviço de backend.",
      { status: 502 } // 502 Bad Gateway é um status apropriado aqui.
    );
  }
}
