"""Esquemas Pydantic usados para validar y serializar datos en la API.

Se definen modelos de entrada (por ejemplo `Estudiante`) y modelos de salida
que incluyen el `id` (`EstudianteOut`). `orm_mode = True` permite que Pydantic
serialice objetos ORM (instancias de SQLAlchemy) directamente.
"""

from pydantic import BaseModel


class Estudiante(BaseModel):
    """Esquema para crear/actualizar un estudiante.

    Se usa como `request body` en POST/PUT.
    """
    nombre: str
    edad: int
    carrera: str


class EstudianteOut(Estudiante):
    """Esquema usado al devolver un estudiante al cliente (incluye `id`)."""
    id: int

    class Config:
        orm_mode = True


class Profesor(BaseModel):
    """Esquema para crear/actualizar un profesor."""
    nombre: str
    edad: int
    materia: str


class ProfesorOut(Profesor):
    id: int

    class Config:
        orm_mode = True


class Curso(BaseModel):
    """Esquema para crear/actualizar un curso."""
    titulo: str
    creditos: int


class CursoOut(Curso):
    id: int

    class Config:
        orm_mode = True
