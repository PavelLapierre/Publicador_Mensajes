# Plan de pruebas - Publicador de mensajes

## Escenarios funcionales

1. **Campos vacíos**
   - Acción: dejar título y contenido vacíos y pulsar "Publicar".
   - Esperado: mensaje de error de validación, no se envía petición.
   - Verificar: pestaña Network sin nueva solicitud POST.

2. **Solo espacios**
   - Acción: ingresar "   " en ambos campos y pulsar "Publicar".
   - Esperado: mensaje de error de validación, no se envía petición.

3. **Solo título vacío**
   - Acción: título vacío, contenido válido.
   - Esperado: error específico del título.

4. **Solo contenido vacío**
   - Acción: título válido, contenido vacío.
   - Esperado: error específico del contenido.

5. **Publicación válida**
   - Acción: ingresar título y contenido válidos y pulsar "Publicar".
   - Esperado: indicador de carga, botón deshabilitado, respuesta mostrada (ID, título, contenido, usuario), mensaje de éxito, botón habilitado.

6. **No recarga de página**
   - Acción: enviar formulario válido.
   - Esperado: la URL no cambia y el área de resultado se actualiza sin recargar.

7. **Seguridad**
   - Acción: ingresar `<script>alert(1)</script>` como título.
   - Esperado: se muestra como texto, no se ejecuta código.

## Verificación técnica (DevTools)

En la pestaña **Network** revisar la solicitud POST:

- Request URL: `https://jsonplaceholder.typicode.com/posts`
- Request Method: `POST`
- Request Headers: `Content-Type: application/json`
- Request Payload: objeto JSON con `title`, `body` y `userId`.
- Status Code: `201 Created`.
- Response: objeto JSON con `id`, `title`, `body`, `userId`.

En la **Console**, no deben aparecer errores en el flujo válido; en caso de
fallo de red se registrará el error con `console.error`.

## Posible prueba de error HTTP (opcional)

Cambiar temporalmente `URL_API` a una ruta inexistente para observar el manejo
de respuestas no satisfactorias (`response.ok === false`) y la restauración del
botón.

---

## Página auxiliar de errores

Abrir `tests/prueba-errores.html` para ejecutar:

- **Probar URL inexistente (404)**: verifica el manejo de respuestas HTTP no satisfactorias mediante `response.ok`.
- **Probar error de conexión**: verifica el manejo de errores de red (TypeError) y el restablecimiento de la interfaz.

