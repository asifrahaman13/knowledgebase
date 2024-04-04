from src.internal.interfaces.aws_interface import AwsInterface
from src.infastructure.repositories.aws_repository import AWSRepository


class AwsService:
    def __call__(self) -> AwsInterface:
        return self

    def __init__(self, aws_repository=AWSRepository):
        self.aws_repository = aws_repository

    def upload_pdf(self, user, file_name: str, file_content: bytes): 
        return self.aws_repository.upload_pdf(file_name, file_content)

    def get_presigned_pdf_url(self, file_name: str):
        return self.aws_repository.get_presigned_pdf_url(file_name)
