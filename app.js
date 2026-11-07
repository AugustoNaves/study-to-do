// study-to-do · Estudos com propósito
// Tudo fica salvo no localStorage deste aparelho.
const VAPID_PUBLIC_KEY = "BCj7dwNnOnRW_q5Q91-ragvpS4uIi8HjDk0v1EWZtHLKcfLlLMJaPA5qO3dEt-_4lT0nH-v_5eZSl_rLJn95TR0";
const STORE_KEY = "study-to-do:v2";
const PREV_KEY = "shema:v1"; // nome usado por pouco tempo; migrado automaticamente
const OLD_KEY = "study-to-do:v1";
const PRIO_ORDEM = { alta: 0, media: 1, baixa: 2 };
const PRIO_NOME = { alta: "prioridade alta", media: "prioridade média", baixa: "prioridade baixa" };

// ---------- Datas (fuso local) ----------
function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function fromKey(k) {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function addDays(d, n) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}
function startOfWeek(d) {
  // Semana começa na segunda-feira.
  const c = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return addDays(c, -((c.getDay() + 6) % 7));
}
function dayOfYear(d = new Date()) {
  return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
}
const fmtCurto = (k) => fromKey(k).toLocaleDateString("pt-BR", { day: "numeric", month: "short" }).replace(".", "");

// ---------- Estado ----------
let contador = Date.now();
const uid = () => (contador++).toString(36) + Math.random().toString(36).slice(2, 6);

function emptyState() {
  return { nome: "", tarefas: [], devoc: {}, diasLegado: [], push: false };
}

// As tarefas da trilha constroem o projeto open source (sistema de inscrição e check-in).
const MATERIA_PROJETO = "Projeto open source: check-in";
const MATERIA_CONTRIB = "Contribuir em outros projetos";
const MATERIAS_ANTIGAS = { "Trilha back-end": MATERIA_PROJETO, "Open source": MATERIA_CONTRIB };

function seedTarefas(doneMap = {}) {
  let ordem = 0;
  return TRILHA.flatMap((fase) =>
    fase.tarefas.map(([id, titulo]) => ({
      id: uid(),
      titulo,
      descricao: `${fase.titulo} · ${fase.semanas}`,
      materia: fase.id === "fp" ? MATERIA_CONTRIB : MATERIA_PROJETO,
      data: null,
      prioridade: "media",
      concluida: Boolean(doneMap[id]),
      concluidaEm: doneMap[id] || null,
      ordem: ordem++,
    }))
  );
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY) || localStorage.getItem(PREV_KEY);
    if (raw) {
      const s = { ...emptyState(), ...JSON.parse(raw) };
      s.tarefas.forEach((t) => (t.materia = MATERIAS_ANTIGAS[t.materia] || t.materia));
      return s;
    }
    // Primeira vez: migra o progresso do app antigo, se houver.
    const s = emptyState();
    const old = JSON.parse(localStorage.getItem(OLD_KEY) || "null");
    s.tarefas = seedTarefas(old?.done || {});
    s.diasLegado = old?.days ? Object.keys(old.days) : [];
    return s;
  } catch {
    const s = emptyState();
    s.tarefas = seedTarefas();
    return s;
  }
}
function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    localStorage.removeItem(PREV_KEY);
  } catch {
    toast("Não consegui salvar neste aparelho.");
  }
}
let state = load();
save();

// ---------- Consultas ----------
const hoje = () => dayKey();
function ordenar(a, b) {
  return (
    PRIO_ORDEM[a.prioridade] - PRIO_ORDEM[b.prioridade] ||
    (a.data || "9999").localeCompare(b.data || "9999") ||
    (a.ordem ?? 1e9) - (b.ordem ?? 1e9)
  );
}
function diasDeEstudo() {
  const set = new Set(state.diasLegado);
  state.tarefas.forEach((t) => t.concluidaEm && set.add(t.concluidaEm));
  return set;
}
const devInfo = (id) => state.devoc[id] || { notas: "", oracao: "", concluidos: [] };
const devFeitoHoje = (id) => devInfo(id).concluidos.includes(hoje());
const devsDe = (momento) => DEVOCIONAIS.filter((d) => d.momento === momento);
function devDoDia(momento) {
  const lista = devsDe(momento);
  return lista[dayOfYear() % lista.length];
}

