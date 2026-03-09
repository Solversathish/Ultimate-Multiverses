document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("homeContainer");
  const countElement = document.getElementById("homeCount");

  const modal = document.getElementById("universeModal");
  const modalTitle = document.getElementById("modalTitle");
  const aboutBtn = document.getElementById("aboutBtn");
  const listBtn = document.getElementById("listBtn");
  const closeBtn = document.querySelector(".modal-close");

  let currentUniverse = "";

  let universes = [];

  try {

    universes = await fetch("data/universes.json")
      .then(res => res.json());

  } catch (err) {

    console.error("Universe load error", err);

  }

  let currentPage = 1;
  const itemsPerPage = 60;

  // OPEN POPUP
  function openUniverseModal(universe){

    currentUniverse = universe;

    modalTitle.textContent =
      universe.charAt(0).toUpperCase() + universe.slice(1);

    modal.style.display = "flex";

  }

  // CLOSE BUTTON
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // CLICK OUTSIDE MODAL
  window.addEventListener("click", (e) => {
    if(e.target === modal){
      modal.style.display = "none";
    }
  });

  // ABOUT BUTTON
  aboutBtn.addEventListener("click", () => {

    window.location.href =
      `entity.html?universe=${currentUniverse}&id=${currentUniverse}`;

  });

  // LIST BUTTON
  listBtn.addEventListener("click", () => {

    window.location.href =
      `category.html?universe=${currentUniverse}`;

  });


  function renderPage() {

    container.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const pageItems = universes.slice(start, end);

    pageItems.forEach(item => {

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="image-wrapper">
          <img src="${item.image}">
        </div>
        <div class="card-title">${item.name}</div>
      `;

      // 👇 THIS OPENS POPUP
      card.addEventListener("click", () => {

        openUniverseModal(item.id);

      });

      container.appendChild(card);

    });

  }


  function createPagination() {

    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const totalPages =
      Math.ceil(universes.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {

      const btn = document.createElement("button");
      btn.textContent = i;

      if (i === currentPage)
        btn.classList.add("active-page");

      btn.addEventListener("click", () => {

        currentPage = i;
        renderPage();
        createPagination();

        window.scrollTo({
          top:0,
          behavior:"smooth"
        });

      });

      pagination.appendChild(btn);

    }

  }


  renderPage();
  createPagination();

  if (countElement)
    countElement.textContent = `${universes.length} items`;

});