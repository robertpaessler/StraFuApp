(function () {
  const listEl = document.getElementById("termineList");
  const emptyEl = document.getElementById("termineEmpty");
  const btnReload = document.getElementById("btnReload");

  function formatDateISO(iso) {
    if (!iso || typeof iso !== "string") return "";
    const [y, m, d] = iso.split("-");
    if (!y || !m || !d) return iso;
    return `${d}.${m}.${y}`;
  }

  function createItem(t) {
    const li = document.createElement("li");
    li.className = "item";

    const title = document.createElement("p");
    title.className = "title";
    title.textContent = t.title || "Termin";

    if (t.type) {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = t.type;
      title.appendChild(badge);
    }

    const meta = document.createElement("p");
    meta.className = "meta";

    const parts = [];
    const date = formatDateISO(t.date);
    const time = t.time ? `${t.time} Uhr` : "";
    const dt = [date, time].filter(Boolean).join(" · ");
    if (dt) parts.push(dt);
    if (t.location) parts.push(t.location);
    if (t.note) parts.push(t.note);

    meta.textContent = parts.join("\n");

    li.appendChild(title);
    li.appendChild(meta);
    return li;
  }

  function render(termine) {
    listEl.innerHTML = "";
    const items = Array.isArray(termine) ? termine : [];

    items.sort((a, b) => String(a?.date || "").localeCompare(String(b?.date || "")));

    if (items.length === 0) {
      emptyEl.hidden = false;
      emptyEl.textContent = "Keine Termine vorhanden.";
      return;
    }
    emptyEl.hidden = true;

    for (const t of items) {
      listEl.appendChild(createItem(t));
    }
  }

  async function loadTermine() {
    try {
      const res = await fetch("data/termine.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      render(data);
    } catch (e) {
      listEl.innerHTML = "";
      emptyEl.hidden = false;
      emptyEl.textContent = "Termine konnten nicht geladen werden.";
    }
  }

  function onReady() {
    btnReload?.addEventListener("click", loadTermine);
    loadTermine();
  }

  document.addEventListener("deviceready", onReady, false);
  if (!window.cordova) onReady();
})();