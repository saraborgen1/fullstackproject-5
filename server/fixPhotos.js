const fs = require("fs");

const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));

db.photos = db.photos.map((photo) => ({
  ...photo,
  url: `https://picsum.photos/seed/photo-${photo.id}/600/400`,
  thumbnailUrl: `https://picsum.photos/seed/photo-${photo.id}/150/150`
}));

fs.writeFileSync("db.json", JSON.stringify(db, null, 2));

console.log("All photo URLs were replaced successfully!");