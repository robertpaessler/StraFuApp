(function () {

  const futureList = document.getElementById("futureList");
  const pastList = document.getElementById("pastList");

  function createItem(t) {
    const li = document.createElement("li");
    li.className = "item";

    li.innerHTML = `
      <p class="title">${t.title}</p>
      <p class="meta">${t.date} · ${t.location}</p>
    `;

    return li;
  }

  function render(termine) {
    const now = new Date();

    futureList.innerHTML = "";
    pastList.innerHTML = "";

    termine.forEach(t => {
      const date = new Date(t.date);

      if (date >= now) {
        futureList.appendChild(createItem(t));
      } else {
        pastList.appendChild(createItem(t));
      }
    });
  }

  async function loadTermine() {
    const res = await fetch("data/termine.json");
    const data = await res.json();
    render(data);
  }

  // Dummy Login
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Login wird später implementiert.");
  });

  loadTermine();

})();