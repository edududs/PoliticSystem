# PoliticSystem - Backend

Este diretório contém o projeto **backend** da aplicação, desenvolvido com [Django](https://www.djangoproject.com/). O objetivo principal é disponibilizar uma base para gerenciar usuários e enviar notificações, servindo como ponto de partida para evoluções futuras.

## Estrutura de pastas

```
core/
├── core/                # Projeto Django
│   ├── settings.py      # Configurações do projeto
│   ├── urls.py          # URLs principais
│   └── wsgi.py          # Configuração WSGI
├── manage.py            # Utilitário de linha de comando do Django
├── notifications/       # Integração com provedores de e-mail (Mailgun)
├── requirements.txt     # Dependências Python
├── user/                # Aplicação de usuários
└── pytest.ini           # Configuração de testes
```

## Requisitos

- Python 3.11+
- `pip` para instalação das dependências
- Opcional: `pre-commit` para verificação automática do código

## Instalação

1. Crie um ambiente virtual e ative-o:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Instale as dependências do projeto:

   ```bash
   pip install -r requirements.txt
   ```

3. (Opcional) Instale os hooks do *pre-commit*:

   ```bash
   pre-commit install
   ```

## Variáveis de ambiente

As credenciais utilizadas pelo `MailgunEmailNotifier` são lidas de um arquivo `.env` na raiz do projeto. Crie o arquivo e defina as seguintes variáveis:

```ini
EMAIL_BASE_URL=https://api.mailgun.net/v3
SAND_BOX_DOMAIN=sandboxXXXX.mailgun.org
API_KEY_MAILGUN=sua-chave
DEFAULT_FROM_EMAIL=no-reply@sandboxXXXX.mailgun.org
```

Outras configurações do Django podem ser adicionadas nesse arquivo conforme necessidade.

## Banco de dados

O projeto está configurado para usar SQLite por padrão. Para inicializar o banco localmente execute:

```bash
python manage.py migrate
```

## Execução

Para iniciar o servidor de desenvolvimento:

```bash
python manage.py runserver
```

Se quiser executar as tarefas assíncronas do `django-q` (responsáveis por enviar e-mails de aniversário, por exemplo), utilize:

```bash
python manage.py qcluster
```

## Testes

Os testes são executados com `pytest`:

```bash
pytest
```

O arquivo `pytest.ini` já define o módulo de configurações do Django e ativa o reuso do banco de dados de testes.

## Contribuição

1. Crie sua *branch* (ex.: `git checkout -b minha-feature`).
2. Faça suas alterações e garanta que os testes continuam passando.
3. Envie um *pull request* para revisão.

---

Este projeto é mantido apenas para fins educacionais e serve como exemplo de integração entre Django, `django-q` e Mailgun.
