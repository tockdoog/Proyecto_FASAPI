"""Rutas relacionadas con profesores.

Endpoints CRUD para el recurso `profesores`. Expone rutas para crear,
listar, obtener por id, actualizar y eliminar profesores.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.models_sqlalchemy import ProfesorDB
from app.schemas.schemas import Profesor, ProfesorOut
from app.utils.dependencias import get_db

router = APIRouter(prefix="/profesores", tags=["Profesores"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def agregar_profesor(prof: Profesor, db: Session = Depends(get_db)):
    """Crear un nuevo profesor.

    Valida el body y guarda el registro en la base de datos.
    """
    existente = db.query(ProfesorDB).filter(ProfesorDB.nombre == prof.nombre).first()
    if existente:
        raise HTTPException(status_code=400, detail="El profesor ya existe")

    nuevo = ProfesorDB(**prof.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return {"mensaje": "Profesor agregado correctamente", "profesor": nuevo}


@router.get("/", response_model=List[ProfesorOut])
def listar_profesores(db: Session = Depends(get_db)):
    """Listar todos los profesores."""
    return db.query(ProfesorDB).all()


@router.get("/{id}", response_model=ProfesorOut)
def obtener_profesor(id: int, db: Session = Depends(get_db)):
    """Obtener un profesor por su `id`. Retorna 404 si no existe."""
    existente = db.query(ProfesorDB).filter(ProfesorDB.id == id).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")
    return existente


@router.put("/{id}")
def actualizar_profesor(id: int, prof: Profesor, db: Session = Depends(get_db)):
    """Actualizar los datos de un profesor existente."""
    existente = db.query(ProfesorDB).filter(ProfesorDB.id == id).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")

    existente.nombre = prof.nombre
    existente.edad = prof.edad
    existente.materia = prof.materia
    db.commit()
    db.refresh(existente)
    return {"mensaje": "Profesor actualizado correctamente", "profesor": existente}


@router.delete("/{id}")
def eliminar_profesor(id: int, db: Session = Depends(get_db)):
    """Eliminar un profesor por `id`."""
    existente = db.query(ProfesorDB).filter(ProfesorDB.id == id).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")

    db.delete(existente)
    db.commit()
    return {"mensaje": "Profesor eliminado correctamente"}
