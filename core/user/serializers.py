from rest_framework import serializers

from user.models import Address, Contact, User


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = "__all__"


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = (
            "id",
            "street",
            "number",
            "complement",
            "neighborhood",
            "city",
            "state",
            "zip_code",
            "country",
            "is_active",
        )


class UserSerializer(serializers.ModelSerializer):
    contacts = ContactSerializer(many=True, read_only=True)
    addresses = AddressSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "cpf",
            "date_birth",
            "groups",
            "user_permissions",
            "contacts",
            "gender",
            "is_superuser",
            "is_staff",
            "is_active",
            "addresses",
        )
