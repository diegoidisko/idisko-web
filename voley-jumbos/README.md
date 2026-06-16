# Jumbos · Sistemas de Juego 2026-2027

Playbook táctico interactivo de vóley, versión web modernizada de la presentación
original *"JUMBOS SYSTEMS 2026-2027"*.

## Qué es

Una página web autónoma (sin dependencias ni build) que reorganiza la presentación
en un **playbook navegable** por fases de juego, con **canchas vectoriales (SVG)
animadas** en lugar de las imágenes/GIFs originales.

## Cómo usarlo

- Abrir `index.html` en cualquier navegador moderno (también funciona desde el celular).
- **Menú lateral**: salta a cada fase (Saque, Recepción, Ataque, Colocación, Bloqueo, Defensa).
- **Botón "Repetir"** en cada jugada: vuelve a reproducir la animación del balón y los movimientos.
- **Modo presentación**: pantalla completa, una sección por pantalla. Avanzar con las flechas
  del teclado (← →), barra espaciadora o los botones inferiores. Salir con `Esc`.

## Estructura

| Archivo | Rol |
|---|---|
| `index.html` | Estructura y contenedores |
| `styles.css` | Diseño y estilos (colores Jumbos) |
| `court.js` | Motor que dibuja las canchas en SVG y las anima |
| `data.js` | Todo el contenido táctico (las jugadas) en español |
| `app.js` | Navegación, animaciones y modo presentación |

## Editar las jugadas

El contenido vive en `data.js`. Cada jugada se define con jugadores (posición + número),
flechas (movimiento, remate o pase), balón animado, zonas de cobertura y notas.
Las posiciones usan anclas nombradas (`us4`, `th2`, etc.) según las zonas de vóley
**4-3-2 / 5-6-1**, así que no hace falta calcular coordenadas a mano.
