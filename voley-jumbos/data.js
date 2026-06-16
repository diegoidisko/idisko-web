/* ============================================================
   data.js · Contenido del playbook Jumbos (en español)
   Reconstruido a partir de "JUMBOS SYSTEMS 2026-2027".
   Coordenadas: vista cenital, NOSOTROS abajo, RIVAL arriba.
   ============================================================ */

/* coords auxiliares (viewBox 300x480) */
const P = {
  // saque (nuestra línea de fondo)
  sR: [228, 452], sC: [150, 452], sL: [72, 452],
  // zonas objetivo en campo rival
  z1: [76, 78], z5: [224, 78], z6: [150, 62], z2: [224, 150], z4: [76, 150],
  // bloqueadores rivales en la red (para nuestro ataque)
  ob_l: [82, 224], ob_lc: [118, 224], ob_c: [150, 224], ob_rc: [182, 224], ob_r: [218, 224],
  // nuestros bloqueadores en la red (cuando defendemos)
  nb_l: [82, 256], nb_lc: [118, 256], nb_c: [150, 256], nb_rc: [182, 256], nb_r: [218, 256],
  // objetivos de nuestro ataque en piso rival
  tgtLineL: [70, 96], tgtCrossR: [210, 120], tgtSeam: [140, 110], tgtTip: [120, 200],
  // atacante rival
  thHit: [228, 200],
  // piso nuestro para defensa
  defTipUs: [150, 320],
};

