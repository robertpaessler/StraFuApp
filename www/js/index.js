(function () {
  const menuToggle = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");
  const listEl = document.getElementById("termineList");
  const emptyEl = document.getElementById("termineEmpty");
  const btnReload = document.getElementById("btnReload");
  const toTopBtn = document.getElementById("toTopBtn");

  function initMenu() {
	  if (!menuToggle || !sideMenu) return;

	  // Menü öffnen/schließen
	  menuToggle.addEventListener("click", () => {
		sideMenu.classList.toggle("open");
	  });

	  // Menü schließen bei Klick auf Link
	  sideMenu.querySelectorAll("a").forEach(link => {
		link.addEventListener("click", () => {
		  sideMenu.classList.remove("open");
		});
	  });
	}
  
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

    items.sort((a, b) =>
      String(a?.date || "").localeCompare(String(b?.date || ""))
    );

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

  function initScrollToTop() {
    if (!toTopBtn) return;

    // Button initial verstecken
    toTopBtn.style.display = "none";

    // Anzeigen / Ausblenden beim Scrollen
    window.addEventListener("scroll", () => {
      if (window.scrollY > 200) {
        toTopBtn.style.display = "block";
      } else {
        toTopBtn.style.display = "none";
      }
    });

    // Klick → nach oben scrollen
    toTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  function onReady() {
    btnReload?.addEventListener("click", loadTermine);

    initScrollToTop();
	initMenu();

    loadTermine();
  }

  document.addEventListener("deviceready", onReady, false);
  if (!window.cordova) onReady();
})();