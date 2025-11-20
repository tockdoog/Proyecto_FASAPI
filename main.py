from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

# ==========================================
#   CONFIG BASE DE DATOS
# ==========================================

DATABASE_URL = "sqlite:///./data.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


# ==========================================
#   MODELOS SQLALCHEMY
# ==========================================

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


# Crear tablas
Base.metadata.create_all(bind=engine)


# ==========================================
#   MODELOS Pydantic
# ==========================================

class Estudiante(BaseModel):
    nombre: str
    edad: int
    carrera: str


class Profesor(BaseModel):
    nombre: str
    edad: int
    materia: str


class Curso(BaseModel):
    titulo: str
    creditos: int


# ==========================================
#   APP + STATIC FILES
# ==========================================

app = FastAPI()

app.mount("/public", StaticFiles(directory="public"), name="public")


@app.get("/")
def home():
    return FileResponse("public/frontend_bootstrap.html")


# ==========================================
#   CRUD ESTUDIANTES
# ==========================================

@app.post("/estudiantes")
def agregar_estudiante(est: Estudiante):
    db = SessionLocal()

    existente = db.query(EstudianteDB).filter(EstudianteDB.nombre == est.nombre).first()
    if existente:
        raise HTTPException(status_code=400, detail="El estudiante ya existe")

    nuevo = EstudianteDB(nombre=est.nombre, edad=est.edad, carrera=est.carrera)
    db.add(nuevo)
    db.commit()

    return {"mensaje": "Estudiante agregado correctamente"}


@app.get("/estudiantes")
def listar_estudiantes():
    db = SessionLocal()
    data = db.query(EstudianteDB).all()
    return data


@app.put("/estudiantes/{nombre}")
def actualizar_estudiante(nombre: str, est: Estudiante):
    db = SessionLocal()

    existente = db.query(EstudianteDB).filter(EstudianteDB.nombre == nombre).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    existente.nombre = est.nombre
    existente.edad = est.edad
    existente.carrera = est.carrera

    db.commit()

    return {"mensaje": "Estudiante actualizado correctamente"}


@app.delete("/estudiantes/{nombre}")
def eliminar_estudiante(nombre: str):
    db = SessionLocal()

    existente = db.query(EstudianteDB).filter(EstudianteDB.nombre == nombre).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    db.delete(existente)
    db.commit()

    return {"mensaje": "Estudiante eliminado correctamente"}


# ==========================================
#   CRUD PROFESORES
# ==========================================

@app.post("/profesores")
def agregar_profesor(prof: Profesor):
    db = SessionLocal()

    existente = db.query(ProfesorDB).filter(ProfesorDB.nombre == prof.nombre).first()
    if existente:
        raise HTTPException(status_code=400, detail="El profesor ya existe")

    nuevo = ProfesorDB(nombre=prof.nombre, edad=prof.edad, materia=prof.materia)
    db.add(nuevo)
    db.commit()

    return {"mensaje": "Profesor agregado correctamente"}


@app.get("/profesores")
def listar_profesores():
    db = SessionLocal()
    data = db.query(ProfesorDB).all()
    return data


@app.put("/profesores/{nombre}")
def actualizar_profesor(nombre: str, prof: Profesor):
    db = SessionLocal()

    existente = db.query(ProfesorDB).filter(ProfesorDB.nombre == nombre).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")

    existente.nombre = prof.nombre
    existente.edad = prof.edad
    existente.materia = prof.materia

    db.commit()

    return {"mensaje": "Profesor actualizado correctamente"}


@app.delete("/profesores/{nombre}")
def eliminar_profesor(nombre: str):
    db = SessionLocal()

    existente = db.query(ProfesorDB).filter(ProfesorDB.nombre == nombre).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")

    db.delete(existente)
    db.commit()

    return {"mensaje": "Profesor eliminado correctamente"}


# ==========================================
#   CRUD CURSOS
# ==========================================

@app.post("/cursos")
def agregar_curso(curso: Curso):
    db = SessionLocal()

    existente = db.query(CursoDB).filter(CursoDB.titulo == curso.titulo).first()
    if existente:
        raise HTTPException(status_code=400, detail="El curso ya existe")

    nuevo = CursoDB(titulo=curso.titulo, creditos=curso.creditos)
    db.add(nuevo)
    db.commit()

    return {"mensaje": "Curso agregado correctamente"}


@app.get("/cursos")
def listar_cursos():
    db = SessionLocal()
    data = db.query(CursoDB).all()
    return data


@app.put("/cursos/{titulo}")
def actualizar_curso(titulo: str, curso: Curso):
    db = SessionLocal()

    existente = db.query(CursoDB).filter(CursoDB.titulo == titulo).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Curso no encontrado")

    existente.titulo = curso.titulo
    existente.creditos = curso.creditos

    db.commit()

    return {"mensaje": "Curso actualizado correctamente"}


@app.delete("/cursos/{titulo}")
def eliminar_curso(titulo: str):
    db = SessionLocal()

    existente = db.query(CursoDB).filter(CursoDB.titulo == titulo).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Curso no encontrado")

    db.delete(existente)
    db.commit()

    return {"mensaje": "Curso eliminado correctamente"}
