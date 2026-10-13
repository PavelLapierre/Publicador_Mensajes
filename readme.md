# Publicador de mensajes

Miniaplicación web que valida los datos de una publicación, la envía a la API REST
JSONPlaceholder mediante una petición HTTP POST y muestra la respuesta asíncrona en el DOM.

## Estructura del proyecto

```
Publicador_de_mensajes/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── tests/
│   ├── plan-pruebas.md       # Checklist de pruebas funcionales y técnicas
│   ├── prueba-errores.html   # Página auxiliar para simular errores HTTP
│   └── prueba-errores.js     # Lógica de las pruebas de error
└── README.md
```

## Cómo ejecutar

1. Abre `index.html` directamente en un navegador moderno (Chrome, Edge, Firefox).
2. No requiere servidores ni dependencias externas.
3. Para verificar la petición, abre las Herramientas de desarrollo (F12) y revisa la pestaña **Network** y la **Console**.
4. Para simular errores HTTP, abre `tests/prueba-errores.html`.

## Requisitos técnicos cubiertos

- Separación de HTML, CSS y JavaScript en archivos independientes.
- `addEventListener("submit", ...)` para gestionar el envío.
- `event.preventDefault()` para evitar la recarga de la página.
- `fetch()` con método `POST` y encabezado `Content-Type: application/json`.
- Serialización con `JSON.stringify()`.
- Procesamiento asíncrono con `async/await`.
- Verificación de `response.ok` antes de tratar la respuesta como satisfactoria.
- `response.json()` para interpretar el cuerpo JSON.
- Validación de campos con `trim()` antes del envío.
- Actualización del DOM con `textContent` (mecanismo seguro).
- Control de indicador de carga, deshabilitación del botón y restablecimiento del estado.
- Gestión de errores de conexión (TypeError), HTTP (response.ok) y procesamiento JSON.

## Sobre la persistencia

JSONPlaceholder es una API de prueba. Devuelve una respuesta simulada al crear una
publicación (incluyendo un `id` generado), pero **no** garantiza que los datos se
almacenen permanentemente. Recibir una respuesta satisfactoria no equivale a tener
almacenamiento persistente real.