// ---------- Utilidades de interface ----------
const $ = (id) => document.getElementById(id);
function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "html") el.innerHTML = v;
    else el.setAttribute(k, v === true ? "" : v);
  }
  kids.flat().forEach((c) => c != null && el.append(c));
  return el;
}
const svg = (path, cls = "") => h("span", { html: `<svg class="ico ${cls}" viewBox="0 0 24 24">${path}</svg>`, "aria-hidden": "true", style: "display:contents" });
let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

// ---------- Componentes ----------
function taskRow(t, semMateria = false) {
  const meta = [];
  if (t.materia && semMateria !== true) meta.push(h("b", {}, t.materia));
  if (t.data) {
    const k = t.data;
    meta.push(k === hoje() ? "hoje" : k < hoje() && !t.concluida ? `desde ${fmtCurto(k)}` : fmtCurto(k));
  }
  meta.push(PRIO_NOME[t.prioridade]);
  for (let i = meta.length - 1; i > 0; i--) meta.splice(i, 0, " · ");
  const cb = h("input", {
    type: "checkbox",
    class: "check",
    "aria-label": `Concluir: ${t.titulo}`,
    onchange: () => toggleTarefa(t.id),
  });
  cb.checked = t.concluida;
  return h(
    "li",
    { class: "task" + (t.concluida ? " done" : "") },
    cb,
    h(
      "button",
      { class: "task-body", type: "button", onclick: () => abrirTarefa(t) },
      h("span", { class: "task-title" }, t.titulo),
      h("span", { class: "meta" }, h("span", { class: "prio " + t.prioridade }), ...meta)
    )
  );
}

function emptyBox(titulo, texto, acao) {
  return h("div", { class: "empty" }, h("strong", {}, titulo), h("span", {}, texto), acao ? h("div", { class: "row", style: "justify-content:center" }, acao) : null);
}

// ---------- INÍCIO ----------
function renderInicio() {
  const agora = new Date();
  const hr = agora.getHours();
  const saud = hr < 12 ? "Bom dia" : hr < 18 ? "Boa tarde" : "Boa noite";
  $("greet").textContent = state.nome ? `${saud}, ${state.nome}` : saud;
  $("today-date").textContent = agora.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  const v = VERSICULOS[(agora.getDate() - 1) % VERSICULOS.length];
  $("verse-text").textContent = `“${v.texto}”`;
  $("verse-ref").textContent = v.referencia;

  // Jornada
  const k = hoje();
  const antes = devDoDia("antes");
  const depois = devDoDia("depois");
  const p1 = devsDe("antes").some((d) => devFeitoHoje(d.id));
  const p2 = state.tarefas.some((t) => t.concluidaEm === k);
  const p3 = devsDe("depois").some((d) => devFeitoHoje(d.id));
  const nTarefasHoje = state.tarefas.filter((t) => !t.concluida && t.data && t.data <= k).length;
  const passos = [
    { n: 1, t: "Preparar o coração", s: antes.titulo, done: p1, go: () => abrirDevocional(antes.id) },
    { n: 2, t: "Estudar com propósito", s: nTarefasHoje ? `${nTarefasHoje} tarefa(s) para hoje` : "Sua lista de estudos", done: p2, go: () => irPara("estudos") },
    { n: 3, t: "Refletir e agradecer", s: depois.titulo, done: p3, go: () => abrirDevocional(depois.id) },
  ];
  const feitos = passos.filter((p) => p.done).length;
  $("j-hint").textContent = [
    "Um passo de cada vez. Nenhum é obrigatório.",
    "Que bom que você começou.",
    "Você já caminhou bastante hoje.",
    "Dia completo. Obrigado por cuidar disso.",
  ][feitos];
  $("journey").replaceChildren(
    ...passos.map((p) =>
      h(
        "li",
        {},
        h(
          "button",
          { class: "step" + (p.done ? " done" : ""), type: "button", onclick: p.go, "aria-label": `${p.t}${p.done ? " (feito)" : ""}` },
          h("span", { class: "mark", "aria-hidden": "true" }, p.done ? "✓" : String(p.n)),
          h("span", {}, h("span", { class: "t" }, p.t), h("span", { class: "s" }, p.s)),
          svg('<path d="m9 6 6 6-6 6"/>', "go")
        )
      )
    )
  );

  // Para hoje
  const pend = state.tarefas.filter((t) => !t.concluida);
  let lista = pend.filter((t) => t.data && t.data <= k).sort(ordenar);
  let sugestao = false;
  if (!lista.length) {
    lista = pend.filter((t) => !t.data).sort(ordenar).slice(0, 3);
    sugestao = lista.length > 0;
  }
  lista = lista.slice(0, 5);
  const feitasHoje = state.tarefas.filter((t) => t.concluidaEm === k);
  const total = lista.length + feitasHoje.length;
  const ul = $("home-tasks");
  if (!total) {
    $("h-prog").textContent = "";
    $("h-bar-wrap").hidden = true;
    ul.replaceChildren(
      h("li", {}, emptyBox("Nada marcado para hoje.", "Crie uma tarefa quando quiser.", h("button", { class: "btn ghost", onclick: () => abrirTarefa() }, "Nova tarefa")))
    );
  } else {
    $("h-bar-wrap").hidden = false;
    $("h-prog").textContent = !lista.length
      ? "Tudo feito por hoje. Descanse bem."
      : sugestao && !feitasHoje.length
      ? "Nenhuma tarefa com data para hoje. Sugestões da sua lista:"
      : `${feitasHoje.length} de ${total} concluídas`;
    $("h-bar").style.width = `${(feitasHoje.length / total) * 100}%`;
    ul.replaceChildren(...lista.map(taskRow), ...feitasHoje.map(taskRow));
  }

  // Próximos estudos
  const prox = pend.filter((t) => t.data && t.data > k).sort((a, b) => a.data.localeCompare(b.data)).slice(0, 3);
  $("upcoming-wrap").hidden = !prox.length;
  $("upcoming").replaceChildren(
    ...prox.map((t) => {
      const d = fromKey(t.data);
      return h(
        "li",
        {},
        h("span", { class: "day" }, String(d.getDate()), h("small", {}, d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""))),
        h("button", { class: "task-body", type: "button", onclick: () => abrirTarefa(t) }, h("span", { class: "task-title" }, t.titulo), h("span", { class: "meta" }, h("b", {}, t.materia || "Sem matéria")))
      );
    })
  );
}

