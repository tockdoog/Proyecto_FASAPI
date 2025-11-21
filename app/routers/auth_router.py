from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.user_schema import UserCreate, UserLogin, UserResponse
from app.models.user_model import UserDB
from app.utils.dependencias import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])


# -------------------------------
#   REGISTRO
# -------------------------------
@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):

    # Verificar si el usuario ya existe
    existing_user = db.query(UserDB).filter(
        (UserDB.username == user.username) | (UserDB.email == user.email)
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="El usuario o email ya existe")

    new_user = UserDB(
        username=user.username,
        email=user.email,
        password=user.password  # (luego podemos encriptarla)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# -------------------------------
#   LOGIN
# -------------------------------
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(UserDB).filter(UserDB.username == user.username).first()

    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    return {"success": True}
