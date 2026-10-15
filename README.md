# Portal Docente UNT

Aplicativo web (HTML, CSS y JavaScript puro, sin dependencias) para docentes de la Universidad Nacional de Trujillo:

- **Mis tesis**: tesis asignadas con barra semáforo según los días que faltan para la sustentación.
- **Avisos**: recordatorios de sustentaciones próximas (30 días o menos).
- **Solicitar capacitación** y **Mis solicitudes**: formulario de solicitud de cursos, diplomados y maestrías, con apoyo económico.
- Fondo blanco por defecto y botón para activar el modo oscuro.

## Estructura

```
index.html      Estructura de la página
styles.css      Estilos y temas (claro/oscuro)
app.js          Lógica, datos de ejemplo y pantallas
assets/logo.jpg Logo oficial de la UNT
```

## Uso local

Abra `index.html` en el navegador. No requiere instalación.

## Publicar en GitHub Pages

1. Cree un repositorio y suba estos archivos a la rama `main`.
2. En **Settings → Pages**, elija **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. La página quedará en `https://<usuario>.github.io/<repositorio>/`.

## Pendiente para producción

- Los datos de tesis (`TESIS` en `app.js`) son de ejemplo: conéctelos con el registro real.
- Las solicitudes se guardan solo en el navegador (`localStorage`). Para que lleguen a la Escuela, la Facultad o Rectorado se necesita un backend con base de datos y acceso para docentes.
- Plazos del semáforo: función `nivel()` en `app.js` (rojo ≤ 7 días, amarillo ≤ 30 días).
