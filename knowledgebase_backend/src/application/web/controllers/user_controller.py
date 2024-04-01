from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta
from src.internal.entities.user import UserBase
from src.infastructure.repositories.auth_repository import AuthRepository
from src.internal.use_cases.auth_service import AuthenticationService
from src.internal.interfaces.auth_interface import AuthInterface
from src.internal.use_cases.user_service import UserService
from src.internal.interfaces.user_interface import UserInterface
from src.infastructure.repositories.user_repository import UserRepository
from src.infastructure.exceptions.exceptions import HttePrequestErrors
from src.internal.helper.auth_helper import get_current_user


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

auth_repository = AuthRepository()
auth_service = AuthenticationService(auth_repository)


user_repository = UserRepository()
user_service = UserService(user_repository=user_repository)


@router.post("/signup")
async def signup(user: UserBase, user_interface: UserInterface = Depends(user_service)):
    return {"message": "Signup"}


@router.post("/login")
async def all_data(
    user: UserBase,
    auth_interface: AuthInterface = Depends(auth_service),
):
    user_data = user.model_dump()
    username = user_data["username"]
    password = user_data["password"]

    try:

        # Generate an access token
        access_token_expires = timedelta(hours=6)
        access_token = auth_interface.create_access_token(
            data={"sub": username}, expires_delta=access_token_expires
        )

        return {"access_token": access_token, "token_type": "bearer"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.get("/authenticate")
async def get_protected_data(
    current_user: str = Depends(get_current_user),
    auth_interface: AuthInterface = Depends(auth_service),
):
    user = auth_interface.get_current_user(current_user)

    if user is None:
        return HttePrequestErrors.unauthorized()
    return {"message": True, "user": user}


@router.get("/auth/google")
async def google_auth(auth_interface: AuthInterface = Depends(auth_service)):
    return auth_interface.google_auth()


@router.get("/auth/google/callback")
async def google_auth_callback(
    url: str, auth_interface: AuthInterface = Depends(auth_service)
):
    return auth_interface.google_auth_callback(url)


@router.get("/auth/user_info")
async def user_info(url: str, auth_interface: AuthInterface = Depends(auth_service)):
    print(auth_interface.user_info(url))
    return auth_interface.user_info(url)
