/* =============================
   Configuración y Constantes
============================= */
const API_URL = "http://127.0.0.1:8000";
const TOAST_TIMEOUT = 4000;
const LOADING_DELAY = 300;

/* =============================
   Sistema de Notificaciones Toast
============================= */
class ToastManager {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        let container = document.getElementById('app-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'app-toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    show(type, message, duration = TOAST_TIMEOUT) {
        const toast = document.createElement('div');
        toast.className = `app-toast app-toast-${type}`;
        toast.textContent = message;
        
        this.container.appendChild(toast);

        // Animación de entrada
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto-remover
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    this.container.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    success(message) {
        this.show('success', message);
    }

    error(message) {
        this.show('error', message);
    }

    info(message) {
        this.show('info', message);
    }
}

const toast = new ToastManager();

/* =============================
   Utilidades de API
============================= */
class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL.replace(/\/+$/, '');
    }

    async request(endpoint, method = 'GET', data = null) {
        try {
            const url = `${this.baseURL}/${endpoint.replace(/^\//, '')}`;
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            if (data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);

            // Manejo de respuesta vacía (204)
            if (response.status === 204) {
                return { success: true };
            }

            const text = await response.text();
            let result = null;

            try {
                result = text ? JSON.parse(text) : null;
            } catch (e) {
                result = text;
            }

            if (!response.ok) {
                const errorMessage = result?.detail || result?.mensaje || result?.error || `Error ${response.status}`;
                throw new Error(errorMessage);
            }

            return result;
        } catch (error) {
            console.error('API Error:', error);
            toast.error(`Error: ${error.message}`);
            throw error;
        }
    }

    get(endpoint) {
        return this.request(endpoint, 'GET');
    }

    post(endpoint, data) {
        return this.request(endpoint, 'POST', data);
    }

    put(endpoint, data) {
        return this.request(endpoint, 'PUT', data);
    }

    delete(endpoint) {
        return this.request(endpoint, 'DELETE');
    }
}

const api = new APIClient(API_URL);

/* =============================
   Utilidades de Tabla
============================= */
class TableManager {
    constructor(selector, columns, editCallback, deleteCallback) {
        this.table = document.querySelector(selector);
        this.tbody = this.table?.querySelector('tbody');
        this.columns = columns;
        this.editCallback = editCallback;
        this.deleteCallback = deleteCallback;
    }

    showLoading() {
        if (!this.tbody) return;
        this.tbody.innerHTML = `
            <tr class="loading-row">
                <td colspan="${this.columns.length + 1}" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </td>
            </tr>
        `;
    }

    showEmpty(message = 'No hay registros disponibles') {
        if (!this.tbody) return;
        this.tbody.innerHTML = `
            <tr>
                <td colspan="${this.columns.length + 1}" class="text-center py-4 text-muted">
                    <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                    <p class="mt-2 mb-0">${message}</p>
                </td>
            </tr>
        `;
    }

    render(data) {
        if (!this.tbody) return;

        if (!data || data.length === 0) {
            this.showEmpty();
            return;
        }

        this.tbody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            
            // Agregar columnas de datos
            this.columns.forEach(column => {
                const td = document.createElement('td');
                const value = item[column];
                td.textContent = value !== null && value !== undefined ? value : '-';
                row.appendChild(td);
            });

            // Agregar columna de acciones
            const tdActions = document.createElement('td');
            tdActions.className = 'text-center';
            tdActions.innerHTML = `
                <button class="btn btn-sm btn-success me-1" data-action="edit" title="Editar">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-danger" data-action="delete" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            `;

            // Event listeners para botones
            tdActions.querySelector('[data-action="edit"]').addEventListener('click', () => {
                this.editCallback(item);
            });

            tdActions.querySelector('[data-action="delete"]').addEventListener('click', () => {
                this.deleteCallback(item.id);
            });

            row.appendChild(tdActions);
            this.tbody.appendChild(row);
        });
    }
}

/* =============================
   Utilidades de Formulario
============================= */
class FormManager {
    constructor(prefix, fields) {
        this.prefix = prefix;
        this.fields = fields;
    }

    getValues() {
        const values = {};
        this.fields.forEach(field => {
            const element = document.getElementById(`${this.prefix}-${field}`);
            if (!element) return;

            const value = element.value.trim();
            
            if (element.type === 'number') {
                values[field] = value === '' ? null : parseInt(value, 10);
            } else {
                values[field] = value;
            }
        });
        return values;
    }

