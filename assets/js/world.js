document.addEventListener("DOMContentLoaded", async () => {

  const params = new URLSearchParams(window.location.search);
  const universeId = params.get("universe");
  const worldId = params.get("world");

  const container = document.getElementById("worldContainer");
  const alphabetBar = document.getElementById("alphabetBar");
  const breadcrumbs = document.getElementById("breadcrumbs");
  const countElement = document.getElementById("worldCount");
  const toggleBtn = document.getElementById("toggleImages");
  const sortSelect = document.getElementById("filterSelect");

  if (!universeId || !worldId) return;

  let allItems = [];
  let currentPage = 1;
  const perPage = 36;

  try {

    const entities = await fetch(`data/${universeId}/${worldId}.json`)
      .then(res => res.json());

    // Filter by world
    allItems = entities.filter(e => e.world === worldId);

    render();
    generateAlphabet();
    updateBreadcrumb();
    updateCount();

  } catch (err) {
    console.error("World page error:", err);
  }

  // ================= RENDER =================

  function render() {

    container.innerHTML = "";

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    const pageItems = allItems.slice(start, end);

    pageItems.forEach(entity => {

      const card = document.createElement("div");
      card.className = "card";
      card.id = entity.id;

      card.innerHTML = `
        <div class="image-wrapper">
          <img src="${entity.thumbnail}">
        </div>
        <div class="card-title">${entity.name}</div>
      `;

      card.onclick = () => {
        window.location.href =
          `entity.html?universe=${universeId}&world=${worldId}&id=${entity.id}`;
      };

      container.appendChild(card);
    });

    renderPagination();
  }

  // ================= PAGINATION =================

  function renderPagination() {

    let pagination = document.getElementById("pagination");

    if (!pagination) {
      pagination = document.createElement("div");
      pagination.id = "pagination";
      pagination.className = "pagination";
      container.parentNode.appendChild(pagination);
    }

    pagination.innerHTML = "";

    const total = Math.ceil(allItems.length / perPage);

    for (let i = 1; i <= total; i++) {

      const btn = document.createElement("button");
      btn.textContent = i;

      if (i === currentPage) {
        btn.style.background = "#00ff88";
        btn.style.color = "black";
      }

      btn.onclick = () => {
        currentPage = i;
        render();
      };

      pagination.appendChild(btn);
    }
  }

  // ================= SORT =================

  sortSelect.addEventListener("change", () => {

    if (sortSelect.value === "az") {
      allItems.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortSelect.value === "za") {
      allItems.sort((a, b) => b.name.localeCompare(a.name));
    }

    currentPage = 1;
    render();
  });

  // ================= TOGGLE IMAGES =================

  toggleBtn.onclick = () => {

    container.classList.toggle("hide-images");

    toggleBtn.textContent =
      container.classList.contains("hide-images")
        ? "Show Images"
        : "Hide Images";
  };

  // ================= ALPHABET =================

  function generateAlphabet() {

    alphabetBar.innerHTML = "";

    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(letter => {

      const btn = document.createElement("button");
      btn.className = "alphabet-btn";
      btn.textContent = letter;

      btn.onclick = () => {

        const index = allItems.findIndex(item =>
          item.name.toUpperCase().startsWith(letter)
        );

        if (index !== -1) {
          currentPage = Math.floor(index / perPage) + 1;
          render();
        }
      };

      alphabetBar.appendChild(btn);
    });
  }

  // ================= BREADCRUMB =================

  function updateBreadcrumb() {
    breadcrumbs.innerHTML =
      `<a href="home.html">Home</a> >
       <a href="universe.html?universe=${universeId}">
       ${universeId}</a> > ${worldId}`;
  }

  function updateCount() {
    countElement.textContent = `${allItems.length} Items`;
  }

});