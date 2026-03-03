document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("entityContainer");
  const params = new URLSearchParams(window.location.search);
  const entityId = params.get("id");

  if (!entityId) {
    container.innerHTML = "<h2>Entity not found</h2>";
    return;
  }

  try {

    const universes = await fetch("data/universes.json")
      .then(res => res.json());

    let foundEntity = null;

    // 🔎 Search in every universe
    for (let universe of universes) {

      // 1️⃣ Check if direct entities.json exists (like fruits)
      try {
        const directEntities = await fetch(`data/${universe.id}/entities.json`)
          .then(res => res.json());

        foundEntity = directEntities.find(e => e.id === entityId);

        if (foundEntity) break;
      } catch {}

      // 2️⃣ Check worlds.json
      try {
        const worlds = await fetch(`data/${universe.id}/worlds.json`)
          .then(res => res.json());

        for (let world of worlds) {

          try {
            const worldEntities = await fetch(`data/${universe.id}/${world.id}.json`)
              .then(res => res.json());

            foundEntity = worldEntities.find(e => e.id === entityId);

            if (foundEntity) break;

          } catch {}
        }

        if (foundEntity) break;

      } catch {}
    }

    if (!foundEntity) {
      container.innerHTML = "<h2>Entity not found</h2>";
      return;
    }

    renderEntity(foundEntity);

  } catch (error) {
    console.error("Entity load error:", error);
    container.innerHTML = "<h2>Error loading entity</h2>";
  }

});


function renderEntity(entity) {

  const container = document.getElementById("entityContainer");

  container.innerHTML = `
    <div class="entity-layout">

      <!-- LEFT IMAGE -->
      <div class="entity-image">
        <img src="${entity.heroImage}" alt="${entity.name}">
      </div>

      <!-- RIGHT DETAILS -->
      <div class="entity-details">

        <h1>${entity.name}</h1>

        <div class="entity-tags">
          <span>${entity.category || "Unknown"}</span>
          <span>Age: ${entity.age || "Unknown"}</span>
        </div>

        <!-- TAB BUTTONS -->
        <div class="entity-tabs">
          <button class="tab-btn active" data-tab="description">Description</button>
          <button class="tab-btn" data-tab="powers">Powers</button>
          <button class="tab-btn" data-tab="extra">Extra</button>
        </div>

        <!-- CONTENT AREA -->
        <div class="entity-content" id="entityContent">
          ${entity.description || "No description available."}
        </div>

      </div>

    </div>
  `;

  setupTabs(entity);
}


function setupTabs(entity) {

  const buttons = document.querySelectorAll(".tab-btn");
  const content = document.getElementById("entityContent");

  buttons.forEach(btn => {

    btn.addEventListener("click", () => {

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const tab = btn.dataset.tab;

      if (tab === "description") {
        content.innerHTML = entity.description || "No description available.";
      }

      if (tab === "powers") {
        content.innerHTML = entity.powers || "No powers listed.";
      }

      if (tab === "extra") {
        content.innerHTML = entity.extra || "No extra information.";
      }

    });

  });

}