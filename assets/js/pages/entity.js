document.addEventListener("DOMContentLoaded", async () => {

const container = document.getElementById("entityContainer");
const galleryContainer = document.getElementById("galleryContainer");

const params = new URLSearchParams(window.location.search);

const universe = params.get("universe");
const entityId = params.get("id");
const path = params.get("path");

if(!universe || !entityId){
container.innerHTML="Invalid entity";
return;
}

let entity=null;
let entityList=[];

try{

/* --------- UNIVERSE ENTITY --------- */

const universes = await fetch("data/universes.json").then(r=>r.json());

const uni = universes.find(u=>u.id===entityId);

if(uni){
entity = uni;
entityList = universes;
}

/* --------- CATEGORY ENTITY --------- */

if(!entity){

const categories = await fetch(`data/${universe}/categories.json`)
.then(r=>r.json());

const cat = categories.find(c=>c.id===entityId);

if(cat){
entity = cat;
entityList = categories;
}

}

/* --------- DEEP LEVEL ENTITY --------- */

if(!entity){

let file;

/* decide which file to open */

if(path){

const levels = path.split(",");
file = levels[levels.length-1];

}else{

file = entityId;

}

const list = await fetch(`data/${universe}/${file}.json`)
.then(r=>r.json());

const found = list.find(i=>i.id===entityId);

if(found){
entity = found;
entityList = list;
}

}

}catch(err){
console.error(err);
}

if(!entity){
container.innerHTML="Entity not found";
return;
}

/* render */

createBreadcrumbs(universe,path,entity);
renderEntity(entity,universe,path);
renderGallery(entity);
renderNavigation(entityList,entityId,universe,path);

});



/* ================= BREADCRUMBS ================= */

function createBreadcrumbs(universe,path,entity){

const breadcrumbs = document.getElementById("breadcrumbs");

let html = `<a href="home.html">Home</a>`;

/* UNIVERSE */

if(entity.id === universe){

html += ` > <span>${formatName(universe)}</span>`;

}else{

html += ` > <a href="category.html?universe=${universe}">
${formatName(universe)}
</a>`;

}

/* PATH LEVELS */

if(path){

const levels = path.split(",");
let build = "";

levels.forEach((lvl,i)=>{

build = levels.slice(0,i+1).join(",");

html += ` > <a href="category.html?universe=${universe}&path=${build}">
${formatName(lvl)}
</a>`;

});

}

/* ENTITY NAME */

if(entity.id !== universe){

html += ` > <span>${entity.name}</span>`;

}

breadcrumbs.innerHTML = html;

}



/* ================= ENTITY PAGE ================= */

function renderEntity(entity,universe,path){

const container=document.getElementById("entityContainer");

let listURL="";

if(entity.type!=="entity"){

if(!path){
listURL=`category.html?universe=${universe}&path=${entity.id}`;
}
else{
listURL=`category.html?universe=${universe}&path=${path}`;
}

}

container.innerHTML=`

<div class="entity-main">

<div class="entity-hero">
<img src="${getCDNImage(entity.id,"hero",universe,path)}">
</div>

<div class="entity-details">

<h1 class="entity-name">${entity.name}</h1>

${generateInfoTable(entity.info)}

${generateTabs(entity)}

</div>

</div>

${entity.type!=="entity" ? `
<div class="view-list-wrapper">
<button onclick="window.location.href='${listURL}'">
View Full List of ${entity.name}
</button>
</div>
`:""}

<button id="scrollTopBtn">↑</button>

`;

document.getElementById("scrollTopBtn").onclick=()=>{
window.scrollTo({top:0,behavior:"smooth"});
};

}



/* ================= NAVIGATION ================= */

function renderNavigation(list,id,universe,path){

const nav=document.getElementById("entityNavigation");

const index=list.findIndex(i=>i.id===id);

if(index===-1) return;

const prev=list[index-1];
const next=list[index+1];

function buildURL(item){

if(!path){
return `entity.html?universe=${universe}&id=${item.id}`;
}

return `entity.html?universe=${universe}&path=${path}&id=${item.id}`;

}

nav.innerHTML=`

<div class="entity-navigation">

${prev ? `
<button onclick="window.location.href='${buildURL(prev)}'">
← ${prev.name}
</button>
` : `<div></div>`}

${next ? `
<button onclick="window.location.href='${buildURL(next)}'">
${next.name} →
</button>
` : `<div></div>`}

</div>

`;

}



/* ================= TABS ================= */

function generateTabs(entity){

if(!entity.tabs) return "";

return `

<div class="tabs">

<button onclick="showTab('tab1')">${entity.tabs.tab1.title}</button>
<button onclick="showTab('tab2')">${entity.tabs.tab2.title}</button>
<button onclick="showTab('tab3')">${entity.tabs.tab3.title}</button>

</div>

<div id="tab1" class="tab-content">${entity.tabs.tab1.content}</div>
<div id="tab2" class="tab-content" style="display:none">${entity.tabs.tab2.content}</div>
<div id="tab3" class="tab-content" style="display:none">${entity.tabs.tab3.content}</div>

`;

}

function showTab(id){

document.querySelectorAll(".tab-content")
.forEach(t=>t.style.display="none");

document.getElementById(id).style.display="block";

}



/* ================= INFO TABLE ================= */

function generateInfoTable(info){

if(!info) return "";

let html=`<div class="info-table">`;

Object.entries(info).forEach(([k,v])=>{

html+=`
<div class="info-row">
<div class="info-key">${k}</div>
<div class="info-value">${v}</div>
</div>
`;

});

html+=`</div>`;
return html;

}



/* ================= GALLERY ================= */

function renderGallery(entity){

const gallery=document.getElementById("galleryContainer");

if(!entity.gallery_count) return;

let images="";

for(let i=1;i<=entity.gallery_count;i++){

images+=`
<img src="${getCDNImage(entity.id,"gallery",entity.parent)}g${i}.png">
`;

}

gallery.innerHTML=`

<div class="gallery-container">

<h2>Gallery</h2>

<div class="gallery-grid">

${images}

</div>

</div>

`;

}



/* ================= HELPERS ================= */

function formatName(str){

return str
.replace(/_/g," ")
.replace(/\b\w/g,c=>c.toUpperCase())
.trim();

}