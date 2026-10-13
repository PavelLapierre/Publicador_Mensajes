// Pruebas de errores HTTP para el Publicador de mensajes.
// Reutiliza el flujo de Fetch del app principal, pero contra endpoints que fallan.

const resultado = document.getElementById("resultado-prueba");
const detalle = document.getElementById("detalle-prueba");
const btn404 = document.getElementById("btn-404");
const btnRed = document.getElementById("btn-red");

function mostrarResultado(texto, tipo, informacion) {
  resultado.textContent = texto;
  resultado.className = "mensaje " + tipo;
  detalle.textContent = informacion || "";
}

async function probarRespuestaNoSatisfactoria() {
  const url = "https://jsonplaceholder.typicode.com/endpoint-inexistente";
  try {
    const respuesta = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "Prueba", body: "Cuerpo" }) });
    if (!respuesta.ok) {
      mostrarResultado(
        "Respuesta HTTP no satisfactoria: " + respuesta.status + " " + respuesta.statusText,
        "error",
        "URL: " + url + "\nStatus: " + respuesta.status + "\nresponse.ok: " + respuesta.ok
      );
      return;
    }
    mostrarResultado("La respuesta fue satisfactoria (inesperado en esta prueba).", "exito", "");
  } catch (error) {
    mostrarResultado("Error de conexión: " + error.message, "error", String(error));
  }
}

async function probarErrorDeConexion() {
  const url = "https://dominio-que-no-existe.invalid/posts";
  try {
    const respuesta = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "Prueba", body: "Cuerpo" }) });
    if (!respuesta.ok) {
      mostrarResultado("Respuesta HTTP no satisfactoria: " + respuesta.status, "error", "");
      return;
    }
    mostrarResultado("La respuesta fue satisfactoria (inesperado).", "exito", "");
  } catch (error) {
    const esTypeError = error instanceof TypeError;
    mostrarResultado(
      esTypeError ? "Error de conexión detectado (TypeError)." : "Error inesperado: " + error.message,
      "error",
      "URL: " + url + "\nTipo: " + error.constructor.name + "\nMensaje: " + error.message
    );
  }
}

btn404.addEventListener("click", probarRespuestaNoSatisfactoria);
btnRed.addEventListener("click", probarErrorDeConexion);
