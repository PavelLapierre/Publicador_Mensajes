# Banco de 30 preguntas para la demostración — Respuestas

Referencias de código:
- `index.html` — estructura del formulario y contenedores.
- `js/app.js` — eventos, validación, Fetch, DOM.
- `tests/prueba-errores.html` y `tests/prueba-errores.js` — pruebas de error.

---

## A. HTML y manipulación del DOM

1. **¿Qué función cumple el formulario HTML y qué ventajas ofrece frente a botones/campos independientes?**
   El formulario agrupa los campos relacionados y permite gestionar el envío con un solo evento `submit`. Ventajas: semántica clara, accesibilidad, validación nativa posible, y un único punto de control (`addEventListener("submit", ...)` + `preventDefault()`). En `index.html` todo el flujo de publicación está dentro de `<form id="formulario-publicacion">`.

2. **¿Diferencia entre `querySelector()` y `getElementById()`? ¿Cuál usaste y por qué?**
   `getElementById()` busca por `id` único y es directo; `querySelector()` acepta cualquier selector CSS y devuelve el primer coincidente. En `js/app.js` se usa `getElementById` para los elementos únicos (formulario, título, contenido, botón, etc.) y `querySelector("#boton-publicar .spinner")` para el spinner, porque se necesita un selector compuesto.

3. **¿Cómo se obtiene el contenido ingresado por el usuario?**
   Mediante la propiedad `.value` de los campos: `campoTitulo.value` y `campoContenido.value` dentro del manejador `submit`.

4. **¿Qué función cumple `addEventListener()`? ¿Qué evento usaste para detectar el envío?**
   Registra una función que se ejecuta cuando ocurre un evento. Se usa `formulario.addEventListener("submit", async function (evento) { ... })`.

5. **¿Por qué usar `textContent` en lugar de `innerHTML`?**
   `textContent` trata el valor como texto plano y evita la ejecución de HTML/JS inyectado. Por eso todos los datos externos (título, contenido, ID, mensajes) se presentan con `textContent`, como en `mostrarResultado()` y `mostrarEstado()`.

6. **¿Cómo actualiza JavaScript el DOM sin recargar la página?**
   Modificando propiedades de los elementos ya existentes: `textContent`, `hidden`, `disabled`, `className`. Por ejemplo, `contenedorResultado.hidden = false;` muestra la respuesta y `botonPublicar.disabled = true;` evita envíos repetidos.

---

## B. JavaScript asíncrono y promesas

7. **¿Qué significa que una operación sea asíncrona? Identifica una en la aplicación.**
   Significa que no bloquea la ejecución mientras espera un resultado. En la app, `fetch(URL_API, {...})` es asíncrona: el navegador envía la petición y el código continúa cuando la promesa se resuelve.

8. **¿Qué es una promesa y qué relación tiene con `fetch()`?**
   Una promesa es un objeto que representa un resultado futuro (pendiente, resuelto o rechazado). `fetch()` devuelve una promesa que se resuelve con el objeto `Response`.

9. **¿Diferencia entre `async/await` y `.then()/.catch()`?**
   Ambos se basan en promesas. `async/await` permite escribir el flujo de forma secuencial y usar `try/catch`, lo que mejora la legibilidad. La app usa `async/await` en el manejador `submit` y en `enviarPublicacion()`.

10. **¿Qué función cumple `async` y qué tipo de valor devuelve la función?**
    Declara que la función es asíncrona y hace que devuelva automáticamente una `Promise`. La función `enviarPublicacion` es `async`.

11. **¿Qué función cumple `await` al esperar la respuesta de `fetch()`?**
    Pausa la ejecución de la función asíncrona hasta que la promesa se resuelva, sin bloquear el hilo principal del navegador. Se usa en `const respuesta = await fetch(...)` y `await respuesta.json()`.

12. **¿Qué ocurriría si se eliminara `await` de `response.json()`?**
    Se asignaría la promesa sin resolver a la variable; al mostrarla en el DOM aparecería `[object Promise]` o se intentaría acceder a propiedades inexistentes. Por eso se espera con `await`.

---

## C. Fetch API y peticiones HTTP

13. **¿Qué es la Fetch API y para qué se utiliza en la miniaplicación?**
    Es la API estándar del navegador para realizar peticiones HTTP. En la app se usa para enviar una publicación nueva al endpoint de JSONPlaceholder.

14. **¿Diferencia entre GET y POST? ¿Por qué se usa POST?**
    GET solicita datos; POST envía datos para crear un recurso. Se usa POST porque la operación es "publicar/crear", enviando título y contenido en el cuerpo.

