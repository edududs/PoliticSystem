# ADR 003: Estratégia de Gerenciamento de Formulários

- **Data**: 25-06-2025T00:53

## Contexto

O projeto precisa de uma solução robusta para gerenciar formulários no frontend Next.js. Precisamos de uma biblioteca que ofereça validação de dados, gerenciamento de estado de formulário, integração com TypeScript e performance otimizada. A solução deve ser consistente com a arquitetura BFF adotada e seguir os princípios de clean code e separação de responsabilidades estabelecidos no projeto.

## Decisão

Adotaremos **React Hook Form + Zod** como a solução principal para gerenciamento de formulários no projeto.

**Stack de Formulários:**
1. **React Hook Form**: Biblioteca principal para gerenciamento de estado e performance de formulários.
2. **Zod**: Biblioteca de validação e tipagem TypeScript-first.
3. **@hookform/resolvers**: Integração entre React Hook Form e Zod.

**Responsabilidades:**

1. **React Hook Form**:
   - Gerenciamento de estado de formulários com performance otimizada (re-renderiza apenas campos que mudam).
   - Controle de submissão, loading states e erros.
   - Integração com bibliotecas de validação externas.

2. **Zod**:
   - Validação de dados com tipagem TypeScript automática.
   - Schemas reutilizáveis e composáveis.
   - Mensagens de erro customizáveis e internacionalização.

3. **@hookform/resolvers**:
   - Ponte entre React Hook Form e Zod.
   - Resolução automática de erros de validação.

## Consequências

### Prós
- **Performance Superior**: React Hook Form renderiza apenas os campos que mudam, reduzindo drasticamente o número de re-renderizações.
- **Bundle Size Otimizado**: Solução mais leve comparada a alternativas como Formik + Yup.
- **TypeScript First**: Integração nativa com TypeScript através do Zod, garantindo type safety em tempo de compilação.
- **Flexibilidade**: Não força uma estrutura específica de componentes, permitindo integração com qualquer UI library.
- **Validação Robusta**: Zod oferece validação poderosa com schemas reutilizáveis e mensagens customizáveis.
- **Integração com Arquitetura**: Compatível com a arquitetura BFF e os padrões estabelecidos no projeto.

### Contras
- **Learning Curve**: React Hook Form tem uma curva de aprendizado inicial, especialmente para desenvolvedores acostumados com Formik.
- **Dependência Externa**: Introduz duas novas dependências no projeto (React Hook Form e Zod).
- **Complexidade para Casos Simples**: Pode ser overkill para formulários muito simples.

### Alternativas Consideradas
- **Formik + Yup**: Solução tradicional, mas com performance inferior e bundle size maior.
- **Next.js Server Actions**: Solução nativa, mas limitada para formulários complexos e sem validação client-side.
- **TanStack Form**: Performance extrema, mas com curva de aprendizado mais acentuada.
