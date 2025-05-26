import os
from typing import Any, Dict

import requests
from django.template.loader import render_to_string
from user.models import Contact


class MailgunEmailNotifier:
    """Email notifier using Mailgun API.

    Loads credentials from environment and sends formatted emails via external API.
    """

    def __init__(self):
        # Load environment variables
        self.base_url: str = os.environ.get("EMAIL_BASE_URL", "")
        self.domain: str = os.environ.get("SAND_BOX_DOMAIN", "")
        self.api_key: str = os.environ.get("API_KEY_MAILGUN", "")
        self.from_email: str = os.environ.get(
            "DEFAULT_FROM_EMAIL",
            f"no-reply@{self.domain}",
        )
        if not all([self.base_url, self.domain, self.api_key]):
            raise ValueError("Mailgun credentials missing in environment variables.")

    def send(
        self,
        contact: Contact,
        subject: str,
        template_name: str,
        context: Dict[str, Any],
    ) -> dict:
        """Send an email using Mailgun.

        - contact: Contact instance (must be EMAIL type)
        - subject: email subject
        - template_name: template prefix (without extension)
        - context: context for template rendering
        """
        # Render text and HTML templates
        text_body = render_to_string(f"{template_name}.txt", context)
        html_body = render_to_string(f"{template_name}.html", context)

        # Prepare payload according to Mailgun API
        payload = {
            "from": self.from_email,
            "to": [contact.value],
            "subject": subject,
            "text": text_body,
            "html": html_body,
        }

        # Mailgun API endpoint
        url = f"{self.base_url}/{self.domain}/messages"

        # Ensure api_key is string (not None)
        if not self.api_key:
            raise ValueError("API_KEY_MAILGUN is required for MailgunEmailNotifier.")

        # Send authenticated POST request via HTTP Basic Auth
        response = requests.post(
            url,
            auth=("api", self.api_key),
            data=payload,
            timeout=100,
        )

        # Handle HTTP errors
        if response.status_code >= 400:
            raise MailgunEmailNotifierError(
                f"Mailgun API error: {response.status_code} - {response.text}",
            )
        return response.json()


# Notes:
# - HTTP Basic Auth is used as it's Mailgun's standard authentication method
# - The /messages endpoint expects fields as form-data
# - Templates should be located in templates/emails/birthday.txt and .html
# - The from address can be customized via DEFAULT_FROM_EMAIL env var
# - For static typing support, install requests-stubs: pip install requests-stubs

#  =============================== EXCEPTIONS ===============================


class MailgunEmailNotifierError(Exception):
    """Exception raised when there is an error sending an email using Mailgun."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)