// ---------- ESTUDOS ----------
let filtro = "pendentes";
function renderEstudos() {
  const pend = state.tarefas.filter((t) => !t.concluida);
  const done = state.tarefas.filter((t) => t.concluida);
  $("count-pend").textContent = `(${pend.length})`;
  $("count-done").textContent = `(${done.length})`;
  document.querySelectorAll(".seg button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.filter === filtro)));

  const wrap = $("task-groups");
  if (filtro === "concluidas") {
    if (!done.length) return wrap.replaceChildren(emptyBox("Ainda nada por aqui.", "As tarefas concluídas aparecem nesta lista."));
    const lista = [...done].sort((a, b) => (b.concluidaEm || "").localeCompare(a.concluidaEm || ""));
    return wrap.replaceChildren(h("ul", { class: "tasks" }, lista.map(taskRow)));
  }
  if (!pend.length) {
    return wrap.replaceChildren(emptyBox("Nenhuma tarefa pendente.", "Toque em “Nova tarefa” para organizar seus estudos."));
  }
  const grupos = new Map();
  pend.sort(ordenar).forEach((t) => {
    const g = t.materia || "Sem matéria";
    if (!grupos.has(g)) grupos.set(g, []);
    grupos.get(g).push(t);
  });
  // Projeto principal primeiro; contribuições e "Sem matéria" por último.
  const peso = (g) => (g === MATERIA_PROJETO ? 0 : g === MATERIA_CONTRIB ? 2 : g === "Sem matéria" ? 3 : 1);
  const nomes = [...grupos.keys()].sort((a, b) => peso(a) - peso(b) || a.localeCompare(b, "pt-BR"));
  wrap.replaceChildren(...nomes.flatMap((g) => [h("h3", { class: "group-title" }, `${g} · ${grupos.get(g).length}`), h("ul", { class: "tasks" }, grupos.get(g).map((t) => taskRow(t, true)))]));
}

function toggleTarefa(id) {
  const t = state.tarefas.find((x) => x.id === id);
  if (!t) return;
  t.concluida = !t.concluida;
  t.concluidaEm = t.concluida ? hoje() : null;
  save();
  renderAll();
  if (t.concluida) toast("Tarefa concluída.");
}

// Formulário de tarefa
let editando = null;
function abrirTarefa(t = null) {
  editando = t;
  $("ts-title").textContent = t ? "Editar tarefa" : "Nova tarefa";
  $("tf-titulo").value = t?.titulo || "";
  $("tf-desc").value = t?.descricao || "";
  $("tf-materia").value = t?.materia || "";
  $("tf-data").value = t?.data || "";
  document.querySelector(`input[name="prio"][value="${t?.prioridade || "media"}"]`).checked = true;
  $("tf-delete").hidden = !t;
  $("tf-err").hidden = true;
  const materias = [...new Set(state.tarefas.map((x) => x.materia).filter(Boolean))].sort();
  $("materias").replaceChildren(...materias.map((m) => h("option", { value: m })));
  abrirOverlay($("task-sheet"));
  if (!t) setTimeout(() => $("tf-titulo").focus(), 250);
}
$("task-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const titulo = $("tf-titulo").value.trim();
  if (!titulo) {
    $("tf-err").hidden = false;
    $("tf-titulo").focus();
    return;
  }
  const dados = {
    titulo,
    descricao: $("tf-desc").value.trim(),
    materia: $("tf-materia").value.trim(),
    data: $("tf-data").value || null,
    prioridade: document.querySelector('input[name="prio"]:checked').value,
  };
  if (editando) Object.assign(editando, dados);
  else state.tarefas.push({ id: uid(), ...dados, concluida: false, concluidaEm: null });
  save();
  fecharOverlay();
  renderAll();
  toast(editando ? "Tarefa atualizada." : "Tarefa criada.");
});
$("tf-cancel").onclick = () => fecharOverlay();
$("tf-delete").onclick = () => {
  if (!editando || !confirm(`Excluir “${editando.titulo}”? Isso não pode ser desfeito.`)) return;
  state.tarefas = state.tarefas.filter((t) => t !== editando);
  save();
  fecharOverlay();
  renderAll();
  toast("Tarefa excluída.");
};
$("tf-titulo").addEventListener("input", () => ($("tf-err").hidden = true));
$("task-sheet").addEventListener("click", (e) => e.target === e.currentTarget && fecharOverlay());
$("new-task").onclick = () => abrirTarefa();
document.querySelectorAll(".seg button").forEach((b) => (b.onclick = () => { filtro = b.dataset.filter; renderEstudos(); }));

