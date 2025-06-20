# Fluxos de Sistema - PoliticSystem

Este documento descreve os principais fluxos de interação do usuário e de dados dentro do sistema. Ele utiliza diagramas para visualizar a sequência de eventos em operações críticas.

## 1. Fluxo de Autenticação (Login)

Este fluxo detalha como um usuário faz login no sistema, desde a submissão do formulário até a atualização da UI. Ele ilustra a interação entre o frontend Next.js e o backend Django, seguindo a estratégia definida no [ADR-001](./docs/adr/001-auth-strategy.md).

```mermaid
sequenceDiagram
    participant User
    participant Next.js Frontend
    participant Django Backend

    User->>Next.js Frontend: Preenche e envia formulário de login (email/senha)
    Next.js Frontend->>Django Backend: POST /api/token/ (com credenciais no corpo)

    alt Credenciais Válidas
        Django Backend->>Django Backend: Gera Access Token (curta duração) e Refresh Token (longa duração)
        Note over Django Backend: Define o Refresh Token em um cookie<br/>com flags `HttpOnly` e `SameSite=Strict`.
        Django Backend-->>Next.js Frontend: Responde 200 OK com { access_token: "..." } no corpo

        Next.js Frontend->>Next.js Frontend: 1. Armazena Access Token na memória (via AuthContext)
        Next.js Frontend->>Django Backend: 2. GET /api/users/me/ (com o novo Access Token no Header)
        Django Backend-->>Next.js Frontend: Responde 200 OK com os dados do usuário

        Next.js Frontend->>Next.js Frontend: 3. Atualiza o AuthContext com os dados do usuário (`isAuthenticated = true`)
        Next.js Frontend->>User: Redireciona para o Dashboard ou página principal
    else Credenciais Inválidas
        Django Backend-->>Next.js Frontend: Responde com erro 401 Unauthorized
        Next.js Frontend->>User: Exibe mensagem de erro no formulário
    end
```
