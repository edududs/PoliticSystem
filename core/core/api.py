from ninja_extra import NinjaExtraAPI
from ninja_jwt.controller import NinjaJWTDefaultController
from user.api import UserAuthController, UserCRUDController

# Main API configuration
api = NinjaExtraAPI(
    title="PoliticSystem API",
    version="1.0.0",
    description="API para o sistema político",
    docs_url="/docs",
)

# Register JWT authentication controllers (default)
api.register_controllers(NinjaJWTDefaultController)

# Register custom controllers
api.register_controllers(UserCRUDController)
api.register_controllers(UserAuthController)