    setValues(data) {
        this.fields.forEach(field => {
            const element = document.getElementById(`${this.prefix}-${field}`);
            if (!element) return;

            const value = data[field];
            element.value = value !== null && value !== undefined ? value : '';
        });
    }

    clear() {
        this.fields.forEach(field => {
            const element = document.getElementById(`${this.prefix}-${field}`);
            if (!element || element.type === 'hidden') return;
            element.value = '';
        });
        
        // Limpiar ID oculto
        const idElement = document.getElementById(`${this.prefix}-id`);
        if (idElement) idElement.value = '';
    }

    validate() {
        const values = this.getValues();
        const errors = [];

        this.fields.forEach(field => {
            const element = document.getElementById(`${this.prefix}-${field}`);
            if (!element || !element.required) return;

            const value = values[field];
            if (!value && value !== 0) {
                errors.push(`El campo ${element.placeholder || field} es requerido`);
            }
        });

        return {
            valid: errors.length === 0,
            errors
        };
    }

    getId() {
        const idElement = document.getElementById(`${this.prefix}-id`);
        return idElement ? idElement.value : null;
    }

    setId(id) {
        const idElement = document.getElementById(`${this.prefix}-id`);
        if (idElement) idElement.value = id;
    }
}

/* =============================
   CRUD: Estudiantes
============================= */
const estudiantesForm = new FormManager('est', ['nombre', 'edad', 'carrera']);
const estudiantesTable = new TableManager(
    '#tabla-est',
    ['id', 'nombre', 'edad', 'carrera'],
    cargarEstudiante,
    eliminarEstudiante
);

async function listarEstudiantes() {
    estudiantesTable.showLoading();
    try {
        const data = await api.get('estudiantes');
        setTimeout(() => estudiantesTable.render(data), LOADING_DELAY);
    } catch (error) {
        estudiantesTable.showEmpty('Error al cargar estudiantes');
    }
}

async function agregarEstudiante() {
    const validation = estudiantesForm.validate();
    if (!validation.valid) {
        toast.error(validation.errors[0]);
        return;
    }

    const data = estudiantesForm.getValues();
    try {
        const result = await api.post('estudiantes', data);
        toast.success(result.mensaje || 'Estudiante agregado exitosamente');
        estudiantesForm.clear();
        listarEstudiantes();
    } catch (error) {
        // Error ya manejado en APIClient
    }
}

function cargarEstudiante(estudiante) {
    estudiantesForm.setValues(estudiante);
    estudiantesForm.setId(estudiante.id);
    toast.info('Estudiante cargado. Modifica los datos y presiona Actualizar');
}

async function actualizarEstudiante() {
    const id = estudiantesForm.getId();
    if (!id) {
        toast.error('Selecciona un estudiante para actualizar');
        return;
    }

    const validation = estudiantesForm.validate();
    if (!validation.valid) {
        toast.error(validation.errors[0]);
        return;
    }

    const data = estudiantesForm.getValues();
    try {
        const result = await api.put(`estudiantes/${id}`, data);
        toast.success(result.mensaje || 'Estudiante actualizado exitosamente');
        estudiantesForm.clear();
        listarEstudiantes();
    } catch (error) {
        // Error ya manejado en APIClient
    }
}

async function eliminarEstudiante(id) {
    if (!confirm('¿Estás seguro de eliminar este estudiante?')) {
        return;
    }

    try {
        const result = await api.delete(`estudiantes/${id}`);
        toast.success(result.mensaje || 'Estudiante eliminado exitosamente');
        listarEstudiantes();
    } catch (error) {
        // Error ya manejado en APIClient
    }
}

/* =============================
   CRUD: Profesores
============================= */
const profesoresForm = new FormManager('prof', ['nombre', 'edad', 'materia']);
const profesoresTable = new TableManager(
    '#tabla-prof',
    ['id', 'nombre', 'edad', 'materia'],
    cargarProfesor,
    eliminarProfesor
);

async function listarProfesores() {
    profesoresTable.showLoading();
    try {
        const data = await api.get('profesores');
        setTimeout(() => profesoresTable.render(data), LOADING_DELAY);
    } catch (error) {
        profesoresTable.showEmpty('Error al cargar profesores');
    }
}

