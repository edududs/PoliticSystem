import urllib.parse

import pytest
import responses
from notifications.mailgun_notifier import MailgunEmailNotifier
from user.models import Contact


@pytest.fixture
def mailgun_env(monkeypatch):
    monkeypatch.setenv("EMAIL_BASE_URL", "https://api.mailgun.net/v3")
    monkeypatch.setenv("SAND_BOX_DOMAIN", "sandbox123.mailgun.org")
    monkeypatch.setenv("API_KEY_MAILGUN", "test-key")
    monkeypatch.setenv("DEFAULT_FROM_EMAIL", "no-reply@sandbox123.mailgun.org")


@pytest.mark.django_db
def test_mailgun_send_success(mailgun_env, django_user_model):  # noqa: ARG001
    # Cria um usuário e contato real
    user = django_user_model.objects.create(username="testuser")
    contact = Contact.objects.create(
        user=user,
        type=Contact.ContactType.EMAIL,
        value="test@example.com",
        is_active=True,
    )
    subject = "Test Subject"
    template_name = "emails/birthday"
    context = {"user": user}

    # Mocka render_to_string para não depender de template real
    import notifications.mailgun_notifier as mailgun_mod

    mailgun_mod.render_to_string = (
        lambda tpl, ctx: f"Rendered {tpl} for {ctx['user'].username}"
    )

    url = "https://api.mailgun.net/v3/sandbox123.mailgun.org/messages"
    responses.start()
    responses.add(
        responses.POST,
        url,
        json={"id": "<msgid@domain>", "message": "Queued. Thank you."},
        status=200,
    )

    notifier = MailgunEmailNotifier()
    result = notifier.send(contact, subject, template_name, context)
    assert result["message"] == "Queued. Thank you."
    req = responses.calls[0].request
    body = req.body
    if body is None:
        body_str = ""
    elif isinstance(body, bytes):
        body_str = body.decode()
    else:
        body_str = str(body)
    # Decodifica o form-data para dict
    parsed = urllib.parse.parse_qs(body_str)
    assert parsed["to"] == ["test@example.com"]
    assert parsed["subject"] == ["Test Subject"]
    assert "Rendered emails/birthday.txt" in parsed["text"][0]
    assert "Rendered emails/birthday.html" in parsed["html"][0]
    responses.stop()
    responses.reset()


# Para rodar: pytest notifications/test_mailgun_notifier.py
