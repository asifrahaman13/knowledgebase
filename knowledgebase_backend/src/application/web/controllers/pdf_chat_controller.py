from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from src.internal.entities.pdf import Pdf
from src.internal.interfaces.database_interface import DatabaseInterface
from src.infastructure.repositories.database_repository import DatabaseRepository
from src.internal.use_cases.database_service import DatabaseService
from src.infastructure.repositories.pdf_chat_repository import PdfChatRepository
from src.internal.use_cases.pdf_service import PdfService
from src.internal.interfaces.pdf_interface import PdfInterface
from src.infastructure.repositories.auth_repository import AuthRepository
from src.internal.use_cases.auth_service import AuthenticationService
from src.internal.interfaces.auth_interface import AuthInterface

pdf_router = APIRouter()

# Create an instance of the OAuth2PasswordBearer class
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

auth_repository = AuthRepository()
auth_service = AuthenticationService(auth_repository)


pdf_repository = PdfChatRepository()
pdf_service = PdfService(pdf_repository)

database_repository = DatabaseRepository()
database_service = DatabaseService(database_repository)


@pdf_router.post("/ask_question")
async def ask_question(
    pdf: Pdf,
    current_user: str = Depends(oauth2_scheme),
    auth_interface: AuthInterface = Depends(auth_service),
    pdf_interface: PdfInterface = Depends(pdf_service),
    database_interface: DatabaseInterface = Depends(database_service),
):
    
    
    # Get the current user
    user = auth_interface.get_current_user(current_user)

    print(user)

    # Check if the user is valid
    if user is None:
        return JSONResponse(
            status_code=404,
            content={"status": "error", "message": "Invalid token"},
        )

        # Check if the file actually belongs to the user.
    belongs_to_user = database_interface.check_if_file_belongs_to_user(
        user, pdf.filename
    )

    # If the file does not belong to the user, return an error message
    if belongs_to_user == False:
        return JSONResponse(
            status_code=404,
            content={"status": "error", "message": "File does not belong to user"},
        )

    # Generate a response
    response = pdf_interface.generate_response(pdf.question, pdf.filename)
    if response is not None:
        return JSONResponse(
            status_code=200,
            content={"status": "success", "message": response},
        )