// ---------- DEVOCIONAIS ----------
function renderDevocionais() {
  ["antes", "depois"].forEach((m) => {
    const sugerido = devDoDia(m).id;
    $(`list-${m}`).replaceChildren(
      ...devsDe(m).map((d, i) => {
        const info = devInfo(d.id);
        const feito = info.concluidos.length > 0;
        return h(
          "li",
          {},
          h(
            "button",
            { class: "dev-item" + (d.id === sugerido ? " today" : ""), type: "button", onclick: () => abrirDevocional(d.id), "aria-label": `${d.titulo}, ${d.referencia}${d.id === sugerido ? ", sugerido para hoje" : ""}${feito ? ", já realizado" : ""}` },
            h("span", { class: "n", "aria-hidden": "true" }, String(i + 1)),
            h("span", {}, h("span", { class: "t" }, d.titulo), h("span", { class: "r" }, d.id === sugerido ? `${d.referencia} · sugerido hoje` : d.referencia)),
            feito ? h("span", { class: "ok", "aria-hidden": "true" }, "✓ feito") : null
          )
        );
      })
    );
  });
}

let lendo = null;
let salvarTimer;
function abrirDevocional(id) {
  const d = DEVOCIONAIS.find((x) => x.id === id);
  if (!d) return;
  lendo = d;
  const info = devInfo(id);
  $("rd-moment").textContent = d.momento === "antes" ? "Antes de estudar · Preparar o coração" : "Depois de estudar · Refletir e agradecer";
  $("rd-title").textContent = d.titulo;
  $("rd-texto").textContent = `“${d.texto}”`;
  $("rd-ref").textContent = `${d.referencia} · Bíblia Livre`;
  $("rd-reflexao").replaceChildren(...d.reflexao.split(/\n\n+/).map((p) => h("p", {}, p)));
  $("rd-aplicacao").textContent = d.aplicacao;
  $("rd-oracao-sug").textContent = d.oracao;
  $("rd-notas").value = info.notas;
  $("rd-oracao").value = info.oracao;
  $("rd-saved").textContent = "";
  atualizarBotaoDev();
  abrirOverlay($("reader"));
  $("reader").scrollTop = 0;
}
function atualizarBotaoDev() {
  $("rd-done").textContent = devFeitoHoje(lendo.id) ? "✓ Concluído hoje · desfazer" : "Concluir devocional";
  $("rd-done").className = devFeitoHoje(lendo.id) ? "btn ghost block" : "btn primary block";
}
function salvarDev(patch) {
  state.devoc[lendo.id] = { ...devInfo(lendo.id), ...patch };
  save();
}
["rd-notas", "rd-oracao"].forEach((id) =>
  $(id).addEventListener("input", () => {
    clearTimeout(salvarTimer);
    $("rd-saved").textContent = "";
    salvarTimer = setTimeout(() => {
      salvarDev({ notas: $("rd-notas").value, oracao: $("rd-oracao").value });
      $("rd-saved").textContent = "Salvo neste aparelho.";
    }, 500);
  })
);
$("rd-done").onclick = () => {
  const info = devInfo(lendo.id);
  const k = hoje();
  const concluidos = info.concluidos.includes(k) ? info.concluidos.filter((x) => x !== k) : [...info.concluidos, k];
  salvarDev({ concluidos, notas: $("rd-notas").value, oracao: $("rd-oracao").value });
  atualizarBotaoDev();
  renderAll();
  if (concluidos.includes(k)) toast("Que bom ter esse tempo com Deus.");
};

