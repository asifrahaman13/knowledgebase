from src.internal.interfaces.user_interface import UserInterface
from src.infastructure.repositories.database_repository import DatabaseRepository

class UserService:
    def __call__(self) -> UserInterface:
        return self

    def __init__(self, database_repository=DatabaseRepository):
        self.database_repository = database_repository()

    def create_user(self, user_data: dict):
        return self.database_repository.insert_one(user_data, "users")