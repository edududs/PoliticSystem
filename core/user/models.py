from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from localflavor.br.models import BRStateField

from user.utils.base_models import BaseModel
from user.utils.models_mixins import UserMixin


class Contact(BaseModel):
    """Model for user contacts (email, phone, WhatsApp)."""

    class ContactType(models.TextChoices):
        """Tipos de contato disponíveis."""

        EMAIL = "EMAIL", _("Email")
        PHONE = "PHONE", _("Telefone")
        WHATSAPP = "WHATSAPP", _("WhatsApp")

    user = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        related_name="contacts",
        verbose_name="Usuário",
        help_text="Usuário ao qual este contato pertence.",
    )
    type = models.CharField(
        max_length=16,
        choices=ContactType.choices,
        verbose_name="Tipo de contato",
        help_text="Tipo do contato: Email, Telefone ou WhatsApp.",
    )
    value = models.CharField(
        max_length=255,
        verbose_name="Valor",
        help_text="Valor do contato (e-mail, número, etc).",
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Ativo",
        help_text="Indica se o contato está ativo.",
    )

    class Meta:
        verbose_name = "Contato"
        verbose_name_plural = "Contatos"

    def __str__(self):
        """String representation for Contact."""
        return f"{self.type}: {self.value}"


class Address(BaseModel):
    """Model for user addresses."""

    user = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        related_name="addresses",
        verbose_name="Usuário",
        help_text="Usuário ao qual este endereço pertence.",
    )
    street = models.CharField(
        max_length=255,
        verbose_name="Logradouro",
        help_text="Rua, avenida, etc.",
        blank=True,
        null=True,
    )
    number = models.CharField(
        max_length=20,
        verbose_name="Número",
        help_text="Número do endereço.",
        blank=True,
        null=True,
    )
    complement = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Complemento",
        help_text="Complemento do endereço (opcional).",
    )
    neighborhood = models.CharField(
        max_length=255,
        verbose_name="Bairro",
        help_text="Bairro do endereço.",
        blank=True,
        null=True,
    )
    city = models.CharField(
        max_length=255,
        verbose_name="Cidade",
        help_text="Cidade do endereço.",
        blank=True,
        null=True,
    )
    state = BRStateField(
        verbose_name="Estado",
        help_text="UF do estado (ex: SP, RJ).",
        blank=True,
        null=True,
    )
    zip_code = models.CharField(
        max_length=10,
        verbose_name="CEP",
        help_text="CEP do endereço.",
        blank=True,
        null=True,
    )
    country = models.CharField(
        max_length=64,
        default="Brazil",
        verbose_name="País",
        help_text="País do endereço.",
        blank=True,
        null=True,
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Ativo",
        help_text="Indica se o endereço está ativo.",
    )

    class Meta:
        verbose_name = "Endereço"
        verbose_name_plural = "Endereços"

    def __str__(self):
        """String representation for Address."""
        return f"{self.street}, {self.number} - {self.city}/{self.state}"


class User(UserMixin, AbstractUser, BaseModel):
    """Custom user model with CPF and birth date."""

    class Gender(models.TextChoices):
        """Genders available."""

        MALE = "M", _("Male")
        FEMALE = "F", _("Female")
        OTHER = "O", _("Other")

    cpf = models.CharField(
        max_length=11,
        null=True,
        blank=True,
        verbose_name="CPF",
        help_text="Cadastro de Pessoa Física. Somente números.",
    )
    date_birth = models.DateField(
        null=True,
        blank=True,
        verbose_name="Data de nascimento",
        help_text="Data de nascimento do usuário.",
    )
    gender = models.CharField(
        max_length=1,
        choices=Gender.choices,
        null=True,
        blank=True,
        verbose_name="Gênero",
        help_text="Gênero do usuário.",
    )

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"

    def __str__(self):
        """String representation for User."""
        return self.get_display_name()


class SomeOtherClass(models.Model):
    """Classe auxiliar para o modelo de usuário."""
