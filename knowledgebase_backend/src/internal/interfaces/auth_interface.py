# src/core/interfaces/user_interface.py
from abc import ABC, abstractmethod

class AuthInterface(ABC):

    @abstractmethod
    def check_password_for_login(self, username: str, password: str):
        pass

    @abstractmethod
    def create_refresh_token(self, username:str):
        pass

    @abstractmethod
    def save_refresh_token(self, username: str, refresh_token: str):
        pass

    @abstractmethod
    def create_access_token(self, data:dict):
        pass

    @abstractmethod
    def is_access_token_expired(self, token: str):
        pass

    @abstractmethod
    def refresh_access_token(self, refresh_token: str):
        pass

    @abstractmethod
    def get_current_user(
        self,
    ):
        pass

    @abstractmethod
    def google_auth(self):
        pass

    @abstractmethod
    def google_auth_callback(self, url: str):
        pass

    @abstractmethod
    def user_info(self, access_token: str):
        pass
