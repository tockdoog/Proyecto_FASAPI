# main.py
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

# Routers
from app.routers.estudiantes_router import router as estudiantes_router
from app.routers.profesores_router import router as profesores_router
from app.routers.cursos_router import router as cursos_router
from app.routers.auth_router import router as auth_router
from app.models.user_models import UserDB


# Base y motor para crear tablas
from app.databases.db import Base, engine
from app.models.models_sqlalchemy import EstudianteDB, ProfesorDB, CursoDB

# Crear las tablas en SQLite si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Escuela")

# Montar carpeta pública para CSS, JS, imágenes
app.mount("/public", StaticFiles(directory="public"), name="public")

# Incluir routers
app.include_router(estudiantes_router)
app.include_router(profesores_router)
app.include_router(cursos_router)
app.include_router(auth_router)


# Ruta principal sirve tu index.html
@app.get("/")
def home():
    return FileResponse("public/frontend/templates/index.html")
