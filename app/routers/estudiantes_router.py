"""Rutas relacionadas con estudiantes.

Este router expone endpoints CRUD para el recurso `estudiantes`.
Cada endpoint recibe una sesión de DB con la dependencia `get_db`.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.models_sqlalchemy import EstudianteDB
from app.schemas.schemas import Estudiante, EstudianteOut
from app.utils.dependencias import get_db

router = APIRouter(prefix="/estudiantes", tags=["Estudiantes"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def agregar_estudiante(est: Estudiante, db: Session = Depends(get_db)):
    """Crear un nuevo estudiante.

    - Valida el body contra el esquema `Estudiante`.
    - Comprueba si ya existe un estudiante con el mismo nombre.
    - Devuelve 201 y el objeto creado en caso de éxito.
    """
    existente = db.query(EstudianteDB).filter(EstudianteDB.nombre == est.nombre).first()
    if existente:
        raise HTTPException(status_code=400, detail="El estudiante ya existe")

    nuevo = EstudianteDB(**est.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return {"mensaje": "Estudiante agregado correctamente", "estudiante": nuevo}


@router.get("/", response_model=List[EstudianteOut])
def listar_estudiantes(db: Session = Depends(get_db)):
    """Listar todos los estudiantes.

    Devuelve una lista de objetos serializados según `EstudianteOut`.
    """
    return db.query(EstudianteDB).all()


@router.get("/{id}", response_model=EstudianteOut)
def obtener_estudiante(id: int, db: Session = Depends(get_db)):
    """Obtener un estudiante por su `id`.

    Retorna 404 si no existe.
    """
    existente = db.query(EstudianteDB).filter(EstudianteDB.id == id).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    return existente


@router.put("/{id}")
def actualizar_estudiante(id: int, est: Estudiante, db: Session = Depends(get_db)):
    """Actualizar un estudiante existente por `id`.

    Se reemplazan los campos `nombre`, `edad` y `carrera`.
    """
    existente = db.query(EstudianteDB).filter(EstudianteDB.id == id).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    existente.nombre = est.nombre
    existente.edad = est.edad
    existente.carrera = est.carrera
    db.commit()
    db.refresh(existente)
    return {"mensaje": "Estudiante actualizado correctamente", "estudiante": existente}


@router.delete("/{id}")
def eliminar_estudiante(id: int, db: Session = Depends(get_db)):
    """Eliminar un estudiante por `id`.

    Devuelve un mensaje de confirmación. Retorna 404 si no existe.
    """
    existente = db.query(EstudianteDB).filter(EstudianteDB.id == id).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    db.delete(existente)
    db.commit()
    return {"mensaje": "Estudiante eliminado correctamente"}
