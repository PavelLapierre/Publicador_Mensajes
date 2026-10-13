/* ============================
   Publicador de mensajes
   ============================
   Archivo: js/app.js
   Responsabilidad: gestionar eventos, validaciones, la petición HTTP (Fetch),
   el procesamiento asíncrono de la respuesta y la actualización del DOM.
   ============================ */

// Endpoint de la API REST de pruebas utilizado para crear publicaciones.
const URL_API = "https://jsonplaceholder.typicode.com/posts";

// --- Referencias al DOM (se obtienen una sola vez al cargar el script) ---
const formulario = document.getElementById("formulario-publicacion");
const campoTitulo = document.getElementById("titulo");
const campoContenido = document.getElementById("contenido");
const botonPublicar = document.getElementById("boton-publicar");
const spinnerBoton = document.querySelector("#boton-publicar .spinner");
const indicadorCarga = document.getElementById("indicador-carga");
const mensajeEstado = document.getElementById("mensaje-estado");
const contenedorResultado = document.getElementById("contenedor-resultado");
const resultadoId = document.getElementById("resultado-id");
const resultadoTitulo = document.getElementById("resultado-titulo");
const resultadoContenido = document.getElementById("resultado-contenido");
const resultadoUsuario = document.getElementById("resultado-usuario");

// --- Utilidades de interfaz ---

/**
 * Muestra un mensaje de estado en el DOM usando un tipo (info, exito, error, cargando).
 * Se usa textContent para evitar inyección de HTML con datos externos o mensajes.
 * @param {string} texto - Mensaje a mostrar.
 * @param {"info"|"exito"|"error"|"cargando"} tipo - Clase CSS asociada.
 */
function mostrarEstado(texto, tipo) {
  mensajeEstado.textContent = texto;
  mensajeEstado.className = "mensaje " + tipo;
}

/**
 * Limpia el mensaje de estado y oculta el contenedor de resultado.
 */
function limpiarEstado() {
  mensajeEstado.textContent = "";
  mensajeEstado.className = "mensaje";
  contenedorResultado.hidden = true;
}

/**
 * Activa o desactiva el estado de carga de la interfaz.
 * Mientras está activo, el botón se deshabilita y se muestra un indicador.
 * @param {boolean} estaCargando
 */
function establecerCarga(estaCargando) {
  botonPublicar.disabled = estaCargando;
  spinnerBoton.hidden = !estaCargando;
  indicadorCarga.hidden = !estaCargando;
  if (estaCargando) {
    mostrarEstado("Enviando publicación, por favor espera...", "cargando");
  }
}

/**
 * Valida los campos del formulario.
 * Un campo es inválido si está vacío o contiene únicamente espacios.
 * @param {string} titulo
 * @param {string} contenido
 * @returns {{esValido: boolean, mensaje: string}}
 */
function validarCampos(titulo, contenido) {
  if (titulo.trim() === "") {
    return { esValido: false, mensaje: "El título es obligatorio y no puede contener solo espacios." };
  }
  if (contenido.trim() === "") {
    return { esValido: false, mensaje: "El contenido es obligatorio y no puede contener solo espacios." };
  }
  return { esValido: true, mensaje: "" };
}

/**
 * Presenta en el DOM los datos devueltos por la API.
 * Utiliza textContent para mostrar de forma segura los valores externos.
 * @param {Object} datos - Objeto JSON recibido de la API.
 */
function mostrarResultado(datos) {
  resultadoId.textContent = datos.id != null ? String(datos.id) : "No disponible";
  resultadoTitulo.textContent = datos.title != null ? String(datos.title) : "";
  resultadoContenido.textContent = datos.body != null ? String(datos.body) : "";
  resultadoUsuario.textContent = datos.userId != null ? String(datos.userId) : "No disponible";
  contenedorResultado.hidden = false;
}

/**
 * Traduce un error capturado en un mensaje comprensible para el usuario,
 * diferenciando errores de conexión, HTTP y de procesamiento.
 * @param {Error} error
 * @returns {string}
 */
function describirError(error) {
  // Los errores de red/connection rechazan la promesa de fetch con un TypeError.
  if (error instanceof TypeError) {
    return "No fue posible conectar con el servidor. Revisa tu conexión a Internet.";
  }
  const mensaje = error && error.message ? error.message : "";
  if (mensaje.startsWith("HTTP")) {
    return "El servidor respondió con un error (" + mensaje.replace("HTTP ", "") + "). Intenta nuevamente.";
  }
  if (mensaje.toLowerCase().includes("json")) {
    return "La respuesta del servidor no pudo interpretarse como JSON válido.";
  }
  return "Ocurrió un error inesperado al procesar la publicación.";
}

// --- Lógica principal ---

/**
 * Construye el objeto de publicación a partir de los valores del formulario.
 * @param {string} titulo
 * @param {string} contenido
 * @returns {{title: string, body: string, userId: number}}
 */
function construirPublicacion(titulo, contenido) {
  return {
    title: titulo.trim(),
    body: contenido.trim(),
    userId: 1
  };
}

/**
 * Envía la publicación a la API mediante Fetch (POST) y procesa la respuesta.
 * @param {Object} publicacion
 */
async function enviarPublicacion(publicacion) {
  const respuesta = await fetch(URL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(publicacion)
  });

  // Fetch no rechaza automáticamente ante errores HTTP (404, 500, etc.),
  // por eso se verifica response.ok antes de considerar la operación exitosa.
  if (!respuesta.ok) {
    throw new Error("HTTP " + respuesta.status + " " + respuesta.statusText);
  }

  // response.json() devuelve una promesa: se espera con await.
  return respuesta.json();
}

// --- Manejador del evento de envío del formulario ---

formulario.addEventListener("submit", async function (evento) {
  // Evita que el navegador recargue la página al enviar el formulario.
  evento.preventDefault();

  const titulo = campoTitulo.value;
  const contenido = campoContenido.value;

  // 1) Validación previa: no se realiza la petición si los datos son inválidos.
  const validacion = validarCampos(titulo, contenido);
  if (!validacion.esValido) {
    mostrarEstado(validacion.mensaje, "error");
    contenedorResultado.hidden = true;
    return;
  }

  // 2) Preparación del estado de carga y prevención de envíos repetidos.
  limpiarEstado();
  establecerCarga(true);

  try {
    const publicacion = construirPublicacion(titulo, contenido);
    const datosRespuesta = await enviarPublicacion(publicacion);

    // 3) Actualización del DOM con la respuesta recibida.
    mostrarResultado(datosRespuesta);
    mostrarEstado("Publicación creada correctamente. ID asignado: " + datosRespuesta.id, "exito");
  } catch (error) {
    // 4) Gestión de errores de conexión, HTTP o procesamiento JSON.
    mostrarEstado(describirError(error), "error");
    contenedorResultado.hidden = true;
    // Se deja registro en consola para la verificación técnica en Network/Console.
    console.error("Error al publicar:", error);
  } finally {
    // 5) Restablecimiento del estado de la interfaz incluso si ocurre un error.
    establecerCarga(false);
  }
});
