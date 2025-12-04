from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

# Schemas correctos
from app.schemas.user_schema import UserCreate, UserLogin

# Modelo de SQLAlchemy
from app.models.user_model import UserDB

# Dependencia para obtener la BD
from app.utils.dependencias import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])


# ===============================
#  Registrar Usuario
# ===============================
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    # Validar si ya existe username o email
    user_exist = db.query(UserDB).filter(
        (UserDB.username == user.username) | 
        (UserDB.email == user.email)
    ).first()

    if user_exist:
        raise HTTPException(status_code=400, detail="Usuario o correo ya existe")

    new_user = UserDB(
        username=user.username,
        email=user.email,
        password=user.password  # más adelante lo encriptamos
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Usuario registrado correctamente"}


# ===============================
#  Login
# ===============================
@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):

    user = db.query(UserDB).filter(UserDB.username == data.username).first()

    if not user or user.password != data.password:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    return {"message": "Login exitoso", "username": user.username}


@router.delete("/delete/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db.delete(user)
    db.commit()

    return {"message": "Usuario eliminado correctamente"}