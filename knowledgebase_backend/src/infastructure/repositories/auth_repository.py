import requests
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from jose import JWTError, jwt
from config.config import SECRET_KEY
from config.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI


class AuthRepository:
    """
    Initialize the AuthRepository class with the required configuration
    We are using the token based authentication, so we need to have a secret key from google.
    """

    def __init__(self):
        self.secret_key = SECRET_KEY
        self.google_client_id = GOOGLE_CLIENT_ID
        self.google_client_secret = GOOGLE_CLIENT_SECRET
        self.google_redirect_uri = GOOGLE_REDIRECT_URI
        self.token_url = "https://oauth2.googleapis.com/token"
        self.user_info_url = "https://www.googleapis.com/oauth2/v3/userinfo"

    # Create a JWT token with the data and the expiry time
    def create_access_token(self, data: dict, expires_delta: timedelta) -> str:

        # Create a copy of the data and add the expiry time to the data
        to_encode = data.copy()

        # Get the current time and add the expiry time to it
        expire = datetime.now(timezone.utc) + expires_delta
        
        to_encode.update({"exp": expire})

        # Encode the data with the secret key and return the token
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm="HS256")

        return encoded_jwt

    def get_current_user(self, token) -> str:

        try:
            # Decode the token with the secret key
            payload = jwt.decode(token, self.secret_key, algorithms=["HS256"])

            # Get the username from the payload
            username: str = payload.get("sub")
            if username is None:
                return None

        except JWTError:
            return None

        return username

    def google_auth(self):

        # Create the google auth url with the client id, redirect uri and the required scopes
        auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?client_id={self.google_client_id}&redirect_uri={self.google_redirect_uri}&response_type=code&scope=openid%20profile%20email"
        return JSONResponse(content={"auth_url": auth_url})

    def google_auth_callback(self, url: str):
        print(url)
        code = url

        # Create the params for the google api
        params = {
            "code": code,
            "client_id": self.google_client_id,
            "client_secret": self.google_client_secret,
            "redirect_uri": self.google_redirect_uri,
            "grant_type": "authorization_code",
        }

        # Fetch the access token from the google api
        response = requests.post(self.token_url, data=params)

        # Check if the response is successful
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, detail="Failed to fetch access token"
            )

        access_token = response.json().get("access_token")

        # Check if the access token is present in the response
        if not access_token:

            # Raise an exception if the access token is not found
            raise HTTPException(
                status_code=401, detail="Access token not found in response"
            )

        return {"access_token": access_token}

    def user_info(self, access_token: str):

        # Fetch the user information from the google api
        userinfo_response = requests.get(
            self.user_info_url, headers={"Authorization": f"Bearer {access_token}"}
        )

        # Check if the response is successful
        if userinfo_response.status_code != 200:

            # Raise an exception if the response is not successful
            raise HTTPException(
                status_code=userinfo_response.status_code,
                detail="Failed to fetch user information",
            )

        # Return the user information
        user_info = userinfo_response.json()
        return user_info
