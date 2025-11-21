"""Rutas relacionadas con cursos.

CRUD para el recurso `cursos`. Incluye creación, listado, obtención por id,
actualización y eliminación.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.models_sqlalchemy import CursoDB
from app.schemas.schemas import Curso, CursoOut
from app.utils.dependencias import get_db

router = APIRouter(prefix="/cursos", tags=["Cursos"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def agregar_curso(curso: Curso, db: Session = Depends(get_db)):
    """Crear un nuevo curso.

    Valida el body y evita duplicados por título.
    """
    existente = db.query(CursoDB).filter(CursoDB.titulo == curso.titulo).first()
    if existente:
        raise HTTPException(status_code=400, detail="El curso ya existe")

    nuevo = CursoDB(**curso.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return {"mensaje": "Curso agregado correctamente", "curso": nuevo}


@router.get("/", response_model=List[CursoOut])
def listar_cursos(db: Session = Depends(get_db)):
    """Listar todos los cursos."""
    return db.query(CursoDB).all()


@router.get("/{id}", response_model=CursoOut)
def obtener_curso(id: int, db: Session = Depends(get_db)):
    """Obtener un curso por `id`. Retorna 404 si no existe."""
    existente = db.query(CursoDB).filter(CursoDB.id == id).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Curso no encontrado")
    return existente


@router.put("/{id}")
def actualizar_curso(id: int, curso: Curso, db: Session = Depends(get_db)):
    """Actualizar un curso existente por `id`."""
    existente = db.query(CursoDB).filter(CursoDB.id == id).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Curso no encontrado")

    existente.titulo = curso.titulo
    existente.creditos = curso.creditos
    db.commit()
    db.refresh(existente)
    return {"mensaje": "Curso actualizado correctamente", "curso": existente}


@router.delete("/{id}")
def eliminar_curso(id: int, db: Session = Depends(get_db)):
    """Eliminar un curso por `id`."""
    existente = db.query(CursoDB).filter(CursoDB.id == id).first()
    if not existente:
        raise HTTPException(status_code=404, detail="Curso no encontrado")

    db.delete(existente)
    db.commit()
    return {"mensaje": "Curso eliminado correctamente"}
