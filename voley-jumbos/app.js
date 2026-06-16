/* ============================================================
   app.js · Construye la UI del playbook y maneja interacción
   ============================================================ */
(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const content = document.getElementById("content");

  /* ---------- iconos ---------- */
  const replayIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
    stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>`;

  /* ---------- NAV ---------- */
  function buildNav() {
    let html = `<div class="nav-group-label">Playbook</div>`;
    SECTIONS.forEach((s) => {
      html += `<a href="#${s.id}" data-id="${s.id}"><span class="ic">${s.icon}</span>${s.title}</a>`;
    });
    nav.innerHTML = html;
  }

  /* ---------- HERO ---------- */
  function hero() {
    return `<section class="block hero" id="inicio" data-sec="inicio">
      <div class="eyebrow">Equipo Jumbos · Liga 2026-2027</div>
      <h1>SISTEMAS<br><span class="stroke">DE JUEGO</span></h1>
      <p class="sub">Playbook táctico interactivo: saque, recepción, ataque, colocación, bloqueo y defensa.
      Cada jugada con cancha vectorial animada para entender el movimiento, no solo la posición.</p>
      <span class="season">Temporada 2026 — 2027</span>
    </section>`;
  }

  /* ---------- FUNDAMENTOS ---------- */
  function fundamentos(s) {
    const posPlay = {
      players: [
        { pos: "us4", n: "4", team: "us" }, { pos: "us3", n: "3", team: "us" }, { pos: "us2", n: "2", team: "us" },
        { pos: "us5", n: "5", team: "us" }, { pos: "us6", n: "6", team: "us" }, { pos: "us1", n: "1", team: "us" },
        { pos: "th4", n: "4", team: "them" }, { pos: "th3", n: "3", team: "them" }, { pos: "th2", n: "2", team: "them" },
        { pos: "th5", n: "5", team: "them" }, { pos: "th6", n: "6", team: "them" }, { pos: "th1", n: "1", team: "them" },
      ],
      captions: [
        { text: "NOSOTROS (Jumbos)", at: [150, 472], color: "#16235f", size: 11 },
        { text: "RIVAL", at: [150, 10], color: "#a81a2c", size: 11 },
      ],
    };

    const tempos = [
      ["1", "Primer tiempo de frente", "q"],
      ["2", "Primer tiempo de espalda (a la salida)", "q"],
      ["7", "Corta picada al medio (“chutada”)", ""],
      ["3", "Corta al medio", ""],
      ["4", "Corta de espalda al medio", ""],
      ["9", "Corta a la entrada", ""],
      ["5", "Alta a la entrada", ""],
      ["6", "Alta a la salida", ""],
    ];

    return `<section class="block" id="${s.id}" data-sec="${s.id}">
      ${sectionHead(s)}
      <div class="legend-grid">
        <div class="panel">
          <h3>Posiciones en cancha</h3>
          <div class="court-wrap" style="background:transparent;padding:0">${Court.render(posPlay)}</div>
          <p style="font-size:13px;color:var(--muted);margin-top:10px">
            Red arriba. Zonas de frente <b>4-3-2</b> y de zaga <b>5-6-1</b>. La rotación va en sentido horario (de 2→1).
          </p>
        </div>

        <div class="panel">
          <h3>Símbolos del playbook</h3>
          <div class="legend-row"><span class="dot-leg" style="background:#16235f"></span><b>Jumbos</b><span class="desc">— nuestros jugadores</span></div>
          <div class="legend-row"><span class="dot-leg" style="background:#e23b4e"></span><b>Rival</b><span class="desc">— oponentes / bloqueo</span></div>
          <div class="legend-row"><span class="dot-leg" style="background:#5bb8e8"></span><b>Colocador / Líbero</b><span class="desc">— rol especial</span></div>
          <div class="legend-row"><span class="dot-leg" style="background:#f6c945;border:1px solid #c99a18"></span><b>Balón</b><span class="desc">— se anima en la jugada</span></div>
          <div class="legend-row"><span class="line-leg" style="border-color:#16235f;border-top-style:dashed"></span><b>Movimiento</b><span class="desc">— desplazamiento del jugador</span></div>
          <div class="legend-row"><span class="line-leg" style="border-color:#e8732b"></span><b>Remate</b><span class="desc">— trayectoria de ataque</span></div>
          <div class="legend-row"><span class="line-leg" style="border-color:#2b86bf"></span><b>Pase / colocación</b><span class="desc">— recorrido del balón</span></div>
          <div class="legend-row"><span class="dot-leg" style="background:rgba(39,163,90,.35);border-radius:4px"></span><b>Zona</b><span class="desc">— área de cobertura / defensa</span></div>
        </div>

        <div class="panel">
          <h3>Tempos de ataque</h3>
          <table class="tempo-table"><tbody>
            ${tempos.map((t) => `<tr><td><span class="tempo-num ${t[2] === "q" ? "q" : ""}">${t[0]}</span></td><td>${t[1]}</td></tr>`).join("")}
          </tbody></table>
          <p style="font-size:12.5px;color:var(--muted);margin-top:10px">
            <b>Quick</b> = primer tiempo (frente o de espalda). Los números fijan el punto y la velocidad de la colocación.
          </p>
        </div>
      </div>
    </section>`;
  }

  /* ---------- cabecera de sección ---------- */
  function sectionHead(s) {
    return `<div class="section-head">
      <div class="num">${s.num}</div>
      <div><h2>${s.title}</h2><div class="lead">${s.lead || ""}</div></div>
    </div>`;
  }

  /* ---------- card de jugada ---------- */
  function playCard(pl) {
    const tagClass = pl.tag || "us";
    const notes = (pl.notes || [])
      .map((n) => `<li>${n}</li>`).join("");
    return `<article class="card">
      <div class="card-head">
        <h3>${pl.title}</h3>
        <span class="tag ${tagClass}">${pl.tagText || ""}</span>
      </div>
      <div class="court-wrap">${Court.render(pl)}</div>
      <div class="card-body">
        <ul>${notes}</ul>
        <button class="replay" type="button">${replayIcon} Repetir</button>
      </div>
    </article>`;
  }

  /* ---------- sección con jugadas ---------- */
  function playSection(s) {
    return `<section class="block" id="${s.id}" data-sec="${s.id}">
      ${sectionHead(s)}
      <div class="grid">${s.plays.map(playCard).join("")}</div>
    </section>`;
  }

  /* ---------- render principal ---------- */
  function build() {
    buildNav();
    let html = "";
    SECTIONS.forEach((s) => {
      if (s.hero) html += hero();
      else if (s.type === "fundamentos") html += fundamentos(s);
      else html += playSection(s);
    });
    content.innerHTML = html;
    addPresentBar();
    wireReplays();
    wireAnimObserver();
    wireScrollSpy();
  }

  /* ---------- animaciones ---------- */
  function playCourt(svg) {
    svg.classList.remove("is-playing");
    // forzar reflow para reiniciar la animación
    void svg.getBoundingClientRect();
    svg.classList.add("is-playing");
  }

  function wireReplays() {
    content.querySelectorAll(".replay").forEach((btn) => {
      btn.addEventListener("click", () => {
        const svg = btn.closest(".card").querySelector("[data-court]");
        if (svg) playCourt(svg);
      });
    });
  }

  function wireAnimObserver() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          playCourt(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.45 });
    content.querySelectorAll("[data-court]").forEach((svg) => io.observe(svg));
  }

  /* ---------- scrollspy ---------- */
  function wireScrollSpy() {
    const links = [...nav.querySelectorAll("a")];
    const map = {};
    links.forEach((a) => (map[a.dataset.id] = a));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((a) => a.classList.remove("active"));
          const a = map[en.target.dataset.sec];
          if (a) a.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    content.querySelectorAll("[data-sec]").forEach((sec) => io.observe(sec));
  }

  /* ---------- nav mobile ---------- */
  function wireMobileNav() {
    const toggle = document.getElementById("navToggle");
    const scrim = document.getElementById("scrim");
    const close = () => document.body.classList.remove("nav-open");
    toggle.addEventListener("click", () => document.body.classList.toggle("nav-open"));
    scrim.addEventListener("click", close);
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
  }

  /* ---------- modo presentación ---------- */
  let presentIdx = 0;
  function addPresentBar() {
    const bar = document.createElement("div");
    bar.className = "present-bar";
    bar.innerHTML = `
      <button id="pPrev" title="Anterior">◀</button>
      <span class="pcount" id="pCount"></span>
      <button id="pNext" title="Siguiente">▶</button>
      <button class="pexit" id="pExit">✕ Salir</button>`;
    document.body.appendChild(bar);
    document.getElementById("pPrev").onclick = () => goPresent(-1);
    document.getElementById("pNext").onclick = () => goPresent(1);
    document.getElementById("pExit").onclick = exitPresent;
  }
  const presentSections = () => [...content.querySelectorAll("section.block:not(.hero)")];

  function enterPresent() {
    document.body.classList.add("present");
    presentIdx = 0;
    showPresent();
  }
  function exitPresent() {
    document.body.classList.remove("present");
    presentSections().forEach((s) => s.classList.remove("show"));
  }
  function goPresent(d) {
    const secs = presentSections();
    presentIdx = Math.max(0, Math.min(secs.length - 1, presentIdx + d));
    showPresent();
  }
  function showPresent() {
    const secs = presentSections();
    secs.forEach((s, i) => s.classList.toggle("show", i === presentIdx));
    document.getElementById("pCount").textContent = `${presentIdx + 1} / ${secs.length}`;
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    const cur = secs[presentIdx];
    if (cur) cur.querySelectorAll("[data-court]").forEach(playCourt);
  }

  function wirePresent() {
    document.getElementById("presentBtn").addEventListener("click", enterPresent);
    document.addEventListener("keydown", (e) => {
      if (!document.body.classList.contains("present")) return;
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); goPresent(1); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); goPresent(-1); }
      else if (e.key === "Escape") exitPresent();
    });
  }

  /* ---------- init ---------- */
  build();
  wireMobileNav();
  wirePresent();
})();
