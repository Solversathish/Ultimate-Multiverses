document.addEventListener("DOMContentLoaded", async () => {

  const params = new URLSearchParams(window.location.search);
  const universeId = params.get("universe");
  const worldId = params.get("world");
  const id = params.get("id");

  const data = await fetch(`data/${universeId}/entities.json`)
    .then(res => res.json());

  const entity = data.find(e => e.id === id);

  if (!entity) return;

  document.getElementById("entityName").textContent = entity.name;
  document.getElementById("entityHeroImage").src = entity.heroImage;

  document.getElementById("entityUniverse").textContent =
    `Universe: ${entity.universe}`;

  document.getElementById("entityWorld").textContent =
    `World: ${entity.world}`;

  document.getElementById("entityType").textContent =
    `Type: ${entity.type}`;

  document.getElementById("entityAge").textContent =
    `Age: ${entity.age}`;

  const tabContent = document.getElementById("tabContent");

  function loadTab(tab) {

    if (tab === "description") {
      tabContent.textContent = entity.description;
    }

    if (tab === "powers") {
      tabContent.textContent = entity.powers;
    }

    if (tab === "extra") {
      tabContent.textContent = entity.extra;
    }
  }

  document.querySelectorAll(".tab-buttons button")
    .forEach(btn => {
      btn.onclick = () => loadTab(btn.dataset.tab);
    });

  loadTab("description");

});