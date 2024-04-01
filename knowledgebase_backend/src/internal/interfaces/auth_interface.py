# src/core/interfaces/user_interface.py
from abc import ABC, abstractmethod
from datetime import timedelta


class AuthInterface(ABC):

    @abstractmethod
    def create_access_token(self, data: dict, expires_delta: timedelta):
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
