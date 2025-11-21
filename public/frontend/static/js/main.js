/* =============================
   Configuración general
============================= */
const API_URL = "http://127.0.0.1:8000";

// Contenedor para toasts (mensajes no bloqueantes)
function ensureToastContainer() {
    let container = document.getElementById('app-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'app-toast-container';
        container.style.position = 'fixed';
        container.style.right = '18px';
        container.style.bottom = '18px';
        container.style.zIndex = 9999;
        document.body.appendChild(container);
    }
    return container;
}

function showMessage(type, text, timeout = 3500) {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = `app-toast app-toast-${type}`;
    toast.style.minWidth = '220px';
    toast.style.marginTop = '8px';
    toast.style.padding = '10px 12px';
    toast.style.borderRadius = '8px';
    toast.style.color = '#fff';
    toast.style.boxShadow = '0 6px 18px rgba(2,6,23,0.08)';
    toast.style.fontSize = '0.95rem';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .18s, transform .18s';

    if (type === 'error') toast.style.background = '#dc3545';
    else if (type === 'success') toast.style.background = '#16a34a';
    else toast.style.background = '#2563eb';

    toast.textContent = text;
    container.appendChild(toast);

    // appear
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(-4px)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(0)';
        setTimeout(() => container.removeChild(toast), 220);
    }, timeout);
}

/* =============================
   Funciones genéricas
============================= */
async function apiRequest(endpoint, method = "GET", data = null) {
    try {
        const cleanBase = API_URL.replace(/\/+$| \/+$/g, '');
        const cleanEndpoint = endpoint.replace(/^\/+/, '');
        const url = `${cleanBase}/${cleanEndpoint}`;

        const options = { method, headers: {} };
        if (data) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }

        const res = await fetch(url, options);

        // No content
        if (res.status === 204) return { status: 204 };

        const text = await res.text();
        let parsed = null;
        try { parsed = text ? JSON.parse(text) : null; } catch (e) { parsed = text; }

        if (!res.ok) {
            const msg = (parsed && (parsed.detail || parsed.mensaje || parsed.error)) || `Error ${res.status}`;
            throw new Error(msg);
        }

        return parsed;
    } catch (error) {
        showMessage('error', `Error de conexión: ${error.message}`);
        console.error(error);
        return null;
    }
}

function llenarTabla(selector, data, campos, cargarFn, eliminarFn) {
    const tabla = document.querySelector(selector + " tbody");
    tabla.innerHTML = "";

    data.forEach(item => {
        const fila = document.createElement("tr");

        // Agregar columnas de datos
        campos.forEach(campo => {
            const td = document.createElement("td");
            td.textContent = item[campo];
            fila.appendChild(td);
        });

        // Columna de acciones
        const tdAcciones = document.createElement("td");

        // Botón Editar
        const btnEditar = document.createElement("button");
        btnEditar.className = "btn btn-sm btn-success me-1";
        btnEditar.setAttribute('aria-label', 'Editar');
        btnEditar.innerHTML = `<i class="bi bi-pencil-square"></i>`;
        btnEditar.addEventListener("click", () => cargarFn(item));

        // Botón Eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.className = "btn btn-sm btn-danger";
        btnEliminar.setAttribute('aria-label', 'Eliminar');
        btnEliminar.innerHTML = `<i class="bi bi-trash"></i>`;
        btnEliminar.addEventListener("click", () => eliminarFn(item.id));

        tdAcciones.appendChild(btnEditar);
        tdAcciones.appendChild(btnEliminar);
        fila.appendChild(tdAcciones);

        tabla.appendChild(fila);
    });
}

function obtenerValores(inputs) {
    const datos = {};
    inputs.forEach(input => {
        const el = document.getElementById(input);
        if (!el) return;
        const key = input.split("-")[1];
        const raw = (el.value || '').toString().trim();
        if (el.type === 'number') {
            datos[key] = raw === '' ? null : parseInt(raw, 10);
        } else {
            datos[key] = raw;
        }
    });
    return datos;
}

function asignarValores(inputs, values) {
    inputs.forEach(input => {
        const el = document.getElementById(input);
        if (!el) return;
        const key = input.split("-")[1];
        el.value = values[key] !== undefined && values[key] !== null ? values[key] : '';
    });
}

/* =============================
   CRUD ESTUDIANTES
============================= */
async function agregarEstudiante() {
    const datos = obtenerValores(["est-nombre", "est-edad", "est-carrera"]);
    // Validación básica
    if (!datos.nombre) return showMessage('error', 'Nombre es requerido');
    const res = await apiRequest("estudiantes", "POST", datos);
    if (res && res.mensaje) showMessage('success', res.mensaje);
    limpiarFormulario('est');
    listarEstudiantes();
}

async function listarEstudiantes() {
    const data = await apiRequest("estudiantes");
    if (!data) return;
    llenarTabla("#tabla-est", data, ["id", "nombre", "edad", "carrera"], cargarEstudiante, eliminarEstudiante);
}