// ---------- PROGRESSO ----------
function renderProgresso() {
  const dias = diasDeEstudo();
  const k = hoje();
  const ini = startOfWeek(new Date());
  let nSemana = 0;
  $("week").replaceChildren(
    ...Array.from({ length: 7 }, (_, i) => {
      const d = addDays(ini, i);
      const dk = dayKey(d);
      const on = dias.has(dk);
      if (on) nSemana++;
      const cls = [on && "on", dk === k && "today", dk > k && "future"].filter(Boolean).join(" ");
      return h("li", { class: cls, "aria-label": `${d.toLocaleDateString("pt-BR", { weekday: "long" })}${on ? ": estudou" : ""}` }, d.toLocaleDateString("pt-BR", { weekday: "narrow" }), h("span", { class: "dot" }));
    })
  );
  $("pw-hint").textContent = nSemana
    ? `Você estudou em ${nSemana} ${nSemana === 1 ? "dia" : "dias"} nesta semana.`
    : "Uma semana nova é sempre um bom começo.";

  $("st-tasks").textContent = state.tarefas.filter((t) => t.concluida).length;
  $("st-days").textContent = dias.size;
  $("st-devs").textContent = Object.values(state.devoc).reduce((s, d) => s + (d.concluidos?.length || 0), 0);

  const linhas = [];
  for (let w = 0; w < 8; w++) {
    const s = addDays(ini, -7 * w);
    let n = 0;
    for (let i = 0; i < 7; i++) if (dias.has(dayKey(addDays(s, i)))) n++;
    const fim = addDays(s, 6);
    const label = w === 0 ? "Esta semana" : `${s.getDate()}–${fim.getDate()} ${fim.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}`;
    linhas.push(h("li", {}, h("span", {}, label), h("span", { class: "hb" }, h("i", { style: `width:${(n / 7) * 100}%` })), h("span", { class: "hn" }, String(n))));
  }
  $("history").replaceChildren(...linhas);
}

// ---------- Navegação ----------
function irPara(tab) {
  document.querySelectorAll(".nav button").forEach((b) => {
    const on = b.dataset.tab === tab;
    b.classList.toggle("on", on);
    on ? b.setAttribute("aria-current", "page") : b.removeAttribute("aria-current");
  });
  document.querySelectorAll(".tab").forEach((t) => (t.hidden = t.id !== `tab-${tab}`));
  window.scrollTo(0, 0);
}
document.querySelectorAll(".nav button").forEach((b) => (b.onclick = () => irPara(b.dataset.tab)));
document.querySelectorAll("[data-goto]").forEach((b) => (b.onclick = () => irPara(b.dataset.goto)));

