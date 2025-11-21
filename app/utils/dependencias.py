"""Paquete `app.utils`.

Este archivo expone utilidades y dependencias para la aplicación.
"""

from typing import Generator

from sqlalchemy.orm import Session

from app.databases.db import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """Dependencia que crea y cierra una sesión de base de datos.

    Uso en endpoints: `db: Session = Depends(get_db)`.
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
