const fs = require("fs");
const path = require("path");

const dataDir = "./data";
const outputFile = "./data/search-data.json";

let searchData = [];

const universes = fs.readdirSync(dataDir);

universes.forEach(universe => {

  const universePath = path.join(dataDir, universe);

  if(!fs.statSync(universePath).isDirectory()) return;

  const files = fs.readdirSync(universePath);

  files.forEach(file => {

    if(!file.endsWith(".json")) return;

    const filePath = path.join(universePath,file);
    const fileName = file.replace(".json","");

    const items = JSON.parse(fs.readFileSync(filePath,"utf8"));

    items.forEach(item => {

      searchData.push({

        name: item.name,
        id: item.id,
        type: item.type,

        universe: universe,
        path: fileName,

        url: `entity.html?universe=${universe}&path=${fileName}&id=${item.id}`

      });

    });

  });

});

fs.writeFileSync(outputFile, JSON.stringify(searchData,null,2));

console.log("Search database generated!");