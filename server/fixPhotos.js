const fs = require("fs");

const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));

db.photos = db.photos.map((photo) => ({
  ...photo,
  url: `https://picsum.photos/600/400?random=${photo.id}`,
  thumbnailUrl: `https://picsum.photos/150/150?random=${photo.id}`
}));

fs.writeFileSync("db.json", JSON.stringify(db, null, 2));

console.log("All photo URLs were replaced successfully!");