// Telas sobrepostas: o botão Voltar do Android fecha a de cima.
const pilha = [];
function abrirOverlay(el) {
  el.hidden = false;
  pilha.push(el);
  document.body.classList.add("locked");
  history.pushState({ overlay: el.id }, "");
}
function esconderTopo() {
  const el = pilha.pop();
  if (el) el.hidden = true;
  if (!pilha.length) document.body.classList.remove("locked");
}
function fecharOverlay() {
  if (pilha.length) history.back();
}
window.addEventListener("popstate", esconderTopo);
document.querySelectorAll("[data-close]").forEach((b) => (b.onclick = fecharOverlay));
document.addEventListener("keydown", (e) => e.key === "Escape" && fecharOverlay());

// ---------- Ajustes ----------
$("open-ajustes").onclick = () => {
  $("aj-nome").value = state.nome;
  abrirOverlay($("ajustes"));
  refreshPushStatus();
};
$("aj-nome").addEventListener("change", () => {
  state.nome = $("aj-nome").value.trim();
  save();
  renderInicio();
  toast("Nome atualizado.");
});

$("btn-export").onclick = () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = h("a", { href: URL.createObjectURL(blob), download: `study-to-do-backup-${hoje()}.json` });
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};
$("file-import").onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.tarefas) || typeof data.devoc !== "object") throw new Error();
    state = { ...emptyState(), ...data };
    save();
    renderAll();
    toast("Backup importado.");
  } catch {
    toast("Arquivo inválido.");
  }
  e.target.value = "";
};

// ---------- Service worker e lembrete ----------
let swReg = null;
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then((reg) => (swReg = reg)).catch(() => {});
}
function urlB64ToUint8Array(b64) {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}
async function refreshPushStatus() {
  const status = $("push-status");
  if (!("PushManager" in window) || !swReg) {
    status.textContent = "Este navegador não suporta notificações. Use o Chrome no Android.";
    $("btn-push").disabled = true;
    return;
  }
  const sub = await swReg.pushManager.getSubscription();
  if (sub) {
    status.textContent = "Lembrete ativado neste aparelho.";
    $("btn-push").textContent = "Mostrar código";
    $("sub-json").value = JSON.stringify(sub);
    $("sub-box").hidden = false;
  } else if (Notification.permission === "denied") {
    status.textContent = "Notificações bloqueadas. Libere nas configurações do app.";
  } else {
    status.textContent = "Lembrete ainda não ativado.";
  }
}
$("btn-push").onclick = async () => {
  if (!swReg) return;
  try {
    if ((await Notification.requestPermission()) !== "granted") return toast("Sem permissão para notificar.");
    const sub =
      (await swReg.pushManager.getSubscription()) ||
      (await swReg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY) }));
    $("sub-json").value = JSON.stringify(sub);
    $("sub-box").hidden = false;
    refreshPushStatus();
  } catch (err) {
    toast("Não consegui ativar: " + err.message);
  }
};
$("btn-test").onclick = async () => {
  if (!swReg) return toast("Ainda carregando. Tente de novo.");
  if ((await Notification.requestPermission()) !== "granted") return toast("Sem permissão para notificar.");
  swReg.showNotification("study-to-do", { body: "Assim o convite das 19h vai aparecer.", icon: "icons/icon-192.png", badge: "icons/badge-96.png" });
};
$("btn-copy").onclick = async () => {
  try {
    await navigator.clipboard.writeText($("sub-json").value);
    toast("Código copiado.");
  } catch {
    $("sub-json").select();
    toast("Selecionei o código: copie manualmente.");
  }
};
$("btn-share").onclick = () => {
  if (navigator.share) navigator.share({ title: "study-to-do", text: $("sub-json").value }).catch(() => {});
  else toast("Compartilhar não está disponível aqui.");
};

// ---------- Boas-vindas ----------
$("welcome-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = $("wl-nome").value.trim();
  if (!nome) return $("wl-nome").focus();
  state.nome = nome;
  save();
  $("welcome").hidden = true;
  document.body.classList.remove("locked");
  renderAll();
});

// ---------- Início ----------
function renderAll() {
  renderInicio();
  renderEstudos();
  renderDevocionais();
  renderProgresso();
}
renderAll();
if (!state.nome) {
  $("welcome").hidden = false;
  document.body.classList.add("locked");
}
// Atualiza ao voltar para o app num outro dia.
document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && renderAll());
