document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("entityContainer");

  const params = new URLSearchParams(window.location.search);
  const universeId = params.get("universe");
  const entityId = params.get("id");

  if (!universeId || !entityId) {
    container.innerHTML = "<p style='color:white'>Invalid entity.</p>";
    return;
  }

  let database = [];

  try {
    database = await fetch(`data/${universeId}.json`)
      .then(res => {
        if (!res.ok) throw new Error("Universe file not found");
        return res.json();
      });
  } catch (err) {
    container.innerHTML = "<p style='color:white'>Data not found.</p>";
    return;
  }

  const entity = database.find(item => item.id === entityId);

  if (!entity) {
    container.innerHTML = "<p style='color:white'>Entity not found.</p>";
    return;
  }

  renderEntity(entity);

});


function renderEntity(entity) {

  const container = document.getElementById("entityContainer");

  container.innerHTML = `
    <div class="entity-container">

      <div class="entity-image">
        <img src="${entity.heroImage || entity.thumbnail || entity.image || ''}">
      </div>

      <div class="entity-details">

        <h1>${entity.name}</h1>

        <div class="entity-meta">
          ${entity.category ? `<div class="meta-box">${entity.category}</div>` : ""}
          ${entity.age ? `<div class="meta-box">Age: ${entity.age}</div>` : ""}
        </div>

        <div class="tab-buttons">
          <button class="tab-btn active" data-tab="desc">Description</button>
          <button class="tab-btn" data-tab="powers">Powers</button>
          <button class="tab-btn" data-tab="extra">Extra</button>
        </div>

        <div class="tab-content" id="tabContent">
          ${entity.description || "No description available."}
        </div>

      </div>

    </div>
  `;

  setupTabs(entity);
}


function setupTabs(entity) {

  const buttons = document.querySelectorAll(".tab-btn");
  const content = document.getElementById("tabContent");

  buttons.forEach(btn => {

    btn.addEventListener("click", () => {

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const tab = btn.getAttribute("data-tab");

      if (tab === "desc") {
        content.innerHTML = entity.description || "No description.";
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