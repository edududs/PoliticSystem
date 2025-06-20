# ADR 002: Adoção da Arquitetura Backend for Frontend (BFF)

- **Status**: Aceito
- **Data**: 20-06-2025T01:50

## Contexto

O projeto possui um backend robusto em Django com DRF, que expõe uma API de domínio completa, com filtros, paginação e serialização. O frontend Next.js precisa consumir esses dados para renderizar as interfaces. Surge a questão de como o frontend deve interagir com o backend: diretamente do browser ou através de uma camada intermediária. A necessidade de lidar com casos de uso complexos, como agregar dados de múltiplos endpoints para uma única visão e garantir a segurança de chaves de API, é um requisito central.

## Decisão

Adotaremos formalmente o padrão **Backend for Frontend (BFF)**. A aplicação Next.js (`ui/`) não será apenas um cliente de frontend puro; ela terá sua própria camada de servidor (BFF) para mediar a comunicação com a API principal do Django.

**Responsabilidades:**

1.  **Core API (Django/DRF)**:
    -   Permanece como a fonte da verdade para os dados.
    -   Oferece endpoints de API genéricos e poderosos (`ModelViewSet`, `FilterSet`, etc.).
    -   Lida com a lógica de negócio principal e a persistência no banco de dados.

2.  **BFF (Next.js)**:
    -   Implementado via **Route Handlers** (`app/api/**/route.ts`).
    -   Atua como o único ponto de contato para o browser do cliente. O browser não fará chamadas diretas para a API do Django.
    -   **Orquestração**: Combina chamadas a múltiplos endpoints da Core API para criar payloads de dados específicos para cada componente ou página.
    -   **Adaptação**: Transforma os dados brutos da API no formato exato que a UI precisa.
    -   **Segurança**: Gerencia chaves de API e outros segredos do lado do servidor, nunca os expondo ao cliente.
    -   **Caching**: Implementa estratégias de cache para dados frequentemente acessados, protegendo a Core API de carga excessiva e melhorando a performance percebida pelo usuário.

## Consequências

### Prós
- **Separação Clara de Responsabilidades**: O Django foca em dados e lógica de negócio, enquanto o Next.js foca na experiência do usuário.
- **Performance Otimizada**: A agregação de dados no BFF reduz o número de chamadas de rede do cliente. O caching no BFF reduz a carga sobre o backend principal.
- **Segurança Aumentada**: Nenhum segredo ou chave de API é exposto ao browser. A superfície de ataque da API principal é reduzida, pois ela só é acessada pelo BFF.
- **Desenvolvimento de Frontend Simplificado**: Os componentes React se tornam mais simples, pois consomem dados de um endpoint BFF que já entrega os dados no formato exato que eles precisam.

### Contras
- **Ponto Adicional de Falha**: Introduz uma nova camada na arquitetura que pode, teoricamente, falhar.
- **Aumento da Latência (mínimo)**: Cada requisição agora passa por um salto de rede extra (Browser -> BFF -> API). No entanto, para a maioria dos casos, isso é compensado pela redução no número total de chamadas e pelo caching.
- **Overhead de Desenvolvimento**: Requer a escrita e manutenção de uma camada de API adicional no Next.js.
