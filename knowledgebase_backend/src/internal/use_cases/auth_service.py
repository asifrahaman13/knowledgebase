from datetime import timedelta
from src.infastructure.repositories.auth_repository import AuthRepository
from src.internal.interfaces.auth_interface import AuthInterface
from src.infastructure.repositories.database_repository import DatabaseRepository


class AuthenticationService:

    def __call__(self):
        return self

    def __init__(
        self, auth_repository=AuthRepository, database_repository=DatabaseRepository
    ):
        self.auth_repository = auth_repository
        self.database_repository = database_repository()

    def check_password_for_login(self, username: str, password: str):
        result =self.database_repository.find_single_document("username", username, "users")

    
        if (result['password'] == password):
            return True

        return False
        

    def create_refresh_token(self, username: str):
        return self.auth_repository.create_refresh_token(username)

    def save_refresh_token(self, username: str, refresh_token: str):
        data = {"sub": username, "refresh_token": refresh_token}
        return self.database_repository.insert_one(data, "refresh_tokens")

    def create_access_token(self, data: dict):
        return self.auth_repository.create_access_token(data)

    def is_access_token_expired(self, token: str):
        return self.auth_repository.is_access_token_expired(token)

    def refresh_access_token(self, refresh_token: str):
        return self.auth_repository.generate_access_token_from_refresh_token(
            refresh_token
        )

    def get_current_user(self, token: str):
        return self.auth_repository.get_current_user(token)

    def google_auth(self):
        return self.auth_repository.google_auth()

    def google_auth_callback(self, url: str):
        return self.auth_repository.google_auth_callback(url)

    def user_info(self, access_token: str):
        return self.auth_repository.user_info(access_token)
    
