document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("entityContainer");
  const galleryContainer = document.getElementById("galleryContainer");
  const breadcrumbs = document.getElementById("breadcrumbs");

  const params = new URLSearchParams(window.location.search);
  const universeId = params.get("universe");
  const entityId = params.get("id");

  if (!universeId || !entityId) {
    container.innerHTML = "<p style='color:white'>Invalid entity.</p>";
    return;
  }

  try {

    const database = await fetch(`data/${universeId}.json`)
      .then(res => res.json());

    const entity = database.find(item => item.id === entityId);

    if (!entity) {
      container.innerHTML = "<p style='color:white'>Entity not found.</p>";
      return;
    }

    createBreadcrumbs(universeId, entity);
    renderEntity(entity);
    renderGallery(entity);

  } catch (error) {

    console.error(error);
    container.innerHTML = "<p style='color:white'>Error loading entity.</p>";

  }

});



/* ================= BREADCRUMBS ================= */

function createBreadcrumbs(universeId, entity){

  const breadcrumbs = document.getElementById("breadcrumbs");

  if(!breadcrumbs) return;

  breadcrumbs.innerHTML = `
  <a href="home.html">Home</a> >
  <a href="category.html?universe=${universeId}">
  ${capitalize(universeId)}
  </a> >
  <span>${entity.name}</span>
  `;

}



/* ================= ENTITY MAIN ================= */

function renderEntity(entity) {

  const container = document.getElementById("entityContainer");

  const tabs = [];
  const contents = {};

  if(entity.description){
    tabs.push("Description");
    contents["Description"] = entity.description;
  }

  if(entity.powers){
    tabs.push("Powers");
    contents["Powers"] = entity.powers;
  }

  if(entity.extra){
    tabs.push("Extra");
    contents["Extra"] = entity.extra;
  }

  if(entity.biography){
    tabs.push("Biography");
    contents["Biography"] = entity.biography;
  }

  if(entity.stats){
    tabs.push("Career Stats");
    contents["Career Stats"] = JSON.stringify(entity.stats, null, 2);
  }

  if(entity.achievements){
    tabs.push("Achievements");
    contents["Achievements"] = entity.achievements.join("<br>");
  }

  if(entity.nutrition){
    tabs.push("Nutrition");
    contents["Nutrition"] = JSON.stringify(entity.nutrition, null, 2);
  }

  if(entity.benefits){
    tabs.push("Benefits");
    contents["Benefits"] = entity.benefits.join("<br>");
  }


  const tabButtons = tabs.map((tab,i)=>`
  <button class="tab-btn ${i===0?"active":""}" data-tab="${tab}">
  ${tab}
  </button>
  `).join("");

  const firstContent = contents[tabs[0]] || "";

  container.innerHTML = `

  <div class="entity-main">

    <div class="entity-hero">
      <img src="${entity.heroImage || entity.thumbnail || ''}">
    </div>

    <div class="entity-details">

      <h1 class="entity-name">${entity.name}</h1>

      ${generateInfoTable(entity.info)}

      <div class="tab-buttons">
        ${tabButtons}
      </div>

      <div class="tab-content" id="tabContent">
        ${firstContent}
      </div>

    </div>

  </div>

  `;

  setupTabs(contents);

}



/* ================= INFO TABLE ================= */

function generateInfoTable(info){

  if(!info) return "";

  let html = `<div class="info-table">`;

  Object.entries(info).forEach(([key,value]) => {

    html += `
      <div class="info-row">
        <div class="info-key">${key}</div>
        <div class="info-value">${value}</div>
      </div>
    `;

  });

  html += `</div>`;

  return html;

}



/* ================= GALLERY ================= */

function renderGallery(entity){

  const galleryContainer = document.getElementById("galleryContainer");

  if(!entity.gallery) return;

  galleryContainer.innerHTML = `

  <div class="gallery-container">

  <h2>Gallery</h2>

  <div class="gallery-grid">

  ${entity.gallery.map(img=>`
  <img src="${img}">
  `).join("")}

  </div>

  </div>

  `;

}



/* ================= TABS ================= */

function setupTabs(contents){

  const buttons = document.querySelectorAll(".tab-btn");
  const content = document.getElementById("tabContent");

  buttons.forEach(btn=>{

    btn.addEventListener("click",()=>{

      buttons.forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");

      const tab = btn.dataset.tab;

      content.innerHTML = contents[tab];

    });

  });

}



/* ================= HELPER ================= */

function capitalize(str){
  return str.charAt(0).toUpperCase()+str.slice(1);
}