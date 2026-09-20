# Invitación digital — Diana & Pedro

Sitio de una sola página para una invitación de boda. Sin frameworks, sin build, sin dependencias de npm: tres archivos y una carpeta de imágenes. Se sube por FTP o a cualquier hosting estático (Netlify, Vercel, GitHub Pages, cPanel).

---

## Estructura

```
/
├── index.html        Contenido y configuración (fechas, lugar, textos)
├── styles.css        Bootstrap recortado + diseño + fuentes de íconos embebidas
├── script.js         Menú, scroll, contador, calendario, mapas, video de fondo
└── images/
    ├── gallery-1.webp        portada (hero)
    ├── gallery-2.webp        foto de la tarjeta de fecha + og:image
    ├── gallery-8.webp        foto de la novia
    ├── groom-men-1.webp      foto del novio
    ├── gallery-6.webp        badge itinerario (baile)
    ├── gallery-7.webp        badge itinerario (coctel)
    ├── place-1.webp          badge itinerario (ceremonia)
    ├── place-2.webp          badge itinerario (cena)
    ├── top-bg.webp           borde decorativo superior
    └── bottom-bg.webp        borde decorativo inferior
```

Las 10 imágenes son obligatorias: si falta alguna, la sección queda con fondo blanco sin error visible en consola.

**Recomendaciones de imagen**

| Uso | Tamaño sugerido | Notas |
|---|---|---|
| `gallery-1` (portada) | 1920×1280 | se recorta desde arriba (`background-position: top center`) |
| `gallery-2` | 1000×1400 | vertical, ocupa media pantalla en escritorio |
| Retratos novios | 600×600 | se recortan en círculo de 250 px |
| Badges del itinerario | 300×300 | se recortan en círculo de 100 px |
| `top-bg` / `bottom-bg` | 1920×300 | textura o acuarela con transparencia |

Convertir todo a WebP y mantener el hero por debajo de ~300 KB.

---

## Qué se edita y dónde

Toda la configuración está en `index.html`. **`script.js` no se toca.**

### 1. Fecha y hora del evento

```html
<div id="timer" data-fecha="2026-11-01T16:00:00-06:00" data-fin="2026-11-02T00:00:00-06:00">
```

- `data-fecha`: inicio del evento. Alimenta el contador regresivo y el botón de calendario.
- `data-fin`: fin del evento (solo calendario). Si se omite, asume 8 horas.
- `-06:00` es la zona horaria de Costa Rica. No cambiar salvo otro país.

También hay que actualizar a mano la fecha visible en la tarjeta:

```html
<p class="time mb-4"><span>01 | Nov | 2026</span></p>
```

### 2. Lugar

```html
<section id="ubicacion-section" data-lat="" data-lng="">
  <h3 id="lugar-nombre">[Nombre del lugar]</h3>
  <p id="lugar-direccion">[Dirección, distrito, cantón, provincia]</p>
```

El nombre y la dirección se reutilizan en tres lugares: el botón de Google Maps, el de Waze y el evento del calendario.

`data-lat` / `data-lng` son opcionales pero recomendadas: sin ellas los botones hacen una **búsqueda por texto**, que en zonas rurales de Costa Rica suele fallar. Para obtenerlas: clic derecho sobre el punto exacto en Google Maps → las coordenadas aparecen de primero en el menú.

```html
<section id="ubicacion-section" data-lat="9.8567" data-lng="-83.9182">
```

### 3. Enlace de confirmación (RSVP)

```html
<span class="subheading mb-5"><a href="" target="_blank" rel="noopener">Reserva tu campo</a></span>
```

Queda vacío por defecto y, si no se llena, **el enlace recarga la misma página**. Pegar ahí la URL del Google Form, Tally o WhatsApp (`https://wa.me/506XXXXXXXX?text=...`).

### 4. Video de fondo de la portada

```html
<section id="home" data-video="Mjjw19B7rMk">
```

El ID del video de YouTube. Solo carga en pantallas ≥992 px con mouse; en celular se queda la foto (decisión de rendimiento y de datos móviles). Para quitar el video, borrar el atributo `data-video` completo.

