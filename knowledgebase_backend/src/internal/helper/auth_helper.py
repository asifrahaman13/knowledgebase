from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

# Create an instance of the OAuth2PasswordBearer class
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_current_user(token: str = Depends(oauth2_scheme)):
    return token
