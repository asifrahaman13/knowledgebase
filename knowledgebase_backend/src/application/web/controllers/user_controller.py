from src.internal.entities.user import UserBase
from src.infastructure.repositories.auth_repository import AuthRepository
from src.internal.use_cases.auth_service import AuthenticationService
from src.internal.interfaces.auth_interface import AuthInterface
from src.internal.use_cases.user_service import UserService
from src.internal.interfaces.user_interface import UserInterface
from src.infastructure.repositories.user_repository import UserRepository
from src.internal.helper.auth_helper import get_current_user
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

auth_repository = AuthRepository()
auth_service = AuthenticationService(auth_repository)


user_repository = UserRepository()
user_service = UserService(user_repository=user_repository)


@router.post("/signup")
async def signup(user: UserBase, user_interface: UserInterface = Depends(user_service)):
    user_data = user.model_dump()
    user_interface.create_user(user_data)

    return {"message": "Signup"}


@router.post("/login")
async def all_data(
    user: UserBase,
    auth_interface: AuthInterface = Depends(auth_service),
):
    user_data = user.model_dump()
    username = user_data["username"]
    password = user_data["password"]

    is_valid_entry = auth_interface.check_password_for_login(username, password)

    if is_valid_entry == False:
        return HTTPException(status_code=400, detail="Invalid credentials")

    try:

        access_token = auth_interface.create_access_token(data={"sub": username})

        data = {"sub": username}
        refresh_token = auth_interface.create_refresh_token(data)

        # Save the refresh token in the database
        auth_interface.save_refresh_token(username, refresh_token)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.post("/refresh-token")
async def refresh_token(
    current_user: str = Depends(get_current_user),
    auth_interface: AuthInterface = Depends(auth_service),
):
    try:

        user_id = auth_interface.get_current_user(current_user)

        if user_id is None:
            raise ValueError("Refresh token is missing user ID")

        # Generate a new access token

        data = {"sub": user_id}
        new_access_token = auth_interface.create_access_token(data)

        return {
            "access_token": new_access_token,
            "token_type": "bearer",
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Error refreshing token: " + str(e),
        )


@router.get("/authenticate")
async def get_protected_data(
    current_user: str = Depends(get_current_user),
    auth_interface: AuthInterface = Depends(auth_service),
):
    user = auth_interface.get_current_user(current_user)

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