### 5. Itinerario, textos de los novios y preguntas frecuentes

Son HTML plano. Para agregar un punto al itinerario, duplicar un `<li>` y alternar la clase `timeline-inverted` para que quede del otro lado de la línea. Para agregar una pregunta, duplicar un bloque `<details>`.

Los textos entre `[corchetes]` en la sección de preguntas son plantillas: hay que escoger una opción y borrar el resto.

### 6. Color y tipografía

El coral `#f67e7d` está repetido a lo largo de `styles.css`. Para cambiarlo, buscar y reemplazar todas las ocurrencias. Las fuentes (Great Vibes, Libre Caslon Text, Poppins) se cargan desde Google Fonts en el `<head>`.

---

## Checklist antes de publicar

- [ ] `data-fecha` y `data-fin` con la fecha real y zona horaria correcta
- [ ] Fecha visible en la tarjeta actualizada
- [ ] `id="lugar-nombre"` y `id="lugar-direccion"` sin corchetes
- [ ] `data-lat` / `data-lng` con coordenadas reales
- [ ] `href` del RSVP apuntando al formulario
- [ ] Textos de preguntas frecuentes resueltos (sin corchetes)
- [ ] Las 10 imágenes presentes en `images/`
- [ ] `og:image` convertido a **URL absoluta** (ver abajo)
- [ ] Probado en celular real, no solo en el inspector
- [ ] Probados los botones de Maps, Waze, Google Calendar y `.ics`

### og:image

```html
<meta property="og:image" content="images/gallery-2.webp" />
```

WhatsApp, Instagram y Facebook **ignoran las rutas relativas**. Como la invitación se comparte casi siempre por WhatsApp, hay que dejarla absoluta:

```html
<meta property="og:image" content="https://dominio.com/images/gallery-2.webp" />
```

Además, WhatsApp no genera miniatura con WebP de forma confiable. Conviene subir una copia JPG de 1200×630 solo para el `og:image`.

---

## Publicación

Es estático: se copian los cuatro elementos (`index.html`, `styles.css`, `script.js`, `images/`) a la raíz del hosting. No requiere PHP, base de datos ni proceso de build.

Para probar en local, abrir `index.html` directamente funciona, pero conviene levantar un servidor para que el `.ics` y las fuentes se comporten igual que en producción:

```bash
python3 -m http.server 8000
```

---

## Notas técnicas

- **Bootstrap recortado**: `styles.css` incluye solo las clases de Bootstrap 4.3.1 que la página usa. Si se agregan clases nuevas de Bootstrap (`col-lg-4`, `mt-5`, etc.), hay que declararlas a mano; no están en el archivo.
- **Fuentes de íconos embebidas**: los tres íconos (menú y dos rosas) van en base64 al final de `styles.css`. No borrar esos bloques `@font-face`.
- **Sin jQuery**: el original de la plantilla FTCO dependía de jQuery, Owl Carousel y animate.css. Todo eso se reemplazó por `IntersectionObserver` y `requestAnimationFrame`.
- **Contador vencido**: después de la fecha del evento el contador se queda en ceros. Es intencional (`Math.max(0, ...)`), pero si el sitio queda en línea como recuerdo, conviene reemplazar esa sección.
- **Accesibilidad**: las fotos son `background-image`, así que no tienen texto alternativo. Aceptable porque son decorativas, pero significa que un lector de pantalla no describe nada visual.
- **`prefers-reduced-motion`**: respetado en las animaciones de entrada.

---

## Reutilizar la plantilla para otra pareja

1. Duplicar la carpeta.
2. Reemplazar las 10 imágenes conservando los nombres de archivo.
3. Buscar y reemplazar `Diana` y `Pedro` en `index.html` y `script.js` (el nombre del archivo `.ics` y el `UID` del evento están en `script.js`).
4. Cambiar `D & P` en `navbar-brand` y el `<title>`.
5. Recorrer el checklist de arriba.
