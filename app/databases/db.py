"""Configuración de la conexión a la base de datos.

Este módulo crea un motor de SQLAlchemy (`engine`), una fábrica de sesiones
(`SessionLocal`) y la clase base declarativa (`Base`) que usan los modelos.

En este proyecto se usa SQLite con un archivo `data.db` en la raíz.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL de la base de datos. Para usar otra DB, cambia esta cadena.
DATABASE_URL = "sqlite:///./data.db"

# Motor de SQLAlchemy
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# SessionLocal es la fábrica que crea sesiones (objetos `Session`).
# `expire_on_commit=False` evita que los objetos devueltos se invaliden
# inmediatamente después de un `commit`, lo cual es más cómodo para APIs.
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, expire_on_commit=False)

# Base es la clase que deben heredar los modelos declarativos.
Base = declarative_base()