async function agregarProfesor() {
    const validation = profesoresForm.validate();
    if (!validation.valid) {
        toast.error(validation.errors[0]);
        return;
    }

    const data = profesoresForm.getValues();
    try {
        const result = await api.post('profesores', data);
        toast.success(result.mensaje || 'Profesor agregado exitosamente');
        profesoresForm.clear();
        listarProfesores();
    } catch (error) {
        // Error ya manejado en APIClient
    }
}

function cargarProfesor(profesor) {
    profesoresForm.setValues(profesor);
    profesoresForm.setId(profesor.id);
    toast.info('Profesor cargado. Modifica los datos y presiona Actualizar');
}

async function actualizarProfesor() {
    const id = profesoresForm.getId();
    if (!id) {
        toast.error('Selecciona un profesor para actualizar');
        return;
    }

    const validation = profesoresForm.validate();
    if (!validation.valid) {
        toast.error(validation.errors[0]);
        return;
    }

    const data = profesoresForm.getValues();
    try {
        const result = await api.put(`profesores/${id}`, data);
        toast.success(result.mensaje || 'Profesor actualizado exitosamente');
        profesoresForm.clear();
        listarProfesores();
    } catch (error) {
        // Error ya manejado en APIClient
    }
}

async function eliminarProfesor(id) {
    if (!confirm('¿Estás seguro de eliminar este profesor?')) {
        return;
    }

    try {
        const result = await api.delete(`profesores/${id}`);
        toast.success(result.mensaje || 'Profesor eliminado exitosamente');
        listarProfesores();
    } catch (error) {
        // Error ya manejado en APIClient
    }
}

/* =============================
   CRUD: Cursos
============================= */
const cursosForm = new FormManager('cur', ['titulo', 'creditos']);
const cursosTable = new TableManager(
    '#tabla-cursos',
    ['id', 'titulo', 'creditos'],
    cargarCurso,
    eliminarCurso
);

async function listarCursos() {
    cursosTable.showLoading();
    try {
        const data = await api.get('cursos');
        setTimeout(() => cursosTable.render(data), LOADING_DELAY);
    } catch (error) {
        cursosTable.showEmpty('Error al cargar cursos');
    }
}

async function agregarCurso() {
    const validation = cursosForm.validate();
    if (!validation.valid) {
        toast.error(validation.errors[0]);
        return;
    }

    const data = cursosForm.getValues();
    try {
        const result = await api.post('cursos', data);
        toast.success(result.mensaje || 'Curso agregado exitosamente');
        cursosForm.clear();
        listarCursos();
    } catch (error) {
        // Error ya manejado en APIClient
    }
}

function cargarCurso(curso) {
    cursosForm.setValues(curso);
    cursosForm.setId(curso.id);
    toast.info('Curso cargado. Modifica los datos y presiona Actualizar');
}

async function actualizarCurso() {
    const id = cursosForm.getId();
    if (!id) {
        toast.error('Selecciona un curso para actualizar');
        return;
    }

    const validation = cursosForm.validate();
    if (!validation.valid) {
        toast.error(validation.errors[0]);
        return;
    }

    const data = cursosForm.getValues();
    try {
        const result = await api.put(`cursos/${id}`, data);
        toast.success(result.mensaje || 'Curso actualizado exitosamente');
        cursosForm.clear();
        listarCursos();
    } catch (error) {
        // Error ya manejado en APIClient
    }
}

async function eliminarCurso(id) {
    if (!confirm('¿Estás seguro de eliminar este curso?')) {
        return;
    }

    try {
        const result = await api.delete(`cursos/${id}`);
        toast.success(result.mensaje || 'Curso eliminado exitosamente');
        listarCursos();
    } catch (error) {
        // Error ya manejado en APIClient
    }
}

/* =============================
   Inicialización
============================= */
document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos iniciales
    listarEstudiantes();
    listarProfesores();
    listarCursos();

    // Mensaje de bienvenida
    setTimeout(() => {
        toast.info('Sistema CRUD cargado correctamente');
    }, 500);

    // Manejar cambios de tab para recargar datos
    const tabs = document.querySelectorAll('.nav-link[data-bs-toggle="tab"]');
    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', (event) => {
            const target = event.target.getAttribute('data-bs-target');
            
            if (target === '#estudiantes-panel') {
                listarEstudiantes();
            } else if (target === '#profesores-panel') {
                listarProfesores();
            } else if (target === '#cursos-panel') {
                listarCursos();
            }
        });
    });
});

/* =============================
   Utilidades Globales
============================= */
// Manejar errores globales
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
});

// Manejar promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rechazada:', event.reason);
});