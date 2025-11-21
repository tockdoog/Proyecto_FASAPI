/* =============================
   Configuración general
============================= */
const API_URL = "http://127.0.0.1:8000";

/* =============================
   Funciones genéricas
============================= */
async function apiRequest(endpoint, method = "GET", data = null) {
    try {
        const options = { method, headers: {} };
        if (data) {
            options.headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(data);
        }
        const res = await fetch(`${API_URL}/${endpoint}`, options);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return await res.json();
    } catch (error) {
        alert(`Error de conexión: ${error.message}`);
        console.error(error);
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
        btnEditar.innerHTML = `<i class="bi bi-pencil-square"></i>`;
        btnEditar.addEventListener("click", () => cargarFn(item));

        // Botón Eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.className = "btn btn-sm btn-danger";
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
        datos[input.split("-")[1]] = el.type === "number" ? parseInt(el.value) : el.value;
    });
    return datos;
}

function asignarValores(inputs, values) {
    inputs.forEach(input => {
        const el = document.getElementById(input);
        el.value = values[input.split("-")[1]];
    });
}

/* =============================
   CRUD ESTUDIANTES
============================= */
async function agregarEstudiante() {
    const datos = obtenerValores(["est-nombre", "est-edad", "est-carrera"]);
    const res = await apiRequest("estudiantes", "POST", datos);
    if (res) alert(res.mensaje);
    listarEstudiantes();
}

async function listarEstudiantes() {
    const data = await apiRequest("estudiantes");
    if (!data) return;
    llenarTabla("#tabla-est", data, ["id", "nombre", "edad", "carrera"], cargarEstudiante, eliminarEstudiante);
}

function cargarEstudiante(item) {
    asignarValores(["est-nombre", "est-edad", "est-carrera"], { nombre: item.nombre, edad: item.edad, carrera: item.carrera });
    document.getElementById("est-id").value = item.id;
}

async function actualizarEstudiante() {
    const id = document.getElementById("est-id").value;
    const datos = obtenerValores(["est-nombre", "est-edad", "est-carrera"]);
    const res = await apiRequest(`estudiantes/${id}`, "PUT", datos);
    if (res) alert(res.mensaje);
    listarEstudiantes();
}

async function eliminarEstudiante(id) {
    if (!confirm(`¿Eliminar estudiante ${id}?`)) return;
    const res = await apiRequest(`estudiantes/${id}`, "DELETE");
    if (res) alert(res.mensaje);
    listarEstudiantes();
}

/* =============================
   CRUD PROFESORES
============================= */
async function agregarProfesor() {
    const datos = obtenerValores(["prof-nombre", "prof-edad", "prof-materia"]);
    const res = await apiRequest("profesores", "POST", datos);
    if (res) alert(res.mensaje);
    listarProfesores();
}

async function listarProfesores() {
    const data = await apiRequest("profesores");
    if (!data) return;
    llenarTabla("#tabla-prof", data, ["id", "nombre", "edad", "materia"], cargarProfesor, eliminarProfesor);
}

function cargarProfesor(item) {
    asignarValores(["prof-nombre", "prof-edad", "prof-materia"], { nombre: item.nombre, edad: item.edad, materia: item.materia });
    document.getElementById("prof-id").value = item.id;
}

async function actualizarProfesor() {
    const id = document.getElementById("prof-id").value;
    const datos = obtenerValores(["prof-nombre", "prof-edad", "prof-materia"]);
    const res = await apiRequest(`profesores/${id}`, "PUT", datos);
    if (res) alert(res.mensaje);
    listarProfesores();
}

async function eliminarProfesor(id) {
    if (!confirm(`¿Eliminar profesor ${id}?`)) return;
    const res = await apiRequest(`profesores/${id}`, "DELETE");
    if (res) alert(res.mensaje);
    listarProfesores();
}

/* =============================
   CRUD CURSOS
============================= */
async function agregarCurso() {
    const datos = obtenerValores(["cur-titulo", "cur-creditos"]);
    const res = await apiRequest("cursos", "POST", datos);
    if (res) alert(res.mensaje);
    listarCursos();
}

async function listarCursos() {
    const data = await apiRequest("cursos");
    if (!data) return;
    llenarTabla("#tabla-cursos", data, ["id", "titulo", "creditos"], cargarCurso, eliminarCurso);
}

function cargarCurso(item) {
    asignarValores(["cur-titulo", "cur-creditos"], { titulo: item.titulo, creditos: item.creditos });
    document.getElementById("cur-id").value = item.id;
}

async function actualizarCurso() {
    const id = document.getElementById("cur-id").value;
    const datos = obtenerValores(["cur-titulo", "cur-creditos"]);
    const res = await apiRequest(`cursos/${id}`, "PUT", datos);
    if (res) alert(res.mensaje);
    listarCursos();
}

async function eliminarCurso(id) {
    if (!confirm(`¿Eliminar curso ${id}?`)) return;
    const res = await apiRequest(`cursos/${id}`, "DELETE");
    if (res) alert(res.mensaje);
    listarCursos();
}

/* =============================
   Inicialización
============================= */
listarEstudiantes();
listarProfesores();
listarCursos();
