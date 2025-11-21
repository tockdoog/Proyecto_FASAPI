from pydantic import BaseModel


class Estudiante(BaseModel):
    nombre: str
    edad: int
    carrera: str


class EstudianteOut(Estudiante):
    id: int

    class Config:
        orm_mode = True


class Profesor(BaseModel):
    nombre: str
    edad: int
    materia: str


class ProfesorOut(Profesor):
    id: int

    class Config:
        orm_mode = True


class Curso(BaseModel):
    titulo: str
    creditos: int


class CursoOut(Curso):
    id: int

    class Config:
        orm_mode = True
