from fastapi import APIRouter, Depends, File, UploadFile, Form
from fastapi.security import OAuth2PasswordBearer
from src.infastructure.repositories.aws_repository import AWSRepository
from src.internal.use_cases.aws_service import AwsService
from fastapi.responses import JSONResponse
from src.internal.interfaces.auth_interface import AuthInterface
from src.internal.interfaces.aws_interface import AwsInterface
from src.internal.interfaces.database_interface import DatabaseInterface
from src.infastructure.repositories.auth_repository import AuthRepository
from src.infastructure.repositories.database_repository import DatabaseRepository
from src.internal.use_cases.database_service import DatabaseService
from src.internal.use_cases.auth_service import AuthenticationService
from fastapi.encoders import jsonable_encoder
from src.internal.helper.auth_helper import get_current_user

# Create a router for the AWS controller
aws_router = APIRouter()

# Create an instance of the OAuth2PasswordBearer class
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Create an instance of the AWS repository and service
aws_repository = AWSRepository()
aws_service = AwsService(aws_repository)
auth_repository = AuthRepository()
auth_service = AuthenticationService(auth_repository)
database_repository = DatabaseRepository()
database_service = DatabaseService(database_repository)


@aws_router.post("/upload_pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    description: str = Form(...),
    tag: str = Form(...),
    current_user: str = Depends(oauth2_scheme),
    auth_interface: AuthInterface = Depends(auth_service),
    aws_interface: AwsInterface = Depends(aws_service),
    database_interface: DatabaseInterface = Depends(database_service),
):
    # Get the current user
    user = auth_interface.user_info(current_user)

    # Check if the user is valid
    if user is None:
        return JSONResponse(
            status_code=404,
            content={"status": "error", "message": "Invalid token"},
        )

    # Extract the filename and the content of the file. Giving a unique name is important hence the user's email is used
    file_name = user["email"] + file.filename
    file_content = await file.read()

    # Check if the file is empty
    if not file_name or not file_content:
        return {"message": "Please provide a file name and content"}

    print(description, tag)

    # Upload the file to the S3 bucket
    updated = aws_interface.upload_pdf(file_name, file_content)

    # Return a success message if the file was uploaded successfully
    if updated == True:

        # Save the file details to the database
        saved = database_interface.insert_one(
            user["email"], file_name, tag, description
        )

        if saved is not None:
            return JSONResponse(
                status_code=200,
                content={"status": "success", "message": "File uploaded successfully"},
            )


@aws_router.get("/get_all_pdfs")
async def get_all_pdfs(
    current_user: str = Depends(get_current_user),
    auth_interface: AuthInterface = Depends(auth_service),
    database_interface: DatabaseInterface = Depends(database_service),
):
    # Get the current user
    user = auth_interface.user_info(current_user)

    # Check if the user is valid
    if user is None:
        return JSONResponse(
            status_code=404,
            content={"status": "error", "message": "Invalid token"},
        )

    user_email = user["email"]

    # Get all the PDFs from the S3 bucket
    pdfs = database_interface.find_all(user_email)

    if pdfs is not None:

        # Convert the data to JSON format
        json_compatible_item_data = jsonable_encoder(pdfs)

        # Return the dat
        return JSONResponse(
            status_code=200,
            content={"status": "success", "pdfs": json_compatible_item_data},
        )


@aws_router.get("/get_pdf_url")
async def get_pdf_url(
    file_name: str,
    current_user: str = Depends(get_current_user),
    auth_interface: AuthInterface = Depends(auth_service),
    aws_interface: AwsInterface = Depends(aws_service),
    database_interface: DatabaseInterface = Depends(database_service),
):
    # Get the current user
    user = auth_interface.user_info(current_user)

    # Check if the user is valid
    if user is None:
        return JSONResponse(
            status_code=404,
            content={"status": "error", "message": "Invalid token"},
        )

    # Check if the file actually belongs to the user.
    belongs_to_user = database_interface.check_if_file_belongs_to_user(
        user["email"], file_name
    )

    # If the file does not belong to the user, return an error message
    if belongs_to_user == False:
        return JSONResponse(
            status_code=404,
            content={"status": "error", "message": "File does not belong to user"},
        )

    # Get the URL of the PDF from the S3 bucket
    url = aws_interface.get_presigned_pdf_url(file_name)

    # Return the URL if it is found
    if url is not None:
        # Return the URL
        return JSONResponse(
            status_code=404,
            content={"status": "success", "url": url},
        )

    return JSONResponse(
        status_code=404,
        content={"status": "error", "message": "File not found"},
    )


