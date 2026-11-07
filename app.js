// study-to-do: tudo fica salvo no localStorage deste aparelho.
const VAPID_PUBLIC_KEY = "BCj7dwNnOnRW_q5Q91-ragvpS4uIi8HjDk0v1EWZtHLKcfLlLMJaPA5qO3dEt-_4lT0nH-v_5eZSl_rLJn95TR0";
const STORE_KEY = "study-to-do:v1";

// ---------- Estado ----------
function emptyState() {
  return { done: {}, days: {}, posts: 0 };
}
function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return emptyState();
    return { ...emptyState(), ...JSON.parse(raw) };
  } catch {
    return emptyState();
  }
}
function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    toast("Não consegui salvar neste navegador.");
  }
}
let state = load();

// ---------- Datas (sempre no fuso local) ----------
function dayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function addDays(d, n) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

function studiedOn(key) {
  return Boolean(state.days[key]);
}
function markToday(note) {
  const key = dayKey();
  const entry = state.days[key] || { count: 0, notes: [] };
  entry.count += 1;
  if (note) entry.notes.push(note);
  state.days[key] = entry;
}

// Sequência: conta para trás a partir de hoje (ou de ontem, se hoje ainda não estudou).
function streak() {
  let d = new Date();
  if (!studiedOn(dayKey(d))) d = addDays(d, -1);
  let n = 0;
  while (studiedOn(dayKey(d))) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

// ---------- Utilidades ----------
const $ = (id) => document.getElementById(id);
let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}
const allTasks = () => TRILHA.flatMap((f) => f.tarefas.map(([id, texto]) => ({ id, texto, fase: f })));

// ---------- Render: Hoje ----------
function renderToday() {
  const s = streak();
  $("streak-num").textContent = s;
  const today = state.days[dayKey()];
  const btn = $("btn-today");
  if (today) {
    $("today-status").textContent = "Coisinha de hoje feita. Pode fazer mais, se quiser.";
    btn.textContent = "Fiz mais uma";
  } else {
    $("today-status").textContent = s > 0
      ? "Ainda falta a coisinha de hoje para manter a sequência."
      : "Comece hoje. Uma coisinha já conta.";
    btn.textContent = "Fiz minha coisinha hoje";
  }

  const next = allTasks().find((t) => !state.done[t.id]);
  const box = $("next-task");
  box.innerHTML = "";
  if (!next) {
    box.innerHTML = '<p class="next-title">Trilha completa!</p><p class="muted small">Hora de escolher o próximo projeto.</p>';
  } else {
    const title = document.createElement("p");
    title.className = "next-title";
    title.textContent = next.texto;
    const phase = document.createElement("p");
    phase.className = "next-phase muted small";
    phase.textContent = `${next.fase.titulo} · ${next.fase.semanas}`;
    const b = document.createElement("button");
    b.className = "btn primary";
    b.textContent = "Concluí esta";
    b.onclick = () => toggleTask(next.id, true);
    box.append(title, phase, b);
  }

  renderHeatmap();
  $("posts-num").textContent = state.posts;
}

function renderHeatmap() {
  const weeks = 12;
  const today = new Date();
  // Termina no sábado desta semana; começa no domingo de 12 semanas atrás.
  const end = addDays(today, 6 - today.getDay());
  const start = addDays(end, -(weeks * 7) + 1);
  const hm = $("heatmap");
  hm.innerHTML = "";
  let studied = 0;
  for (let i = 0; i < weeks * 7; i++) {
    const d = addDays(start, i);
    const key = dayKey(d);
    const cell = document.createElement("span");
    const entry = state.days[key];
    if (d > today) cell.className = "future";
    else if (entry) {
      studied++;
      cell.className = entry.count >= 3 ? "l3" : entry.count === 2 ? "l2" : "l1";
    }
    if (key === dayKey(today)) cell.classList.add("today");
    cell.title = entry ? `${key}: ${entry.count} coisinha(s)` : key;
    hm.append(cell);
  }
  const total = Object.keys(state.days).length;
  $("stats").textContent = `${studied} dias estudados no período · ${total} no total`;
}

