"""AppConfig for user app."""
from django.apps import AppConfig


class UserConfig(AppConfig):
    """Configuração da aplicação user."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "user"
