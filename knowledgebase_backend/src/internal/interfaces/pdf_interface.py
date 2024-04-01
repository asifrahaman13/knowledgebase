from abc import ABC, abstractmethod

class PdfInterface(ABC):

    @abstractmethod
    def generate_response(self, question: str, pdf_path: str):
        pass