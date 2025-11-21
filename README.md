# Proyecto_FASAPI

API educativa simple construida con FastAPI y SQLite.

Descripción
-
Este proyecto es una API REST básica para gestionar estudiantes, profesores y cursos. Incluye:

- Endpoints CRUD para tres recursos: `estudiantes`, `profesores` y `cursos`.
- Frontend estático (HTML/CSS/JS) en `public/frontend` para interactuar con la API.
- Persistencia con SQLite usando SQLAlchemy.

Requisitos
-
- Python 3.10+ (recomendado)
- Dependencias definidas en `requirements.txt` (FastAPI, Uvicorn, SQLAlchemy, etc.)

Instalación rápida
-
1. Clona el repositorio:

```powershell
git clone <tu-repo-url>
cd Proyecto_FASAPI
```

2. Crea un entorno virtual e instala dependencias:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

3. Crear tablas (se hace automáticamente al arrancar la app) y ejecutar el servidor:

```powershell
uvicorn main:app --reload
```

Uso / Rutas principales
-
La app monta un frontend estático en `/public`. La documentación de OpenAPI está disponible en `/docs`.

Rutas principales (ejemplos):

- Listar estudiantes: `GET /estudiantes`
- Obtener estudiante por id: `GET /estudiantes/{id}`
- Crear estudiante: `POST /estudiantes` (body JSON)
- Actualizar estudiante: `PUT /estudiantes/{id}` (body JSON)
- Eliminar estudiante: `DELETE /estudiantes/{id}`

- Rutas equivalentes existen para `profesores` y `cursos`.

Frontend
-
El frontend está en `public/frontend`. Para probar la UI abre `http://127.0.0.1:8000/` en tu navegador una vez que el servidor esté corriendo.

Notas sobre cambios recientes
-
- Se corrigieron las rutas PUT/DELETE para usar `id` en lugar de `nombre`/`titulo`, y se añadieron endpoints `GET /{id}` y `response_model` en los routers.
- El `POST` ahora devuelve `201 Created` y retorna el objeto creado junto con un mensaje para facilitar integración desde el frontend.
- CSS modernizado en `public/frontend/static/css/styles.css`.

Pruebas rápidas con curl (ejemplos)
-
Crear estudiante:

```powershell
curl -X POST "http://127.0.0.1:8000/estudiantes" -H "Content-Type: application/json" -d '{"nombre":"Ana","edad":21,"carrera":"Matemáticas"}'
```

Obtener lista:

```powershell
curl http://127.0.0.1:8000/estudiantes
```

Contribuir
-
Si quieres mejorar el proyecto: crea un branch, añade cambios y abre un pull request. Para cambios en la API, documenta las rutas nuevas en este README.

Contacto
-
Si necesitas ayuda, comenta en el repositorio o escribe un issue describiendo el problema.

