from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.schemas.user_schema import UserLogin
from app.models.user_model import UserDB
from app.utils.seguridad import verificar_password
from app.utils.dependencias import get_db

router = APIRouter(prefix="/auth", tags=["Login"])


@router.post("/login")
def login(datos: UserLogin, db: Session = Depends(get_db)):

    user = db.query(UserDB).filter(UserDB.nickname == datos.nickname).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if not verificar_password(datos.password, user.password):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    return {"mensaje": "Login exitoso"}
