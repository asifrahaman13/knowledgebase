from src.internal.interfaces.pdf_interface import PdfInterface
from src.infastructure.repositories.pdf_chat_repository import PdfChatRepository 


class PdfService:

    def __call__(self) -> PdfInterface:
        return self
    
    def __init__(self, pdf_repository=PdfChatRepository):
        self.pdf_repository = pdf_repository
 
    def generate_response(self, question: str, pdf_path):
        return self.pdf_repository.generate_response(question, pdf_path)