from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Routers
from app.routers.estudiantes_router import router as estudiantes_router
from app.routers.profesores_router import router as profesores_router
from app.routers.cursos_router import router as cursos_router
from app.routers.auth_router import router as auth_router

# DB + modelos
from app.databases.db import Base, engine
from app.models.models_sqlalchemy import EstudianteDB, ProfesorDB, CursoDB
from app.models.user_model import UserDB

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Escuela")

# Archivos estáticos
app.mount("/public", StaticFiles(directory="public"), name="public")

# Incluir routers
app.include_router(estudiantes_router)
app.include_router(profesores_router)
app.include_router(cursos_router)
app.include_router(auth_router)

# Página principal = login
@app.get("/")
def root():
    return FileResponse("public/frontend/templates/login.html")
