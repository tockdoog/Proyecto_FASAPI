from sqlalchemy import Column, Integer, String
from app.databases.db import Base

class EstudianteDB(Base):
    __tablename__ = "estudiantes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True)
    edad = Column(Integer)
    carrera = Column(String)

class ProfesorDB(Base):
    __tablename__ = "profesores"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True)
    edad = Column(Integer)
    materia = Column(String)

class CursoDB(Base):
    __tablename__ = "cursos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, unique=True)
    creditos = Column(Integer)
