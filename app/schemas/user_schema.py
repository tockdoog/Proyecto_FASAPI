from pydantic import BaseModel, EmailStr


# ======== ESQUEMA PARA REGISTRO ==========
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


# ======== ESQUEMA PARA LOGIN ==========
class UserLogin(BaseModel):
    username: str
    password: str


# ======== RESPUESTA PARA LA API ==========
class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True
