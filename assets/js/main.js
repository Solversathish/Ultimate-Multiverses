document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  if (!searchInput) return;

  fetch("data/search.json")
    .then(res => res.json())
    .then(data => {

      searchInput.addEventListener("input", () => {

        const value = searchInput.value.toLowerCase();
        searchResults.innerHTML = "";

        if (!value) {
          searchResults.style.display = "none";
          return;
        }

        const filtered = data.filter(item =>
          item.name.toLowerCase().includes(value) ||
          (item.tags && item.tags.join(" ").toLowerCase().includes(value))
        );

        filtered.slice(0, 10).forEach(item => {

          const div = document.createElement("div");
          div.className = "search-item";

          div.innerHTML = `
            <img src="${item.image}">
            <div>
              <div>${item.name}</div>
              <div class="search-type">${item.type}</div>
            </div>
          `;

          div.addEventListener("click", () => {
            window.location.href = item.url;
          });

          searchResults.appendChild(div);
        });

        searchResults.style.display =
          filtered.length > 0 ? "block" : "none";

      });

    });

});