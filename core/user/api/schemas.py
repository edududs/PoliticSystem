from datetime import datetime
from typing import List

from ninja import ModelSchema, Schema

from user.models import Contact, User


class UserSchema(ModelSchema):
    contacts: List["ContactSchema"]

    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email")


class UserUpdateSchema(ModelSchema):
    class Meta:
        model = User
        fields = ("first_name", "email")


class ContactSchema(ModelSchema):
    class Meta:
        model = Contact
        fields = ("id", "value", "type")


class UserLoginSchema(Schema):
    username: str
    password: str


class UserRetrieveSchema(Schema):
    id: int
    username: str
    cpf: str
    name: str
    email: str
    date_birth: datetime | None
    gender: str | None
    last_login: datetime | None
    created_at: datetime
    updated_at: datetime
    contacts: List[ContactSchema]
