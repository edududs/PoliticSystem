from django.db import models


class UserMixin(models.Model):
    """Mixin para adicionar display name ao usuário."""

    def get_display_name(self):
        """Retorna o nome completo ou o primeiro nome do usuário."""
        return self.get_full_name() or self.first_name  # type: ignore

    class Meta:
        """Meta options for UserMixin."""

        abstract = True
