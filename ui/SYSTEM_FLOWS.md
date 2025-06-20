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
