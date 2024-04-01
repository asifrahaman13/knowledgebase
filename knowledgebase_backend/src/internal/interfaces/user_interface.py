from abc import ABC, abstractmethod


class UserInterface(ABC):

    @abstractmethod
    def create_user(self, user_data: dict):
        pass