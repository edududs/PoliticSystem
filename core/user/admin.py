from django import forms
from django.contrib import admin
from django.contrib.auth.admin import GroupAdmin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.contrib.auth.models import Group
from django_select2.forms import Select2MultipleWidget, Select2Widget

from user.models import Address, Contact, User


class ContactInline(admin.TabularInline):
    model = Contact
    extra = 1
    can_delete = True
    show_change_link = True


class AddressInlineForm(forms.ModelForm):
    class Meta:
        model = Address
        fields = "__all__"
        widgets = {
            "state": Select2Widget,
        }


class AddressInline(admin.TabularInline):
    model = Address
    form = AddressInlineForm
    extra = 1
    can_delete = True
    show_change_link = True


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("username", "cpf", "first_name", "last_name")

    def clean_cpf(self):
        cpf = self.cleaned_data.get("cpf")
        if cpf:
            qs = User.objects.filter(cpf=cpf)
            if self.instance.pk:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise forms.ValidationError("Já existe um usuário com este CPF.")
        return cpf


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ("username", "cpf", "first_name", "last_name", "date_birth")

    def clean_cpf(self):
        cpf = self.cleaned_data.get("cpf")
        if cpf:
            qs = User.objects.filter(cpf=cpf)
            if self.instance.pk:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise forms.ValidationError("Já existe um usuário com este CPF.")
        return cpf


class UserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    inlines = [ContactInline, AddressInline]
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (
            "Personal Information",
            {"fields": ("cpf", "first_name", "last_name", "date_birth")},
        ),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "cpf",
                    "first_name",
                    "last_name",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_active",
                ),
            },
        ),
    )
    list_display = (
        "username",
        "cpf",
        "first_name",
        "last_name",
        "is_staff",
        "is_active",
    )
    search_fields = ("username", "cpf", "first_name", "last_name")
    ordering = ("id",)


class GroupForm(forms.ModelForm):
    class Meta:
        model = Group
        fields = "__all__"
        widgets = {
            "permissions": Select2MultipleWidget,
        }


class CustomGroupAdmin(GroupAdmin):
    form = GroupForm


admin.site.register(User, UserAdmin)
admin.site.unregister(Group)
admin.site.register(Group, CustomGroupAdmin)

# Não registrar Contact e Address isoladamente
# admin.site.register(Contact)
# admin.site.register(Address)
