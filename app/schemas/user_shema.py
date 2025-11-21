from pydantic import BaseModel

class UserLogin(BaseModel):
    nickname: str
    password: str