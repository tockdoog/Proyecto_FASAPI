import hashlib

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verificar_password(password_plano: str, password_hash: str) -> bool:
    return hash_password(password_plano) == password_hash
