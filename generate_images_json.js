// generate_images_json.js

const fs = require("fs");
const path = require("path");

// Location of the Media file
const MEDIA_DIR = path.join(__dirname, "Media");
const OUTPUT_FILE = path.join(__dirname, "images.json");

function walkDir(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walkDir(fullPath, fileList);
    } else if (entry.isFile()) {
      // Filter by common image extensions
       const lower = entry.name.toLowerCase();
       if (!lower.endsWith(".jpg") && !lower.endsWith(".jpeg") &&
           !lower.endsWith(".png") && !lower.endsWith(".gif") &&
           !lower.endsWith(".webp")) {
         continue;
       }
      // Build a web‐relative path
      const webPath = path
        .relative(__dirname, fullPath)
        .replace(/\\/g, "/");
      fileList.push(webPath);
    }
  }
  return fileList;
}

try {
  if (!fs.existsSync(MEDIA_DIR)) {
    console.error(`❌ Media folder not found at ${MEDIA_DIR}`);
    process.exit(1);
  }

  let allFiles = walkDir(MEDIA_DIR, []);
  allFiles.sort(); // make listing deterministic
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(allFiles, null, 2),
    "utf8"
  );
  console.log(`✅ Wrote ${allFiles.length} entries to ${OUTPUT_FILE}`);
} catch (err) {
  console.error("❌ Error generating images.json:", err);
  process.exit(1);
}
