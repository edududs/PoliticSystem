# Fluxos de Sistema - PoliticSystem

Este documento descreve os principais fluxos de interação do usuário e de dados dentro do sistema. Ele utiliza diagramas para visualizar a sequência de eventos em operações críticas.

## 1. Fluxo de Autenticação (Login)

Este fluxo detalha como um usuário faz login no sistema, desde a submissão do formulário até a atualização da UI. Ele ilustra a interação entre o frontend Next.js e o backend Django, seguindo as estratégias definidas no [ADR-001](./docs/adr/001-auth-strategy.md) e [ADR-002](./docs/adr/002-bff-architecture.md).

```mermaid
sequenceDiagram
    participant User
    participant Next.js Browser
    participant Next.js BFF
    participant Django API

    User->>Next.js Browser: Preenche e envia formulário de login (email/senha)
    Next.js Browser->>Next.js BFF: POST /api/auth/login (com credenciais)
    Next.js BFF->>Django API: POST /api/token/ (com credenciais)

    alt Credenciais Válidas
        Django API->>Django API: Gera Access Token e Refresh Token
        Note over Django API: Define o Refresh Token em um cookie<br/>`HttpOnly` e `SameSite=Strict`.
        Django API-->>Next.js BFF: Responde 200 OK com { access_token: "..." }

        Next.js BFF->>Next.js BFF: Armazena o Access Token em um cookie seguro (também HttpOnly) para o browser
        Next.js BFF-->>Next.js Browser: Responde 200 OK

        Next.js Browser->>Next.js Browser: Atualiza o estado da UI (via AuthContext) e redireciona para o Dashboard
    else Credenciais Inválidas
        Django API-->>Next.js BFF: Responde com erro 401 Unauthorized
        Next.js BFF-->>Next.js Browser: Responde com erro 401
        Next.js Browser->>User: Exibe mensagem de erro no formulário
    end
```

## 2. Fluxo de Requisição Autenticada (Ex: Buscar Dados do Usuário)

Este fluxo descreve como o frontend busca dados de uma rota protegida após o usuário já ter feito o login. Ele demonstra o papel central do BFF em repassar o token de autenticação de forma segura.

```mermaid
sequenceDiagram
    participant User
    participant Next.js Browser
    participant Next.js BFF
    participant Django API

    User->>Next.js Browser: Navega para uma página de perfil
    Next.js Browser->>Next.js Browser: Componente React (ex: Profile) renderiza e chama o hook `useGetMe()`

    Note over Next.js Browser: React Query verifica se os dados já estão em cache.<br/>Se não, ele inicia a busca.

    Next.js Browser->>Next.js BFF: GET /api/users/me
    Note over Next.js Browser, Next.js BFF: O browser anexa<br/>automaticamente o cookie `HttpOnly`<br/>com o `access_token` na requisição.

    Next.js BFF->>Next.js BFF: Extrai o `access_token` do cookie da requisição
    Next.js BFF->>Django API: GET /api/users/me/ (com header `Authorization: Bearer <token>`)

    alt Token Válido
        Django API-->>Next.js BFF: Responde 200 OK com os dados do usuário em JSON
        Next.js BFF-->>Next.js Browser: Repassa a resposta 200 OK com os dados
        Next.js Browser->>Next.js Browser: React Query armazena os dados em cache e os disponibiliza para o componente
        Next.js Browser->>User: Exibe os dados do perfil do usuário na tela
    else Token Inválido ou Expirado
        Django API-->>Next.js BFF: Responde com erro 401 Unauthorized
        Next.js BFF-->>Next.js Browser: Repassa o erro 401
        Next.js Browser->>Next.js Browser: O hook `useGetMe()` entra em estado de erro.<br/>A UI pode redirecionar para a página de login.
    end
```