function cargarEstudiante(item) {
    asignarValores(["est-nombre", "est-edad", "est-carrera"], { nombre: item.nombre, edad: item.edad, carrera: item.carrera });
    const idEl = document.getElementById("est-id"); if (idEl) idEl.value = item.id;
}

async function actualizarEstudiante() {
    const id = document.getElementById("est-id").value;
    if (!id) return showMessage('error', 'Seleccione un estudiante a actualizar');
    const datos = obtenerValores(["est-nombre", "est-edad", "est-carrera"]);
    const res = await apiRequest(`estudiantes/${id}`, "PUT", datos);
    if (res && res.mensaje) showMessage('success', res.mensaje);
    limpiarFormulario('est');
    listarEstudiantes();
}

async function eliminarEstudiante(id) {
    if (!confirm(`¿Eliminar estudiante ${id}?`)) return;
    const res = await apiRequest(`estudiantes/${id}`, "DELETE");
    if (res && res.mensaje) showMessage('success', res.mensaje);
    listarEstudiantes();
}

/* =============================
   CRUD PROFESORES
============================= */
async function agregarProfesor() {
    const datos = obtenerValores(["prof-nombre", "prof-edad", "prof-materia"]);
    if (!datos.nombre) return showMessage('error', 'Nombre es requerido');
    const res = await apiRequest("profesores", "POST", datos);
    if (res && res.mensaje) showMessage('success', res.mensaje);
    limpiarFormulario('prof');
    listarProfesores();
}

async function listarProfesores() {
    const data = await apiRequest("profesores");
    if (!data) return;
    llenarTabla("#tabla-prof", data, ["id", "nombre", "edad", "materia"], cargarProfesor, eliminarProfesor);
}

function cargarProfesor(item) {
    asignarValores(["prof-nombre", "prof-edad", "prof-materia"], { nombre: item.nombre, edad: item.edad, materia: item.materia });
    const idEl = document.getElementById("prof-id"); if (idEl) idEl.value = item.id;
}

async function actualizarProfesor() {
    const id = document.getElementById("prof-id").value;
    if (!id) return showMessage('error', 'Seleccione un profesor a actualizar');
    const datos = obtenerValores(["prof-nombre", "prof-edad", "prof-materia"]);
    const res = await apiRequest(`profesores/${id}`, "PUT", datos);
    if (res && res.mensaje) showMessage('success', res.mensaje);
    limpiarFormulario('prof');
    listarProfesores();
}

async function eliminarProfesor(id) {
    if (!confirm(`¿Eliminar profesor ${id}?`)) return;
    const res = await apiRequest(`profesores/${id}`, "DELETE");
    if (res && res.mensaje) showMessage('success', res.mensaje);
    listarProfesores();
}

/* =============================
   CRUD CURSOS
============================= */
async function agregarCurso() {
    const datos = obtenerValores(["cur-titulo", "cur-creditos"]);
    if (!datos.titulo) return showMessage('error', 'Título es requerido');
    const res = await apiRequest("cursos", "POST", datos);
    if (res && res.mensaje) showMessage('success', res.mensaje);
    limpiarFormulario('cur');
    listarCursos();
}

async function listarCursos() {
    const data = await apiRequest("cursos");
    if (!data) return;
    llenarTabla("#tabla-cursos", data, ["id", "titulo", "creditos"], cargarCurso, eliminarCurso);
}

function cargarCurso(item) {
    asignarValores(["cur-titulo", "cur-creditos"], { titulo: item.titulo, creditos: item.creditos });
    const idEl = document.getElementById("cur-id"); if (idEl) idEl.value = item.id;
}

async function actualizarCurso() {
    const id = document.getElementById("cur-id").value;
    if (!id) return showMessage('error', 'Seleccione un curso a actualizar');
    const datos = obtenerValores(["cur-titulo", "cur-creditos"]);
    const res = await apiRequest(`cursos/${id}`, "PUT", datos);
    if (res && res.mensaje) showMessage('success', res.mensaje);
    limpiarFormulario('cur');
    listarCursos();
}

async function eliminarCurso(id) {
    if (!confirm(`¿Eliminar curso ${id}?`)) return;
    const res = await apiRequest(`cursos/${id}`, "DELETE");
    if (res && res.mensaje) showMessage('success', res.mensaje);
    listarCursos();
}

/* =============================
   Helpers y Inicialización
============================= */
function limpiarFormulario(prefix) {
    const inputs = Array.from(document.querySelectorAll(`[id^="${prefix}-"]`));
    inputs.forEach(i => { if (i.type !== 'hidden') i.value = ''; });
}

// Ejecutar listados al cargar el DOM
window.addEventListener('DOMContentLoaded', () => {
    listarEstudiantes();
    listarProfesores();
    listarCursos();
});
