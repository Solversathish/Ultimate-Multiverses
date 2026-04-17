const fs = require("fs");

const dataFolder = "./data";
const searchData = [];

/* LOAD UNIVERSes */

const universes = JSON.parse(
fs.readFileSync(`${dataFolder}/universes.json`, "utf8")
);

/* ADD UNIVERSes */

universes.forEach(u => {

searchData.push({
name: u.name,
id: u.id,
type: "universe",
universe: u.id,
path: "",
parent: "",
url: `category.html?universe=${u.id}`
});

});

/* RECURSIVE FUNCTION */

function scan(universe, currentPath = "", parentName = "") {

  let filePath;

  if (currentPath === "") {

    // 🔥 FIX: handle different root types

    if (universe === "fruits") {
      filePath = `${dataFolder}/fruits/fruits.json`;

    } else if (universe === "mythical_creatures") {
      filePath = `${dataFolder}/mythical_creatures/mythical_creatures.json`;

    } else {
      filePath = `${dataFolder}/${universe}/categories.json`;
    }

  } else {

    const last = currentPath.split(",").pop();
    filePath = `${dataFolder}/${universe}/${last}.json`;

  }

  if (!fs.existsSync(filePath)) return;

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  data.forEach(item => {

    const newPath = currentPath
      ? `${currentPath},${item.id}`
      : item.id;

    /* CATEGORY */

    if (item.type === "category") {

      searchData.push({
        name: item.name,
        id: item.id,
        type: "category",
        universe: universe,
        path: currentPath,
        parent: parentName || universe,
        url: `category.html?universe=${universe}&path=${newPath}`
      });

      scan(universe, newPath, item.name);
    }

    /* ENTITY */

    if (item.type === "entity") {

      searchData.push({
        name: item.name,
        id: item.id,
        type: "entity",
        universe: universe,
        path: currentPath,
        parent: parentName || formatName(universe),
        url: `entity.html?universe=${universe}&path=${currentPath}&id=${item.id}`
      });
    }

  });

}

/* RUN */

universes.forEach(u => {

  if(u.id === "fruits"){

    const fruitsFile = `${dataFolder}/fruits/fruits.json`;

    if(fs.existsSync(fruitsFile)){

      const fruits = JSON.parse(fs.readFileSync(fruitsFile,"utf8"));

      fruits.forEach(item => {

        searchData.push({
          name: item.name,
          id: item.id,
          type: "entity",
          universe: "fruits",
          path: "",
          parent: "Fruits",
          url: `entity.html?universe=fruits&id=${item.id}`
        });

      });

    }

  }else{
    scan(u.id);
  }

});

/* SAVE */

fs.writeFileSync(
`${dataFolder}/search-data.json`,
JSON.stringify(searchData,null,2)
);

console.log("✅ Search data generated correctly");