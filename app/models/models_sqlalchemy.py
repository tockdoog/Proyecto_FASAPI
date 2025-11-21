"""Modelos de la base de datos (SQLAlchemy).

Aquí se definen las tablas y columnas que se usarán en la base de datos.
Cada clase hereda de `Base` (declarative_base) y representa una tabla.
"""

from sqlalchemy import Column, Integer, String
from app.databases.db import Base


class EstudianteDB(Base):
    """Modelo para la tabla `estudiantes`.

    Campos:
    - id: clave primaria entera
    - nombre: texto único, requerido
    - edad: entero
    - carrera: texto
    """
    __tablename__ = "estudiantes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(120), unique=True, nullable=False)
    edad = Column(Integer, nullable=False)
    carrera = Column(String(120), nullable=False)

    def __repr__(self) -> str:
        return f"<Estudiante id={self.id} nombre={self.nombre!r}>"


class ProfesorDB(Base):
    """Modelo para la tabla `profesores`.

    Campos similares a Estudiante: id, nombre, edad y materia.
    """
    __tablename__ = "profesores"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(120), unique=True, nullable=False)
    edad = Column(Integer, nullable=False)
    materia = Column(String(120), nullable=False)

    def __repr__(self) -> str:
        return f"<Profesor id={self.id} nombre={self.nombre!r}>"


class CursoDB(Base):
    """Modelo para la tabla `cursos`.

    Campos:
    - id: PK
    - titulo: texto único
    - creditos: entero
    """
    __tablename__ = "cursos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(160), unique=True, nullable=False)
    creditos = Column(Integer, nullable=False)

    def __repr__(self) -> str:
        return f"<Curso id={self.id} titulo={self.titulo!r}>"
