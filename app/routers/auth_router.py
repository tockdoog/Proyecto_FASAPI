from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse

from app.utils.dependencias import get_db
from app.models.user_models import UserDB
from app.schemas.user_shema import UserLogin

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login(usuario: UserLogin, db: Session = Depends(get_db)):

    user = db.query(UserDB).filter(UserDB.nickname == usuario.nickname).first()

    if not user:
        raise HTTPException(status_code=400, detail="Usuario no encontrado")

    if user.password != usuario.password:
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")

    return JSONResponse({"mensaje": "Login exitoso"})
