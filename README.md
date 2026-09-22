# idisko-web

Landing de iDisko — https://www.idisko.com (GitHub Pages sirve la rama `main`).

## Cómo editar la landing

**El fuente editable es `index.source.html`** (React/JSX en bloques `text/babel`,
textos en `window.STRINGS` en 5 idiomas).

`index.html` y `es/ fr/ it/ pt/` son **archivos generados** — no los edites a mano.
Tras cambiar el fuente, regenera todo con:

```bash
npm install   # una vez
npm run build # precompila el JSX, prerenderiza los 5 idiomas y regenera sitemap.xml
```

El build necesita Chromium (Playwright lo descarga; si ya tienes uno, exporta
`CHROME_PATH=/ruta/a/chromium`).

## Qué genera el build

- `index.html` — inglés, canónico `https://www.idisko.com/` (+ `x-default`)
- `es/ fr/ it/ pt/index.html` — cada idioma en su URL, con título/meta/OG
  localizados, `canonical` y cluster `hreflang`
- `sitemap.xml` — con alternates por idioma

Las páginas salen **pre-renderizadas** (el contenido es visible sin JavaScript,
para buscadores y crawlers de IA) y sin Babel en producción (el JSX se compila
en el build). React, ReactDOM y Lucide se sirven desde `assets/vendor/`.
