function getEntityFromURL() {
  const path = window.location.pathname;

  // Example: /anime/naruto/naruto-uzumaki/
  const parts = path.split("/").filter(Boolean);

  return parts[parts.length - 1]; // naruto-uzumaki
}

// convert slug → id
function slugToId(slug){
  return slug.replace(/-/g, "_");
}