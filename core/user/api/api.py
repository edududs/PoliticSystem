from typing import List

from ninja import Router
from ninja_extra import (
    ControllerBase,
    api_controller,
    http_delete,
    http_get,
    http_post,
    http_put,
    status,
)
from ninja_extra.permissions import IsAuthenticated
from ninja_jwt.authentication import JWTAuth

from user.models import User
from user.permissions import IsActiveUser, IsAdmin

from .schemas import UserRetrieveSchema, UserSchema, UserUpdateSchema

user_router = Router()


@api_controller(
    "/user",
    auth=JWTAuth(),
    permissions=[IsAuthenticated, IsActiveUser],
    tags=["Users"],
)
class UserCRUDController(ControllerBase):
    """Controller for CRUD operations on users.

    All routes require JWT authentication and active user.
    """

    @http_get("/me", response=UserRetrieveSchema, summary="Get current user profile")
    def get_me(self, request):
        """Returns the authenticated user's profile."""
        user = request.user
        user.name = user.get_display_name()
        return user

    @http_get(
        "/",
        response=List[UserSchema],
        summary="List all users",
        permissions=[IsAdmin],
    )
    def list_users(self, request):
        """List all users (only for admins)."""
        return User.objects.all()

    @http_get(
        "/{user_id}",
        response=UserRetrieveSchema,
        summary="Get user by ID",
        permissions=[IsAdmin],
    )
    def get_user(self, request, user_id: int):
        """Returns a specific user by ID (own profile or admin)."""
        user = self.get_object_or_exception(User, id=user_id)
        user.name = user.get_display_name()
        return user

    @http_put(
        "/{user_id}",
        response=UserRetrieveSchema,
        summary="Update user",
        permissions=[IsAdmin],
    )
    def update_user(self, request, user_id: int, payload: UserUpdateSchema):
        """Updates user data (own profile or admin)."""
        user = self.get_object_or_exception(User, id=user_id)

        for attr, value in payload.dict(exclude_unset=True).items():
            setattr(user, attr, value)
        user.save()

        user.name = user.get_display_name()
        return user

    @http_delete("/{user_id}", summary="Delete user", permissions=[IsAdmin])
    def delete_user(self, request, user_id: int):
        """Deletes a user (only admins)."""
        user = self.get_object_or_exception(User, id=user_id)
        user.delete()
        return self.create_response(
            {"message": "User deleted successfully"},
            status_code=status.HTTP_204_NO_CONTENT,
        )


@api_controller("/auth", tags=["Authentication"])
class UserAuthController(ControllerBase):
    """Controller for custom authentication operations.

    Complements the NinjaJWTDefaultController.
    """

    @http_post(
        "/change-password",
        auth=JWTAuth(),
        permissions=[IsAuthenticated, IsActiveUser],
    )
    def change_password(self, request, old_password: str, new_password: str):
        """Changes the authenticated user's password."""
        user = request.user

        if not user.check_password(old_password):
            return self.create_response(
                {"error": "Invalid old password"},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()

        return {"message": "Password changed successfully"}

    @http_post("/logout", auth=JWTAuth(), permissions=[IsAuthenticated])
    def logout(self, request):
        """Logout of the user (in the frontend, the token should be removed).

        In the future, a token blacklist can be implemented.
        """
        return {"message": "Logged out successfully"}

    @http_get(
        "/profile",
        auth=JWTAuth(),
        permissions=[IsAuthenticated, IsActiveUser],
        response=UserRetrieveSchema,
    )
    def get_profile(self, request):
        """Alias for /user/me - maintains compatibility."""
        user = request.user
        user.name = user.get_display_name()
        return user
