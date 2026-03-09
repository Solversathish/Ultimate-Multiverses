let popupUniverse = "";
let popupPath = "";

document.addEventListener("DOMContentLoaded", () => {

  const popupContainer = document.getElementById("popupContainer");

  if(!popupContainer) return;

  fetch("components/popup.html")
  .then(res => res.text())
  .then(html => {

    popupContainer.innerHTML = html;

    const modal = document.getElementById("universeModal");
    const modalTitle = document.getElementById("modalTitle");
    const aboutBtn = document.getElementById("aboutBtn");
    const listBtn = document.getElementById("listBtn");
    const closeBtn = document.querySelector(".modal-close");

    window.openPopup = function(title, universe, path){

      popupUniverse = universe;
      popupPath = path || "";

      modalTitle.textContent = title;

      modal.style.display = "flex";

    }

    closeBtn.onclick = () => modal.style.display = "none";

    window.onclick = (e)=>{
      if(e.target === modal){
        modal.style.display = "none";
      }
    }

    aboutBtn.onclick = () => {

      if(popupPath){

        const levels = popupPath.split(",");
        const last = levels[levels.length-1];

        window.location.href =
        `entity.html?universe=${popupUniverse}&id=${last}`;

      }
      else{

        window.location.href =
        `entity.html?universe=${popupUniverse}&id=${popupUniverse}`;

      }

    }

    listBtn.onclick = () => {

      if(popupPath){

        window.location.href =
        `category.html?universe=${popupUniverse}&path=${popupPath}`;

      }
      else{

        window.location.href =
        `category.html?universe=${popupUniverse}`;

      }

    }

  });

});