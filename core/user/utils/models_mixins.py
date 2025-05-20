from django.db import models


class UserMixin(models.Model):
    def get_display_name(self):
        return self.get_full_name() or self.first_name  # type: ignore

    class Meta:
        abstract = True
