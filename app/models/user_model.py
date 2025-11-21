from sqlalchemy import Column, Integer, String
from app.databases.db import Base

class UserDB(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nickname = Column(String, unique=True, index=True)
    password = Column(String)  # Guardarás hash aquí
