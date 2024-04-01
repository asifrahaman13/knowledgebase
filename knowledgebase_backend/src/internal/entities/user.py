from pydantic import BaseModel


class User(BaseModel):
    user_id: str | None = None
    username: str | None = None


class UserBase(BaseModel):
    username: str | None = None
    password: str | None = None

class UserDetails(BaseModel):
    user_id: str | None = None
    username: str | None = None
    