15. **¿Qué función cumple el encabezado `Content-Type: application/json`?**
    Indica al servidor que el cuerpo de la petición está en formato JSON, para que lo interprete correctamente.

16. **¿Por qué se usa `JSON.stringify()`? ¿Qué recibe y qué devuelve?**
    Convierte un objeto JavaScript en una cadena JSON. Recibe el objeto de publicación y devuelve una cadena que se asigna a `body` de `fetch`.

17. **¿Qué información contiene el objeto de configuración (segundo argumento de `fetch()`)?**
    En la app: `method: "POST"`, `headers: { "Content-Type": "application/json" }` y `body: JSON.stringify(publicacion)`.

18. **¿Qué función cumple `response.json()`? ¿Diferencia con `JSON.stringify()`?**
    `response.json()` parsea el cuerpo JSON de la respuesta HTTP a un objeto JavaScript. `JSON.stringify()` hace lo inverso: objeto → cadena. Son operaciones complementarias.

---

## D. Manejo de respuestas y errores

19. **¿Qué representa `response.ok` y por qué debe comprobarse?**
    Es un booleano que indica si el estado HTTP está entre 200 y 299. `fetch` no rechaza la promesa ante errores HTTP, así que sin esta comprobación se podría tratar un 404 o 500 como éxito. En `enviarPublicacion()` se hace `if (!respuesta.ok) throw new Error(...)`.

20. **¿Diferencia entre un error HTTP (404) y un error de conexión?**
    Un error HTTP es una respuesta del servidor con un código de estado no satisfactorio. Un error de conexión es un fallo de red/DNS donde no llega respuesta (rechazo de la promesa con `TypeError`).

21. **¿Qué sucede si el servidor devuelve una respuesta no satisfactoria y no se comprueba `response.ok`?**
    El código continuaría como si fuera exitosa, podría intentar interpretar una página de error como JSON y mostrar resultados incorrectos o fallar al parsear.

22. **¿Para qué se usa `try/catch` con `async/await`? ¿Qué errores gestiona?**
    Captura las promesas rechazadas y cualquier error lanzado. En la app gestiona errores de red, respuestas HTTP no satisfactorias (lanzadas manualmente) y fallos al interpretar JSON.

23. **¿Qué ocurre si la respuesta no contiene JSON válido y se ejecuta `response.json()`?**
    Se lanza un `SyntaxError` (error de parseo), que el `catch` captura y traduce a un mensaje comprensible.

24. **¿Cómo mostrarías un mensaje comprensible cuando falle la conexión?**
    En el `catch`, detectar `error instanceof TypeError` y mostrar "No fue posible conectar con el servidor...". Eso implementa `describirError()`.

---

## E. Validación, interfaz y comportamiento

25. **¿Por qué es necesario validar el título y el contenido antes de enviar? ¿Cómo impedir vacíos o solo espacios?**
    Para no enviar datos inválidos ni generar peticiones inútiles. Con `trim()`: si `titulo.trim() === ""` el campo es inválido. Se implementa en `validarCampos()`.

26. **¿Por qué conviene deshabilitar el botón mientras se procesa la petición? ¿Cuándo habilitarlo?**
    Evita envíos repetidos y condiciones de carrera. Se deshabilita al iniciar (`establecerCarga(true)`) y se habilita en el bloque `finally`, tanto en éxito como en error.

27. **¿Cómo implementarías un indicador de carga y qué ocurre si falla la operación?**
    Se muestra un mensaje "Procesando..." y un spinner mientras `estaCargando` es true. Si falla, `finally` oculta el indicador y `mostrarEstado` presenta el error, restableciendo el botón.

28. **¿Cómo evitar que el navegador recargue la página al enviar el formulario?**
    Llamando a `evento.preventDefault()` al inicio del manejador `submit`, lo que cancela el comportamiento por defecto del formulario.

---

## F. Análisis, pruebas y mejoras

29. **¿Cómo comprobarías, con DevTools, que la petición POST se ejecutó correctamente?**
    En la pestaña **Network**: verificar Request URL (`.../posts`), Method (POST), Request Headers (`Content-Type: application/json`), Request Payload (objeto JSON) y Status Code (201 Created), además del Response.

30. **Si el servidor devuelve un ID pero al volver a consultar no aparece el mensaje, ¿cómo se explica en JSONPlaceholder? ¿Qué cambiarías para persistencia real?**
    JSONPlaceholder es una API de prueba que simula la creación y devuelve un ID, pero no almacena datos de forma permanente. Para persistencia real se requeriría un backend propio con una base de datos y endpoints CRUD autenticados.
