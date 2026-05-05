const fs = require("fs");

const BASE_URL = "https://jsonplaceholder.typicode.com";

async function loadData() {
  const resources = ["users", "todos", "posts", "comments", "albums", "photos"];
  const db = {};

  for (const resource of resources) {
    const response = await fetch(`${BASE_URL}/${resource}`);
    db[resource] = await response.json();
  }

  db.photos = db.photos.map((photo) => ({
    ...photo,
    url: `https://picsum.photos/600/400?random=${photo.id}`,
    thumbnailUrl: `https://picsum.photos/150/150?random=${photo.id}`
  }));

  fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
  console.log("db.json created successfully!");
}

loadData();