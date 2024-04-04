from abc import ABC, abstractmethod


class DatabaseInterface(ABC):
    @abstractmethod
    def insert_one(self, data, collection_name: str):
        pass

    @abstractmethod
    def find_all(self, username: str):
        pass

    @abstractmethod
    def delete_one(self, username: str, pdf_name: str):
        pass
    
    @abstractmethod
    def check_if_file_belongs_to_user(self, username: str, pdf_name: str):
        pass