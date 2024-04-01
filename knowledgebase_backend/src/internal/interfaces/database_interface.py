from abc import ABC, abstractmethod


class DatabaseInterface(ABC):
    @abstractmethod
    def insert_one(self, username: str, pdf_name: str, tag: str, description: str):
        pass

    @abstractmethod
    def find_all(self, username: str):
        pass
    
    @abstractmethod
    def check_if_file_belongs_to_user(self, username: str, pdf_name: str):
        pass