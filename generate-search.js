const fs = require("fs");

const dataFolder = "./data";
const searchData = [];

/* LOAD UNIVERSES */

const universes = JSON.parse(
fs.readFileSync(`${dataFolder}/universes.json`, "utf8")
);

/* UNIVERSE LEVEL */

universes.forEach(u => {

searchData.push({
name: u.name,
id: u.id,
type: "universe",
url: `category.html?universe=${u.id}`
});

});

/* SCAN UNIVERSE FOLDERS */

universes.forEach(u => {

const folder = `${dataFolder}/${u.id}`;

if(!fs.existsSync(folder)) return;

const files = fs.readdirSync(folder);

files.forEach(file => {

if(!file.endsWith(".json")) return;

const fileName = file.replace(".json","");
const data = JSON.parse(
fs.readFileSync(`${folder}/${file}`,"utf8")
);

data.forEach(item => {

/* CATEGORY */

if(item.type === "category"){

let path = fileName === "categories"
? item.id
: `${fileName},${item.id}`;

searchData.push({
name: item.name,
id: item.id,
universe: u.id,
parent: fileName.replace(/_/g," "),
type: "category",
url: `category.html?universe=${u.id}&path=${path}`
});

}

/* ENTITY */

if(item.type === "entity"){

searchData.push({
name: item.name,
id: item.id,
universe: u.id,
parent: fileName.replace(/_/g," "),
type: "entity",
url: `entity.html?universe=${u.id}&path=${fileName}&id=${item.id}`
});

}

});

});

});

/* SAVE */

fs.writeFileSync(
`${dataFolder}/search-data.json`,
JSON.stringify(searchData,null,2)
);

console.log("Search data generated successfully");