const SECTIONS = [
  /* =================================================== */
  {
    id: "inicio", num: "", icon: "🏐", title: "Inicio", hero: true,
  },

  /* =================================================== FUNDAMENTOS */
  {
    id: "fundamentos", num: "1", icon: "📐", title: "Fundamentos",
    lead: "Cómo leer las canchas: posiciones, símbolos y los tempos de ataque que se usan en todo el playbook.",
    type: "fundamentos",
  },

  /* =================================================== SAQUE */
  {
    id: "saque", num: "2", icon: "🎯", title: "Saque",
    lead: "A dónde sacar según la posición del sacador. Objetivo: complicar la recepción rival y orientar nuestro bloqueo y defensa.",
    plays: [
      {
        title: "Saque Pos 1 → Zona 1", tag: "srv", tagText: "Saque",
        zones: [{ points: [[24, 78], [128, 78], [128, 150], [24, 150]], color: "rgba(226,59,78,.16)" }],
        players: [{ pos: "sR", n: "1", team: "us", label: "Sacador" }],
        ball: ["sR", [150, 240], "z1"],
        captions: [{ text: "ZONA 1", at: [76, 116], color: "#a81a2c", size: 11 }],
        notes: ["Saque cruzado largo desde nuestra derecha hacia la zona 1 rival.", "Busca incomodar al receptor de zona 1 y abrir el lado fuerte."],
      },
      {
        title: "Saque Pos 1 → Zona 5", tag: "srv", tagText: "Saque",
        zones: [{ points: [[172, 78], [276, 78], [276, 150], [172, 150]], color: "rgba(226,59,78,.16)" }],
        players: [{ pos: "sR", n: "1", team: "us", label: "Sacador" }],
        ball: ["sR", [160, 240], "z5"],
        captions: [{ text: "ZONA 5", at: [224, 116], color: "#a81a2c", size: 11 }],
        notes: ["Saque desde la derecha hacia la zona 5 rival (línea larga).", "Útil para sacarle el remate al receptor-punta de zona 4."],
      },
      {
        title: "Saque Pos 5 → Zona 1", tag: "srv", tagText: "Saque",
        zones: [{ points: [[24, 78], [128, 78], [128, 150], [24, 150]], color: "rgba(226,59,78,.16)" }],
        players: [{ pos: "sL", n: "5", team: "us", label: "Sacador" }],
        ball: ["sL", [90, 240], "z1"],
        captions: [{ text: "ZONA 1", at: [76, 116], color: "#a81a2c", size: 11 }],
        notes: ["Saque por la línea desde nuestra izquierda a la zona 1 rival.", "Trayectoria recta: presiona la entrada del colocador."],
      },
      {
        title: "Saque Pos 5 → Zona 5", tag: "srv", tagText: "Saque",
        zones: [{ points: [[172, 78], [276, 78], [276, 150], [172, 150]], color: "rgba(226,59,78,.16)" }],
        players: [{ pos: "sL", n: "5", team: "us", label: "Sacador" }],
        ball: ["sL", [150, 240], "z5"],
        captions: [{ text: "ZONA 5", at: [224, 116], color: "#a81a2c", size: 11 }],
        notes: ["Saque cruzado largo desde la izquierda a la zona 5 rival.", "Abre el campo y dificulta el primer tiempo rival."],
      },
      {
        title: "Saque Pos 6 → Fondo / Zona 6", tag: "srv", tagText: "Saque",
        zones: [{ points: [[100, 60], [200, 60], [200, 130], [100, 130]], color: "rgba(226,59,78,.16)" }],
        players: [{ pos: "sC", n: "6", team: "us", label: "Sacador" }],
        ball: ["sC", [150, 240], "z6"],
        captions: [{ text: "ZONA 6", at: [150, 100], color: "#a81a2c", size: 11 }],
        notes: ["Saque potente de frente al fondo, zona 6.", "Busca el conflicto entre receptores (zona de nadie)."],
      },
    ],
  },

  /* =================================================== RECEPCIÓN */
  {
    id: "recepcion", num: "3", icon: "🙌", title: "Recepción",
    lead: "Formaciones de recepción con líbero. Objetivo: pase perfecto al colocador para habilitar todos los tiempos de ataque.",
    plays: [
      {
        title: "Recepción a 3 con líbero", tag: "us", tagText: "Recepción",
        players: [
          { pos: [72, 380], n: "L", team: "set", label: "Líbero" },
          { pos: [150, 360], n: "6", team: "us" },
          { pos: [228, 380], n: "1", team: "us" },
          { pos: "us2", n: "C", team: "set", label: "Colocador" },
          { pos: [110, 290], n: "4", team: "us" },
          { pos: [180, 290], n: "3", team: "us" },
        ],
        arrows: [{ from: "us2", to: [165, 268], kind: "move" }],
        notes: ["Tres receptores (líbero + dos puntas) cubren todo el fondo.", "El colocador entra desde zona 2 hacia la red.", "Los atacantes de red quedan libres para preparar su tiempo."],
      },
      {
        title: "Recepción en W (5 jugadores)", tag: "us", tagText: "Recepción",
        players: [
          { pos: [72, 360], n: "5", team: "us" },
          { pos: [150, 400], n: "6", team: "us" },
          { pos: [228, 360], n: "1", team: "us" },
          { pos: [110, 300], n: "4", team: "us" },
          { pos: [190, 300], n: "2", team: "set", label: "Colocador" },
        ],
        arrows: [{ from: [190, 300], to: [168, 268], kind: "move" }],
        notes: ["Formación clásica en 'W' para sistemas 4-2 o categorías formativas.", "Cinco receptores: máxima cobertura, menos especialización.", "El colocador penetra a la red tras tocar el saque."],
      },
    ],
  },

  /* =================================================== ATAQUE */
  {
    id: "ataque", num: "4", icon: "💥", title: "Ataque",
    lead: "Opciones de ataque y, sobre todo, cómo decidir el remate según cuántos bloqueadores tenemos enfrente.",
    plays: [
      {
        title: "Opciones de ataque (tempos)", tag: "atk", tagText: "Tempos",
        players: [
          { pos: "us4", n: "4", team: "us" },
          { pos: "us3", n: "3", team: "us" },
          { pos: "us2", n: "C", team: "set", label: "Colocador" },
          { pos: "us6", n: "6", team: "us", label: "Pipe" },
        ],
        arrows: [
          { from: "us2", to: [130, 268], kind: "ball", curve: { dy: -14 } },
          { from: "us2", to: [186, 268], kind: "ball", curve: { dy: -14 } },
          { from: "us2", to: [150, 300], kind: "ball", curve: { dy: 6 } },
        ],
        captions: [
          { text: "1", at: [126, 256], color: "#e8732b", size: 13 },
          { text: "2", at: [190, 256], color: "#e8732b", size: 13 },
          { text: "Pipe", at: [150, 332], color: "#16235f", size: 11 },
        ],
        notes: ["1 = primer tiempo de frente · 2 = primer tiempo de espalda (a la salida).", "El central amenaza el medio para fijar al bloqueo rival.", "El pipe (zaga por el centro) suma una cuarta opción de ataque."],
      },
      {
        title: "Ataque Pos 4 vs 1 bloqueo", tag: "atk", tagText: "Ataque",
        players: [
          { pos: "us4", n: "4", team: "us", label: "Atacante" },
          { pos: "ob_l", n: "B", team: "them" },
        ],
        ball: ["us4", "tgtCrossR"],
        captions: [{ text: "1 bloqueador", at: [82, 210], color: "#a81a2c", size: 10 }],
        notes: ["Con un solo bloqueador hay campo libre: rematar fuerte en diagonal larga.", "Si el bloqueo cierra la línea, abrir cruzado al fondo.", "Máxima agresividad: la defensa rival queda en inferioridad."],
      },
      {
        title: "Ataque Pos 4 vs 2 bloqueo", tag: "atk", tagText: "Ataque",
        players: [
          { pos: "us4", n: "4", team: "us", label: "Atacante" },
          { pos: "ob_l", n: "B", team: "them" },
          { pos: "ob_lc", n: "B", team: "them" },
        ],
        ball: ["us4", "tgtSeam"],
        captions: [{ text: "2 bloqueadores", at: [100, 210], color: "#a81a2c", size: 10 }],
        notes: ["Doble bloqueo: buscar la grieta entre las manos o el 'tool' (mano-fuera).", "Alternativa: remate por la línea recta si el bloqueo cae al centro.", "Cambiar de ritmo con una finta corta detrás del bloqueo."],
      },
      {
        title: "Ataque Pos 4 vs 3 bloqueo", tag: "atk", tagText: "Ataque",
        players: [
          { pos: "us4", n: "4", team: "us", label: "Atacante" },
          { pos: "ob_l", n: "B", team: "them" },
          { pos: "ob_lc", n: "B", team: "them" },
          { pos: "ob_c", n: "B", team: "them" },
        ],
        ball: ["us4", "tgtTip"],
        captions: [{ text: "3 bloqueadores", at: [116, 210], color: "#a81a2c", size: 10 }],
        notes: ["Triple bloqueo: NO forzar el remate de potencia.", "Mejor finta/dejada corta detrás del bloqueo o buscar el rebote ('tool').", "Es señal de mala distribución: el colocador debe variar el juego."],
      },
      {
        title: "Ataque Pos 4 vs 1 bloqueo BAJO", tag: "atk", tagText: "Ataque",
        players: [
          { pos: "us4", n: "4", team: "us", label: "Atacante" },
          { pos: "ob_l", n: "b", team: "them", r: 10 },
        ],
        ball: ["us4", "tgtCrossR"],
        captions: [{ text: "bloqueo bajo / tarde", at: [92, 210], color: "#a81a2c", size: 9.5 }],
        notes: ["Bloqueo bajo o tardío: rematar por encima de las manos con potencia.", "No hace falta buscar el cruzado fino: pasa el balón por arriba.", "Aprovechar el tiempo: el bloqueador no llega a la altura."],
      },
      {
        title: "Ataque Pos 2 vs 3 bloqueo", tag: "atk", tagText: "Ataque",
        players: [
          { pos: "us2", n: "2", team: "us", label: "Atacante" },
          { pos: "ob_r", n: "B", team: "them" },
          { pos: "ob_rc", n: "B", team: "them" },
          { pos: "ob_c", n: "B", team: "them" },
        ],
        ball: ["us2", [120, 110]],
        captions: [{ text: "3 bloqueadores", at: [150, 210], color: "#a81a2c", size: 10 }],
        notes: ["Ataque desde zona 2 (opuesto) contra triple bloqueo.", "Buscar el cruzado largo al ángulo o finta a zona 1 rival.", "Si insisten en triplicar, habilitar al pipe o al central."],
      },
      {
        title: "Pipe — zaga por el centro", tag: "atk", tagText: "Zaga",
        players: [
          { pos: "us6", n: "6", team: "us", label: "Pipe" },
          { pos: "us2", n: "C", team: "set", label: "Colocador" },
          { pos: "ob_lc", n: "B", team: "them" },
          { pos: "ob_rc", n: "B", team: "them" },
        ],
        ball: ["us6", [150, 230], [150, 110]],
        captions: [{ text: "PIPE", at: [150, 386], color: "#16235f", size: 11 }],
        notes: ["Ataque de zaga por el centro: el atacante despega detrás de la línea de 3m.", "Sorprende al bloqueo central, que suele cerrarse a las puntas.", "Clave del juego rápido moderno: cuarta vía de ataque constante."],
      },
      {
        title: "Ataque Pos 1 vs 3 bloqueo", tag: "atk", tagText: "Zaga",
        players: [
          { pos: [228, 360], n: "1", team: "us", label: "Zaguero" },
          { pos: "ob_c", n: "B", team: "them" },
          { pos: "ob_rc", n: "B", team: "them" },
          { pos: "ob_r", n: "B", team: "them" },
        ],
        ball: [[228, 360], [220, 240], [120, 120]],
        notes: ["Ataque de zaga desde zona 1, despegue tras la línea de 3m.", "Trayectoria cruzada larga para evitar el triple bloqueo cerrado.", "Combinar con el pipe para tener ataque por todo el fondo."],
      },
    ],
  },

  /* =================================================== COLOCACIÓN */
  {
    id: "colocacion", num: "5", icon: "🤲", title: "Colocación",
    lead: "Posicionamiento del colocador y la idea del 'low setter': colocaciones bajas y rápidas para ganarle el tiempo al bloqueo.",
    plays: [
      {
        title: "Penetración del colocador", tag: "us", tagText: "Setter",
        players: [
          { pos: [228, 380], n: "C", team: "set", label: "Colocador" },
          { pos: [110, 290], n: "4", team: "us" },
          { pos: [165, 290], n: "3", team: "us" },
        ],
        arrows: [{ from: [228, 380], to: [185, 268], kind: "move", curve: { dx: 10, dy: -10 } }],
        notes: ["El colocador entra desde la zaga (zona 1) hacia la red entre zona 2 y 3.", "Llega siempre al mismo punto para dar referencias estables a los atacantes.", "Entrada rápida tras la recepción = más opciones de combinación."],
      },
      {
        title: "LOW SETTER — colocación baja", tag: "us", tagText: "Setter",
        players: [
          { pos: [165, 270], n: "C", team: "set", label: "Colocador" },
          { pos: "us4", n: "4", team: "us" },
          { pos: "us3", n: "3", team: "us" },
        ],
        arrows: [
          { from: [165, 270], to: [90, 282], kind: "ball" },
          { from: [165, 270], to: [148, 282], kind: "ball" },
        ],
        captions: [{ text: "set rápido y plano", at: [150, 250], color: "#16235f", size: 10 }],
        notes: ["Colocación baja y tensa: el balón viaja rápido y plano.", "El atacante despega antes; el bloqueo rival llega tarde.", "Exige sincronía fina entre colocador y atacantes (trabajo de tempos)."],
      },
    ],
  },

  /* =================================================== BLOQUEO */
  {
    id: "bloqueo", num: "6", icon: "🛡️", title: "Bloqueo",
    lead: "Sistema de bloqueo por prioridades: qué cierra el bloqueo y qué zona deja para que la defensa la cubra detrás.",
    plays: [
      {
        title: "Bloqueo con prioridad 1", tag: "def", tagText: "Bloqueo",
        players: [
          { pos: "thHit", n: "A", team: "them", label: "Atacante" },
          { pos: "nb_lc", n: "B", team: "us" },
          { pos: "nb_c", n: "B", team: "us" },
          { pos: "nb_rc", n: "B", team: "us" },
          { pos: [80, 360], n: "5", team: "us" },
          { pos: [150, 400], n: "L", team: "set" },
          { pos: [228, 360], n: "1", team: "us" },
        ],
        zones: [{ points: [[118, 256], [182, 256], [200, 330], [100, 330]], color: "rgba(91,184,232,.22)" }],
        arrows: [{ from: "thHit", to: [150, 300], kind: "attack" }],
        notes: ["Prioridad 1: el bloqueo cierra la diagonal fuerte del atacante.", "La defensa se ordena DETRÁS de la sombra del bloqueo, no al lado.", "Líbero y zagueros cubren la zona que el bloqueo deja libre."],
      },
      {
        title: "Doble bloqueo en el ala", tag: "def", tagText: "Bloqueo",
        players: [
          { pos: [82, 200], n: "A", team: "them", label: "Atacante" },
          { pos: "nb_l", n: "B", team: "us" },
          { pos: "nb_lc", n: "B", team: "us" },
          { pos: [180, 360], n: "1", team: "us" },
          { pos: [150, 400], n: "L", team: "set" },
          { pos: [240, 330], n: "2", team: "us" },
        ],
        zones: [{ points: [[82, 256], [118, 256], [130, 320], [70, 320]], color: "rgba(91,184,232,.22)" }],
        arrows: [{ from: [82, 200], to: [120, 300], kind: "attack" }],
        notes: ["Bloqueo doble bien formado sobre la punta rival.", "Manos cerradas e inclinadas hacia el centro de nuestra cancha.", "El defensor de línea queda para la finta corta detrás del bloqueo."],
      },
    ],
  },

  /* =================================================== DEFENSA */
  {
    id: "defensa", num: "7", icon: "🧤", title: "Defensa",
    lead: "Sistemas de defensa de campo y coberturas: dónde se para cada jugador para levantar el remate y la finta rival.",
    plays: [
      {
        title: "Defensa de perímetro con líbero", tag: "def", tagText: "Defensa",
        players: [
          { pos: "thHit", n: "A", team: "them", label: "Atacante" },
          { pos: "nb_lc", n: "B", team: "us" },
          { pos: "nb_c", n: "B", team: "us" },
          { pos: [70, 370], n: "5", team: "us" },
          { pos: [150, 420], n: "L", team: "set", label: "Líbero" },
          { pos: [230, 370], n: "1", team: "us" },
          { pos: [110, 320], n: "4", team: "us" },
        ],
        notes: ["Defensa en perímetro: los zagueros abren a las esquinas, líbero al centro-fondo.", "Cada defensor toma la pelota 'de frente', nunca de costado.", "El jugador de zona 4 cubre la finta corta tras el bloqueo."],
      },
      {
        title: "Cobertura de finta / chutada al medio", tag: "def", tagText: "Defensa",
        players: [
          { pos: "thHit", n: "A", team: "them", label: "Atacante" },
          { pos: "nb_c", n: "B", team: "us" },
          { pos: [95, 360], n: "5", team: "us" },
          { pos: [150, 400], n: "L", team: "set" },
          { pos: [205, 360], n: "1", team: "us" },
        ],
        zones: [{ points: [[150, 300], [95, 360], [205, 360]], color: "rgba(39,163,90,.20)" }],
        captions: [{ text: "triángulo de cobertura", at: [150, 440], color: "#27a35a", size: 10 }],
        notes: ["Tres defensores forman un triángulo para cubrir la finta al medio.", "Reacción rápida hacia adelante cuando el atacante 'pellizca' la pelota.", "Replica la jugada '7 - chutada al medio' del sistema original."],
      },
      {
        title: "Cobertura del atacante propio", tag: "us", tagText: "Cobertura",
        players: [
          { pos: "us4", n: "4", team: "us", label: "Atacante" },
          { pos: "us3", n: "3", team: "us" },
          { pos: [110, 330], n: "6", team: "us" },
          { pos: [70, 330], n: "5", team: "us" },
          { pos: "us2", n: "C", team: "set" },
        ],
        zones: [{ points: [[72, 295], [150, 320], [110, 360], [50, 345]], color: "rgba(91,184,232,.20)" }],
        arrows: [{ from: "us4", to: [120, 230], kind: "attack" }],
        notes: ["Cuando atacamos, los compañeros forman un arco DETRÁS del atacante.", "Cubren el balón que rebota en el bloqueo rival hacia nuestro campo.", "Posición baja y lista: el rebote del bloqueo cae cerca y rápido."],
      },
    ],
  },
];
