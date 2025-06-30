from typing import Generic, TypeVar

T = TypeVar("T")


class UserNameMixin(Generic[T]):
    """Mixin para funcionalidades relacionadas ao nome do usuário."""

    def get_display_name(self: T) -> str:
        """Retorna o nome completo ou o primeiro nome do usuário."""
        if full_name := getattr(self, "get_full_name", lambda: None)():
            return full_name
        first_name = getattr(self, "first_name", "")
        last_name = getattr(self, "last_name", "")
        return f"{first_name} {last_name}".strip()


class UserEmailMixin(Generic[T]):
    """Mixin para funcionalidades relacionadas ao email do usuário."""

    def get_email_domain(self: T) -> str:
        """Retorna o domínio do email do usuário."""
        email = getattr(self, "email", "")
        return email.split("@")[1] if "@" in email else ""


class UserMixin(UserNameMixin[T], UserEmailMixin[T]):
    """Agregador de todos os mixins relacionados ao usuário."""
