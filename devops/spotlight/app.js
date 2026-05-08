// ============================================================
//  EDIÇÕES — edite aqui para adicionar ou atualizar edições
//
//  Campos obrigatórios:
//    number          → número da edição (inteiro)
//    title           → tema/título da edição
//    date            → data da apresentação   (YYYY-MM-DD)
//    period.start    → início do sprint/período (YYYY-MM-DD)
//    period.end      → fim do sprint/período    (YYYY-MM-DD)
//
//  Campos opcionais:
//    presentationUrl → "edition-01/spotlight.html" (apresentação local)
//                      ou link externo do PPTX/Slides (null = "Em breve")
//    cards           → lista de atividades apresentadas
//      .title        → nome da atividade
//      .description  → descrição do que foi feito
//      .tag          → categoria (ver TAG_COLORS abaixo)
// ============================================================

const EDITIONS = [
  {
    number: 1,
    title: "Pipelines & Infraestrutura",
    date: "2026-04-24",
    period: { start: "2026-04-10", end: "2026-04-24" },
    presentationUrl: "edition-01/spotlight.html", // ou link do PPTX
    cards: [
      { title: "Pipeline de CI configurado",        description: "Pipeline YAML no Azure DevOps com stages de build, test e publish.", tag: "CI/CD" },
      { title: "Deploy automático em staging",      description: "Release pipeline com artefato versionado e aprovação antes de prod.",  tag: "Deploy" },
      { title: "Infraestrutura como código",        description: "Terraform para App Service, Storage e Key Vault com state remoto.",    tag: "Infraestrutura" },
      { title: "Dashboard de monitoramento",        description: "Azure Monitor com alertas de falha de build e deploy.",                tag: "Monitoramento" },
      { title: "Secrets no Key Vault",              description: "Migração de credenciais hardcoded para Azure Key Vault.",              tag: "Segurança" },
    ],
  },
  {
    number: 2,
    title: "Migração do Ambiente",                              // tema da edição
    date: "2026-05-01",                     // data da apresentação
    period: { start: "2026-04-24", end: "2026-05-01" },
    presentationUrl: "edition-02/spotlight.html",
    cards: [
      { title: "Pipeline de CI configurado",        description: "Pipeline YAML no Azure DevOps com stages de build, test e publish.", tag: "CI/CD" },
      { title: "Deploy automático em staging",      description: "Release pipeline com artefato versionado e aprovação antes de prod.",  tag: "Deploy" },
      { title: "Infraestrutura como código",        description: "Terraform para App Service, Storage e Key Vault com state remoto.",    tag: "Infraestrutura" },
      { title: "Dashboard de monitoramento",        description: "Azure Monitor com alertas de falha de build e deploy.",                tag: "Monitoramento" },
      { title: "Secrets no Key Vault",              description: "Migração de credenciais hardcoded para Azure Key Vault.",              tag: "Segurança" },
    ],
  },
    {
    number: 3,
    title: "Segurança e Encerramento da migração",                              // tema da edição
    date: "2026-05-15",                     // data da apresentação
    period: { start: "2026-05-01", end: "2026-05-15" },
    presentationUrl: "edition-03/devops-03.pptx",
    cards: [
      { title: "Pipeline de CI configurado",        description: "Pipeline YAML no Azure DevOps com stages de build, test e publish.", tag: "CI/CD" },
      { title: "Deploy automático em staging",      description: "Release pipeline com artefato versionado e aprovação antes de prod.",  tag: "Deploy" },
      { title: "Infraestrutura como código",        description: "Terraform para App Service, Storage e Key Vault com state remoto.",    tag: "Infraestrutura" },
      { title: "Dashboard de monitoramento",        description: "Azure Monitor com alertas de falha de build e deploy.",                tag: "Monitoramento" },
      { title: "Secrets no Key Vault",              description: "Migração de credenciais hardcoded para Azure Key Vault.",              tag: "Segurança" },
    ],
  },
  {
    number: 4,
    title: "",
    date: "2026-06-05",
    period: { start: "2026-05-15", end: "2026-06-05" },
    presentationUrl: null,
  },
];

// ============================================================
//  TAGS — adicione cores para novas categorias aqui
// ============================================================

const TAG_COLORS = {
  "CI/CD":          "#0078d4",
  "Pipeline":       "#0ea5e9",
  "Deploy":         "#7c3aed",
  "Infraestrutura": "#059669",
  "Monitoramento":  "#d97706",
  "Segurança":      "#dc2626",
  "Automação":      "#8b5cf6",
  "Azure":          "#0078d4",
  "Kubernetes":     "#326ce5",
  "Docker":         "#2496ed",
  "Terraform":      "#623ce4",
  "Geral":          "#4b5563",
};

// ──────────────────────────────────────────────────────────
//  Internals — não precisa editar abaixo
// ──────────────────────────────────────────────────────────

const STATUS_META = {
  apresentado: { label: "Apresentado", css: "apresentado" },
  proxima:     { label: "Próxima",     css: "proxima"     },
  planejada:   { label: "Planejada",   css: "planejada"   },
};

function computeStatuses(editions) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureTimes = editions
    .map(ed => new Date(ed.date).getTime())
    .filter(t => t >= today.getTime());
  const nextTs = futureTimes.length ? Math.min(...futureTimes) : null;

  return editions.map(ed => {
    const ts = new Date(ed.date).getTime();
    const status =
      ts < today.getTime()    ? "apresentado" :
      ts === nextTs           ? "proxima"     :
                                "planejada";
    return { ...ed, status };
  });
}

