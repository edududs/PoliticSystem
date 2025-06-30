from django.http import HttpRequest
from ninja_extra import ControllerBase
from ninja_extra.permissions import BasePermission


class IsActiveUser(BasePermission):
    """Permission that checks if the user is active.

    Usage:
    @http_get("/me", permissions=[IsActiveUser])
    """

    def has_permission(self, request: HttpRequest, controller: ControllerBase) -> bool:
        return request.user.is_active


class HasRole(BasePermission):
    """Dynamic permission based on Django's roles/groups.

    Usage:
    @http_get("/admin-only", permissions=[HasRole("admin")])
    """

    def __init__(self, required_role: str):
        self.required_role = required_role

    def has_permission(self, request: HttpRequest, controller: ControllerBase) -> bool:
        return request.user.groups.filter(name=self.required_role).exists()  # type: ignore
