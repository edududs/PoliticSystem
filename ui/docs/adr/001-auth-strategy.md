# ADR 001: Estratégia de Autenticação

- **Data**: 20-06-2025T01:50

## Contexto

Precisamos de um mecanismo de autenticação que seja seguro, escalável e adequado para uma arquitetura desacoplada com um frontend Next.js e um backend Django (API). A solução deve proteger contra vulnerabilidades comuns da web, como Cross-Site Scripting (XSS), e proporcionar uma boa experiência de usuário, evitando logins repetidos.

## Decisão

Adotaremos uma estratégia de autenticação baseada em **JSON Web Tokens (JWT)** com um par de tokens (`Access` e `Refresh`) e uma combinação de armazenamento em memória e cookies `HttpOnly`.

1.  **Backend (Django)**: Será o único responsável por gerar e validar os JWTs.
    -   **Access Token**: Curta duração (ex: 15 minutos). Enviado no corpo da resposta de login.
    -   **Refresh Token**: Longa duração (ex: 7 dias). Enviado ao cliente através de um cookie com as flags `HttpOnly` e `SameSite=Strict`.

2.  **Frontend (Next.js)**:
    -   O **Access Token** recebido será armazenado exclusivamente na memória do navegador, gerenciado por um React Context (`AuthContext`). Ele **nunca** será armazenado em `localStorage` ou `sessionStorage`.
    -   O **Refresh Token** no cookie `HttpOnly` será tratado automaticamente pelo navegador e não será acessível pelo código JavaScript do frontend.
    -   Um **React Context (`AuthContext`)** será implementado para gerenciar o estado da autenticação do usuário na UI (`user`, `isAuthenticated`, `isLoading`).
    -   Um **interceptor do Axios** (configurado em `lib/api.ts`) será responsável por adicionar o `Access Token` ao header `Authorization` de cada requisição protegida e por lidar com a lógica de "refresh" de token quando uma resposta `401 Unauthorized` for recebida.

## Consequências

### Prós
- **Alta Segurança**: O uso de cookies `HttpOnly` para o `Refresh Token` mitiga significativamente o risco de roubo de token por ataques XSS.
- **Boa Experiência do Usuário (UX)**: O mecanismo de refresh automático permite que os usuários mantenham suas sessões ativas por longos períodos sem a necessidade de fazer login novamente.
- **Arquitetura Desacoplada (Stateless)**: O backend permanece stateless, já que o estado da sessão é gerenciado pelo cliente através dos tokens, o que é ideal para APIs e escalabilidade.

### Contras
- **Maior Complexidade de Implementação**: A lógica de gerenciar dois tokens, interceptors e o fluxo de refresh é mais complexa do que uma abordagem baseada em sessão simples ou armazenamento em `localStorage`.
- **Requer Configuração de CORS**: O backend precisará ser configurado corretamente para aceitar credenciais (cookies) de um domínio diferente (o do frontend).