function fmt(dateStr) {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function fmtPeriod(p) {
  return `${fmt(p.start).slice(0, 5)} – ${fmt(p.end)}`;
}

function tagColor(tag) {
  return TAG_COLORS[tag] ?? "#4b5563";
}

function cardHTML(ed) {
  const { number, title, date, period, presentationUrl, cards, status } = ed;
  const num      = String(number).padStart(2, "0");
  const hasUrl   = Boolean(presentationUrl);
  const hasCards = Array.isArray(cards) && cards.length > 0;
  const isPlanned = status === "planejada";

  const openBtn = hasUrl
    ? `<a class="btn btn-primary" href="${presentationUrl}" target="_blank" rel="noopener">▶ Abrir Spotlight</a>`
    : `<button class="btn btn-disabled" disabled>▶ Em breve</button>`;

  const cardsBtn = hasCards
    ? `<button class="btn btn-secondary" onclick="openModal(${number})">≡ Ver Cards</button>`
    : isPlanned
      ? `<button class="btn btn-disabled" disabled>≡ Em breve</button>`
      : "";

  return `
    <div class="edition-card" tabindex="0"
         data-number="${number}"
         data-url="${presentationUrl ?? ""}">
      <div class="card-header">
        <span class="edition-number">#${num}</span>
        <span class="status-badge status-${STATUS_META[status].css}">
          ${STATUS_META[status].label}
        </span>
      </div>
      ${title ? `<p class="edition-title">${title}</p>` : ""}
      <div class="edition-date">${fmt(date)}</div>
      <div class="edition-period">Período: ${fmtPeriod(period)}</div>
      <div class="card-actions">${openBtn}${cardsBtn}</div>
    </div>`;
}

function render() {
  const editions = computeStatuses(EDITIONS);
  const sorted   = [...editions].sort((a, b) => new Date(b.date) - new Date(a.date));
  document.getElementById("editions-grid").innerHTML = sorted.map(cardHTML).join("");
  initKeyboardNav();
}

// ─── Modal ────────────────────────────────────────────────

function openModal(number) {
  const ed = EDITIONS.find(e => e.number === number);
  if (!ed?.cards?.length) return;

  document.getElementById("modal-title").textContent =
    `#${String(ed.number).padStart(2, "0")} — ${ed.title ?? fmt(ed.date)}`;

  document.getElementById("modal-cards").innerHTML = ed.cards.map(c => {
    const color = tagColor(c.tag);
    return `
      <div class="work-card">
        <span class="work-card-tag"
              style="background:${color}22; color:${color}; border-color:${color}44">
          ${c.tag ?? "Geral"}
        </span>
        <div class="work-card-title">${c.title}</div>
        <div class="work-card-desc">${c.description}</div>
      </div>`;
  }).join("");

  document.getElementById("modal").hidden = false;
  document.body.classList.add("modal-open");
}

function closeModal() {
  document.getElementById("modal").hidden = true;
  document.body.classList.remove("modal-open");
}

document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal").addEventListener("click", e => {
  if (e.target === document.getElementById("modal")) closeModal();
});

// ─── Keyboard Navigation ─────────────────────────────────

function initKeyboardNav() {
  document.addEventListener("keydown", handleKey);
}

function handleKey(e) {
  const modal = document.getElementById("modal");

  if (!modal.hidden) {
    if (e.key === "Escape") closeModal();
    return;
  }

  // 1–9 → focus card by edition number
  if (/^[1-9]$/.test(e.key)) {
    const target = document.querySelector(`.edition-card[data-number="${e.key}"]`);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  const cards   = [...document.querySelectorAll(".edition-card")];
  const focused = document.activeElement;
  const idx     = cards.indexOf(focused);

  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    e.preventDefault();
    const next = idx === -1 ? cards[0] : cards[Math.min(idx + 1, cards.length - 1)];
    next?.focus();
  }

  if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault();
    const prev = idx <= 0 ? cards[0] : cards[idx - 1];
    prev?.focus();
  }

  if (e.key === "Enter" && focused?.classList.contains("edition-card")) {
    const url = focused.dataset.url;
    if (url) window.open(url, "_blank", "noopener");
  }
}

// ─── Shortcuts Bar ───────────────────────────────────────

function renderShortcuts(editions) {
  const navigable = editions
    .filter(e => e.status !== "planejada")
    .sort((a, b) => a.number - b.number);
  const planned = editions
    .filter(e => e.status === "planejada")
    .sort((a, b) => a.number - b.number);

  let html = "";

  if (navigable.length) {
    const kbds = navigable.map(e => `<kbd>${e.number}</kbd>`).join("");
    html += `<span class="shortcut-group">${kbds} Ir para edição</span>`;
  }

  planned.forEach(e => {
    const num = String(e.number).padStart(2, "0");
    html += `<span class="shortcut-group"><kbd>${e.number}</kbd> Edição #${num} (em breve)</span>`;
  });

  html += `<span class="shortcut-group"><kbd>←</kbd><kbd>→</kbd> Navegar cards</span>`;
  html += `<span class="shortcut-group"><kbd>Enter</kbd> Abrir Spotlight</span>`;
  html += `<span class="shortcut-group"><kbd>Esc</kbd> Fechar modal</span>`;

  document.getElementById("shortcuts-inner").innerHTML = html;
}

render();
renderShortcuts(computeStatuses(EDITIONS));