// ---------- Render: Trilha ----------
let openPhases = new Set();
function renderTrilha() {
  const tasks = allTasks();
  const doneCount = tasks.filter((t) => state.done[t.id]).length;
  const pct = Math.round((doneCount / tasks.length) * 100);
  $("overall-pct").textContent = `${pct}%`;
  $("overall-bar").style.width = `${pct}%`;

  const wrap = $("phases");
  wrap.innerHTML = "";
  const firstOpen = TRILHA.find((f) => f.tarefas.some(([id]) => !state.done[id]));
  TRILHA.forEach((f) => {
    const done = f.tarefas.filter(([id]) => state.done[id]).length;
    const det = document.createElement("details");
    det.className = "phase" + (done === f.tarefas.length ? " done" : "");
    det.open = openPhases.size ? openPhases.has(f.id) : f === firstOpen;
    det.addEventListener("toggle", () => {
      det.open ? openPhases.add(f.id) : openPhases.delete(f.id);
    });

    const sum = document.createElement("summary");
    sum.innerHTML = `
      <div class="phase-info">
        <div class="phase-title"></div>
        <div class="muted small"></div>
        <div class="bar"><div class="bar-fill" style="width:${(done / f.tarefas.length) * 100}%"></div></div>
      </div>
      <span class="phase-count">${done}/${f.tarefas.length}</span>`;
    sum.querySelector(".phase-title").textContent = f.titulo;
    sum.querySelector(".muted").textContent = f.semanas;

    const ul = document.createElement("ul");
    ul.className = "tasks";
    f.tarefas.forEach(([id, texto]) => {
      const li = document.createElement("li");
      const label = document.createElement("label");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = Boolean(state.done[id]);
      cb.onchange = () => toggleTask(id, cb.checked);
      const span = document.createElement("span");
      span.textContent = texto;
      if (cb.checked) span.className = "done-text";
      label.append(cb, span);
      li.append(label);
      ul.append(li);
    });

    det.append(sum, ul);
    wrap.append(det);
  });
  if (!openPhases.size && firstOpen) openPhases.add(firstOpen.id);
}

function toggleTask(id, checked) {
  if (checked) {
    state.done[id] = dayKey();
    markToday();
    toast("Boa! Coisinha registrada.");
  } else {
    delete state.done[id];
  }
  save();
  renderAll();
}

function renderAll() {
  renderToday();
  renderTrilha();
}

// ---------- Ações ----------
$("btn-today").onclick = () => {
  const note = $("today-note").value.trim();
  markToday(note);
  $("today-note").value = "";
  save();
  renderAll();
  toast(`Sequência: ${streak()} dia(s). Continue assim!`);
};
$("posts-plus").onclick = () => { state.posts++; markToday(); save(); renderAll(); };
$("posts-minus").onclick = () => { state.posts = Math.max(0, state.posts - 1); save(); renderAll(); };

// Abas
document.querySelectorAll(".nav-btn").forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll(".nav-btn").forEach((x) => {
      x.classList.toggle("active", x === b);
      x.toggleAttribute("aria-current", x === b);
    });
    document.querySelectorAll(".tab").forEach((t) => (t.hidden = t.id !== `tab-${b.dataset.tab}`));
    window.scrollTo(0, 0);
  };
});

// Backup
$("btn-export").onclick = () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `study-to-do-backup-${dayKey()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
};
$("file-import").onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (typeof data !== "object" || !data.done || !data.days) throw new Error();
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
  navigator.serviceWorker.register("sw.js").then((reg) => {
    swReg = reg;
    refreshPushStatus();
  }).catch(() => {});
}

function urlB64ToUint8Array(b64) {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function refreshPushStatus() {
  const status = $("push-status");
  if (!("PushManager" in window) || !swReg) {
    status.textContent = "Este navegador não suporta notificações push. Use o Chrome no Android.";
    $("btn-push").disabled = true;
    return;
  }
  const sub = await swReg.pushManager.getSubscription();
  if (sub) {
    status.textContent = "Lembrete ativado neste aparelho.";
    $("btn-push").textContent = "Mostrar código";
    showSub(sub);
  } else if (Notification.permission === "denied") {
    status.textContent = "Notificações bloqueadas. Libere nas configurações do app.";
  } else {
    status.textContent = "Lembrete ainda não ativado.";
  }
}

function showSub(sub) {
  $("sub-json").value = JSON.stringify(sub);
  $("sub-box").hidden = false;
}

$("btn-push").onclick = async () => {
  if (!swReg) return;
  try {
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return toast("Sem permissão para notificar.");
    let sub = await swReg.pushManager.getSubscription();
    if (!sub) {
      sub = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }
    showSub(sub);
    refreshPushStatus();
  } catch (err) {
    toast("Não consegui ativar: " + err.message);
  }
};

$("btn-test").onclick = async () => {
  if (!swReg) return toast("Service worker ainda carregando.");
  const perm = await Notification.requestPermission();
  if (perm !== "granted") return toast("Sem permissão para notificar.");
  swReg.showNotification("study-to-do", {
    body: "Teste: é assim que o lembrete das 19h vai aparecer.",
    icon: "icons/icon-192.png",
    badge: "icons/badge-96.png",
  });
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

renderAll();
