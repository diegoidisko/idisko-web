/* ============================================================
   court.js · Renderizador de canchas de vóley en SVG
   Vista cenital (top-down). Mitad inferior = NOSOTROS (Jumbos),
   mitad superior = RIVAL. Red en el centro.
   ============================================================ */
(function (global) {
  "use strict";

  // ---- Geometría de la cancha (viewBox 300 x 480) ----
  const L = 24, R = 276, TOP = 14, BOT = 466, NET = 240;
  const COL = { l: 72, c: 150, r: 228 };

  // filas (y) por mitad
  const US = { net: 262, front: 280, atk: 316, mid: 352, back: 404, base: 452 };
  const TH = { net: 218, front: 200, atk: 164, mid: 128, back: 76, base: 28 };

  // Anchors nombrados -> [x,y]
  // Posiciones de vóley:  4 3 2 (red) / 5 6 1 (fondo)
  const ANCHORS = {
    us4: [COL.l, US.front], us3: [COL.c, US.front], us2: [COL.r, US.front],
    us5: [COL.l, US.back],  us6: [COL.c, US.back],  us1: [COL.r, US.back],
    // rival (espejo)
    th4: [COL.r, TH.front], th3: [COL.c, TH.front], th2: [COL.l, TH.front],
    th5: [COL.r, TH.back],  th6: [COL.c, TH.back],  th1: [COL.l, TH.back],
  };

  function resolve(p) {
    if (Array.isArray(p)) return p;
    if (ANCHORS[p]) return ANCHORS[p];
    return [150, 240];
  }

  // ---- helpers SVG ----
  const e = (s) => String(s);

  function courtBackground(uid) {
    return `
      <rect x="0" y="0" width="300" height="480" rx="14" fill="#d98b54"/>
      <rect x="${L}" y="${TOP}" width="${R - L}" height="${BOT - TOP}" fill="#e9a06a"/>
      <!-- líneas perimetrales -->
      <rect x="${L}" y="${TOP}" width="${R - L}" height="${BOT - TOP}" fill="none" stroke="#fff" stroke-width="2.5"/>
      <!-- línea de 3m -->
      <line x1="${L}" y1="${US.atk}" x2="${R}" y2="${US.atk}" stroke="#fff" stroke-width="1.6" stroke-dasharray="0"/>
      <line x1="${L}" y1="${TH.atk}" x2="${R}" y2="${TH.atk}" stroke="#fff" stroke-width="1.6"/>
      <!-- red -->
      <rect x="${L - 6}" y="${NET - 4}" width="${R - L + 12}" height="8" fill="#16235f"/>
      <line x1="${L - 6}" y1="${NET}" x2="${R + 6}" y2="${NET}" stroke="#aedcf4" stroke-width="1" stroke-dasharray="3 3"/>
      <!-- postes -->
      <circle cx="${L - 6}" cy="${NET}" r="3.5" fill="#16235f"/>
      <circle cx="${R + 6}" cy="${NET}" r="3.5" fill="#16235f"/>
    `;
  }

  function arrowDefs(uid) {
    return `
      <defs>
        <marker id="${uid}-mv" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#16235f"/>
        </marker>
        <marker id="${uid}-atk" markerWidth="8" markerHeight="8" refX="6" refY="3.2" orient="auto">
          <path d="M0,0 L7,3.2 L0,6.4 Z" fill="#e8732b"/>
        </marker>
        <marker id="${uid}-ball" markerWidth="8" markerHeight="8" refX="6" refY="3.2" orient="auto">
          <path d="M0,0 L7,3.2 L0,6.4 Z" fill="#2b86bf"/>
        </marker>
      </defs>`;
  }

  // flecha recta o curva
  function arrow(uid, a, b, kind, curve) {
    const [x1, y1] = resolve(a), [x2, y2] = resolve(b);
    let d;
    if (curve) {
      const mx = (x1 + x2) / 2 + (curve.dx || 0);
      const my = (y1 + y2) / 2 + (curve.dy || 0);
      d = `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
    } else {
      d = `M${x1},${y1} L${x2},${y2}`;
    }
    let stroke = "#16235f", w = 2.2, marker = `${uid}-mv`, dash = "5 5";
    if (kind === "attack") { stroke = "#e8732b"; w = 3.4; marker = `${uid}-atk`; dash = "0"; }
    else if (kind === "ball") { stroke = "#2b86bf"; w = 2.4; marker = `${uid}-ball`; dash = "0"; }
    else if (kind === "move") { stroke = "#16235f"; w = 2.2; marker = `${uid}-mv`; dash = "5 5"; }
    return `<path class="path-draw" style="--len:760" d="${d}" fill="none" stroke="${stroke}"
              stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="round"
              marker-end="url(#${marker})"/>`;
  }

  // zona sombreada (triángulo/área de defensa)
  function zone(points, color) {
    const pts = points.map(resolve).map((p) => p.join(",")).join(" ");
    return `<polygon points="${pts}" fill="${color || "rgba(39,163,90,.18)"}"
              stroke="rgba(39,163,90,.45)" stroke-width="1.2" stroke-dasharray="4 3"/>`;
  }

  // jugador
  function player(pl) {
    const [x, y] = resolve(pl.pos);
    let fill = "#16235f", stroke = "#0e1845";
    if (pl.team === "them") { fill = "#e23b4e"; stroke = "#a81a2c"; }
    else if (pl.team === "set") { fill = "#5bb8e8"; stroke = "#2b86bf"; }
    const r = pl.r || 13;
    const txt = pl.n != null
      ? `<text x="${x}" y="${y + 4.5}" text-anchor="middle" class="player-num"
             ${pl.team === "set" ? 'fill="#16235f"' : ""}>${e(pl.n)}</text>`
      : "";
    const lbl = pl.label
      ? `<text x="${x}" y="${y - r - 4}" text-anchor="middle" class="player-lbl">${e(pl.label)}</text>`
      : "";
    return `<g><circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}"
              stroke-width="2"/>${txt}${lbl}</g>`;
  }

  // balón estático
  function ballStatic(pos) {
    const [x, y] = resolve(pos);
    return `<circle cx="${x}" cy="${y}" r="7" fill="#f6c945" stroke="#c99a18" stroke-width="1.5"/>`;
  }

  // balón animado a lo largo de un path
  function ballAnim(points) {
    const pts = points.map(resolve);
    let d = `M${pts[0][0]},${pts[0][1]}`;
    if (pts.length === 2) d += ` L${pts[1][0]},${pts[1][1]}`;
    else {
      // curva suave por puntos
      for (let i = 1; i < pts.length; i++) {
        const [px, py] = pts[i - 1], [cx, cy] = pts[i];
        const mx = (px + cx) / 2, my = (py + cy) / 2;
        d += ` Q${px},${py} ${mx},${my}`;
      }
      d += ` L${pts[pts.length - 1][0]},${pts[pts.length - 1][1]}`;
    }
    return `<circle class="ball-anim" r="7" fill="#f6c945" stroke="#c99a18" stroke-width="1.5"
              cx="0" cy="0" style="offset-path:path('${d}')"/>`;
  }

  // etiqueta de texto en cancha
  function caption(c) {
    const [x, y] = c.at;
    return `<text x="${x}" y="${y}" text-anchor="${c.anchor || "middle"}" class="court-cap"
              style="font-size:${c.size || 11}px;fill:${c.color || "#16235f"}">${e(c.text)}</text>`;
  }

  /* ---- API principal ---- */
  let counter = 0;
  function render(play) {
    const uid = "c" + (counter++);
    let svg = `<svg class="court-svg" viewBox="0 0 300 480" xmlns="http://www.w3.org/2000/svg" data-court>`;
    svg += arrowDefs(uid);
    svg += courtBackground(uid);
    (play.zones || []).forEach((z) => (svg += zone(z.points, z.color)));
    (play.arrows || []).forEach((a) => (svg += arrow(uid, a.from, a.to, a.kind, a.curve)));
    (play.players || []).forEach((p) => (svg += player(p)));
    (play.staticBalls || []).forEach((b) => (svg += ballStatic(b)));
    (play.captions || []).forEach((c) => (svg += caption(c)));
    if (play.ball) svg += ballAnim(play.ball);
    svg += `</svg>`;
    return svg;
  }

  global.Court = { render, ANCHORS };
})(window);
