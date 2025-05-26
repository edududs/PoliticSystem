from django.utils import timezone
from django_q.tasks import async_task

from notifications.mailgun_notifier import MailgunEmailNotifier
from user.models import Contact, User


def send_birthday_email(user_id):
    """Send birthday congratulations email to the specified user using Mailgun API."""
    user = User.objects.get(id=user_id)
    contact = user.contacts.filter(
        type=Contact.ContactType.EMAIL,
        is_active=True,
    ).first()
    if not contact:
        print(f"[EMAIL] No active email contact for user {user_id}")
        return f"No active email contact for user {user_id}"

    subject = "Happy Birthday! 🎉"
    template_name = "emails/birthday"
    context = {"user": user}

    notifier = MailgunEmailNotifier()
    notifier.send(contact, subject, template_name, context)
    return f"Birthday email sent to user {user_id}"


def send_birthday_whatsapp(user_id):
    """Send birthday congratulations via WhatsApp to the specified user.

    Currently just prints a message, but can be integrated with a real WhatsApp API.
    """
    print(f"[WHATSAPP] Sending birthday WhatsApp to user {user_id}")
    return f"Birthday WhatsApp sent to user {user_id}"


def send_birthday_congratulations():
    """Search for users with birthday today and trigger congratulation tasks.

    Sends congratulation messages via email and/or WhatsApp according to user's active contacts.
    """
    today = timezone.now().today()
    users = User.objects.filter(date_birth=today)
    for user in users:
        contacts = user.contacts.filter(is_active=True)  # type: ignore
        email_contacts = contacts.filter(type=Contact.ContactType.EMAIL)
        whatsapp_contacts = contacts.filter(type=Contact.ContactType.WHATSAPP)

        if email_contacts.exists():
            async_task("user.tasks.task_birthday.send_birthday_email", user.id)
        if whatsapp_contacts.exists():
            async_task("user.tasks.task_birthday.send_birthday_whatsapp", user.id)
    return f"Processed {users.count()} users with birthday today"
