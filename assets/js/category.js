document.addEventListener("DOMContentLoaded", async function () {

  const container = document.getElementById("categoryContainer");
  const breadcrumbs = document.getElementById("breadcrumbs");
  const countElement = document.getElementById("categoryCount");
  const alphabetBar = document.getElementById("alphabetBar");
  const toggleBtn = document.getElementById("toggleImages");
  const sortSelect = document.getElementById("filterSelect");

  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id =
    params.get("id") ||
    params.get("universe") ||
    params.get("parent");

  if (!id) return;

  let data = [];

  try {

    // ================= LOAD UNIVERSES =================
    const universes = await fetch("data/universes.json")
      .then(res => res.json());

    // ================= CHECK IF UNIVERSE =================
    const universe = universes.find(u => u.id === id);

    if (universe) {

      data = await fetch(`data/${id}/worlds.json`)
        .then(res => res.json());

      if (breadcrumbs) {
        breadcrumbs.innerHTML =
          `<a href="home.html">Home</a> > ${universe.name}`;
      }

    } else {

      // ================= CHECK IF WORLD =================
      for (let u of universes) {

        const worlds = await fetch(`data/${u.id}/worlds.json`)
          .then(res => res.json())
          .catch(() => []);

        const world = worlds.find(w => w.id === id);

        if (world) {

          data = await fetch(`data/${u.id}/${id}.json`)
            .then(res => res.json());

          if (breadcrumbs) {
            breadcrumbs.innerHTML = `
              <a href="home.html">Home</a> >
              <a href="category.html?id=${u.id}">${u.name}</a> >
              ${world.name}
            `;
          }

          break;
        }
      }
    }

    // ================= IF EMPTY =================
    if (!data || data.length === 0) {
      container.innerHTML =
        "<p style='color:white'>No data found.</p>";
      return;
    }

    render(data);
    generateAlphabet(data);
    updateCount(data.length);

  } catch (error) {
    console.error("Category error:", error);
  }

  // ================= TOGGLE =================
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      container.classList.toggle("hide-images");
      toggleBtn.textContent =
        container.classList.contains("hide-images")
          ? "Show Images"
          : "Hide Images";
    });
  }

  // ================= SORT =================
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      let sorted = [...data];

      if (sortSelect.value === "az")
        sorted.sort((a, b) => a.name.localeCompare(b.name));

      if (sortSelect.value === "za")
        sorted.sort((a, b) => b.name.localeCompare(a.name));

      render(sorted);
    });
  }

});


// ================= RENDER =================
function render(items) {

  const container = document.getElementById("categoryContainer");
  container.innerHTML = "";

  items.forEach(item => {

    const card = document.createElement("div");
    card.className = "card";
    card.id = item.id;

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${item.image || item.thumbnail || ''}" alt="${item.name}">
      </div>
      <div class="card-title">${item.name}</div>
    `;

    card.addEventListener("click", () => {

      if (item.type === "entity") {
        window.location.href = `entity.html?id=${item.id}`;
      } else {
        window.location.href = `category.html?id=${item.id}`;
      }

    });

    container.appendChild(card);
  });

}


// ================= COUNT =================
function updateCount(total) {
  const el = document.getElementById("categoryCount");
  if (el) el.textContent = `${total} Items`;
}


// ================= ALPHABET =================
function generateAlphabet(items) {

  const bar = document.getElementById("alphabetBar");
  if (!bar) return;

  bar.innerHTML = "";

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  letters.forEach(letter => {

    const btn = document.createElement("button");
    btn.className = "alphabet-btn";
    btn.textContent = letter;

    btn.addEventListener("click", () => {

      const match = items.find(item =>
        item.name.toUpperCase().startsWith(letter)
      );

      if (match) {
        document.getElementById(match.id)
          ?.scrollIntoView({ behavior: "smooth" });
      }

    });

    bar.appendChild(btn);
  });

}