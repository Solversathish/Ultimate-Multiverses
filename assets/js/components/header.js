document.addEventListener("DOMContentLoaded", () => {

fetch("components/header.html")
.then(res => res.text())
.then(data => {

document.getElementById("headerContainer").innerHTML = data;

initSearch();

});

});


/* ================= SEARCH ================= */

async function initSearch(){

const input = document.getElementById("searchInput");
const results = document.getElementById("searchResults");

if(!input) return;

let database = [];

try{
database = await fetch("data/search-data.json")
.then(r=>r.json());
}catch(err){
console.error("Search data load error",err);
return;
}


/* INPUT */

input.addEventListener("input", () => {

const query = input.value.trim().toLowerCase();

if(query.length < 2){
results.style.display = "none";
return;
}

const filtered = database.filter(item =>
item.name.toLowerCase().includes(query)
).slice(0,15);

renderResults(filtered);

});


/* RENDER */

function renderResults(list){

if(list.length === 0){
results.style.display="none";
return;
}

let html="";

list.forEach(item => {

const img = getCDNImage(
item.id,
"thumb",
item.universe,
item.path || ""
);

/* LABEL */

let label = "";

if(item.type === "universe"){
label = "Universe";
}
else if(item.type === "category"){
label = item.parent || formatName(item.universe);
}
else{
label = item.parent || "";
}

html += `

<div class="search-item" data-url="${item.url}">

<img src="${img}" loading="lazy">

<div>

<div>${item.name}</div>
<div class="search-type">${label}</div>

</div>

</div>

`;

});

results.innerHTML = html;
results.style.display="block";


/* CLICK */

document.querySelectorAll(".search-item").forEach(el => {

el.onclick = () => {
window.location.href = el.dataset.url;
};

});

}

}

document.addEventListener("click", function(e){

  const searchBox = document.querySelector(".search-box");
  const results = document.getElementById("searchResults");

  if (!searchBox.contains(e.target)) {
    results.style.display = "none";
  }

});


/* HELPERS */

function formatName(str){

return str
.replace(/_/g," ")
.replace(/\b\w/g,c=>c.toUpperCase())
.trim();

}