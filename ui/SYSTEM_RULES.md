# Regras de Negócio do Sistema - PoliticSystem

Este documento centraliza todas as regras de negócio, validações e lógicas que governam o comportamento do sistema. Ele serve como a "fonte da verdade" para as funcionalidades, independentemente da implementação técnica.

## 1. Usuários

### 1.1. Tipos de Usuário
- **Administrador**: Acesso total ao sistema, gerenciamento de todos os dados.
- **Político**: Usuário com perfil público, pode gerenciar suas próprias informações, criar postagens, etc.
- **Assessor**: Vinculado a um político, pode atuar em nome dele com permissões delegadas.
- **Cidadão**: Usuário comum, pode interagir, seguir políticos, etc.

### 1.2. Registro
- O email deve ser único em todo o sistema.
- A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma minúscula e um número.
- O campo `username` não pode ser alterado após o registro.

### 1.3. Status do Usuário
- **Ativo**: Pode fazer login e usar o sistema.
- **Inativo**: Não pode fazer login. Pode ser reativado por um administrador.
- **Banido**: Não pode fazer login e não pode ser reativado.

## 2. Notificações

### 2.1. Notificação de Aniversário
- A tarefa (`task_birthday`) roda diariamente à 00:01.
- A notificação é enviada por email para o usuário aniversariante.
- Uma notificação interna (no sistema) é criada para os assessores e para o próprio político.
- A notificação só é enviada se o usuário tiver o campo `data_de_nascimento` preenchido e as notificações ativadas em seu perfil.

## 3. Validações Gerais

### 3.1. Nomes e Textos
- Nomes próprios não devem conter números ou caracteres especiais, exceto apóstrofos ou hífens.
- Todos os campos de texto longo (descrições, postagens) devem ter um limite de 5000 caracteres.

### 3.2. Datas
- Todas as datas devem ser armazenadas no formato UTC no banco de dados.
- As datas devem ser exibidas no frontend no fuso horário local do usuário.

---
*Este documento deve ser mantido atualizado por toda a equipe. Qualquer nova feature que introduza uma regra de negócio deve ser documentada aqui antes da implementação.*
