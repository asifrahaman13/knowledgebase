from abc import ABC, abstractmethod


class AwsInterface(ABC):

    @abstractmethod
    def upload_pdf(self, user, file_name: str, file_content: bytes):
        pass

    @abstractmethod
    def get_presigned_pdf_url(self, file_name: str):
        pass
