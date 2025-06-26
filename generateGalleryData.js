// generateMediaData.js
// Node.js script to scan the `Media` folder for event subfolders, extract media filenames,
// generate per-event JSON files (with year) and combine them into a single gallery-data.json.

const fs = require('fs');
const path = require('path');

// Debug: show current working directory
console.log('Current directory:', __dirname);

// Paths (adjust if needed)
const MEDIA_ROOT = path.join(__dirname, 'Gallery');      // Source media folders
const OUTPUT_DIR = path.join(__dirname, 'gallery-json'); // Individual JSON output
const COMBINED_FILE = path.join(__dirname, 'data/gallery-data.json'); // Combined JSON

// Supported extensions
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const VIDEO_EXTS = ['.mp4', '.webm', '.ogg'];

// 1) Ensure Media folder exists
if (!fs.existsSync(MEDIA_ROOT)) {
  console.error(`Error: Media folder not found at ${MEDIA_ROOT}`);
  process.exit(1);
}

// 2) Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

// 3) Scan event subfolders
const eventDirs = fs.readdirSync(MEDIA_ROOT, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

if (eventDirs.length === 0) {
  console.warn('No event subfolders found in Media folder. Exiting.');
  process.exit(0);
}

// Collect all event data
const allEvents = [];

eventDirs.forEach(eventName => {
  const eventDir = path.join(MEDIA_ROOT, eventName);

  // Derive event year from folder's creation time
  const stats = fs.statSync(eventDir);
  const year = new Date(stats.ctime).getFullYear();

  const rawFiles = fs.readdirSync(eventDir).filter(f => !f.startsWith('.'));

  const mediaEntries = rawFiles
    .map(f => ({
      name: f,
      ext: path.extname(f).toLowerCase()
    }))
    .filter(f => IMAGE_EXTS.includes(f.ext) || VIDEO_EXTS.includes(f.ext))
    .map(f => ({
      type: IMAGE_EXTS.includes(f.ext) ? 'image' : 'video',
      src: path.posix.join('Gallery', eventName, f.name)
    }));

  if (mediaEntries.length === 0) {
    console.warn(`Skipping '${eventName}': no supported media files found.`);
    return;
  }

  // Create per-event JSON (description left blank, include year)
  const eventData = {
    id: Math.floor(Math.random() * 1e6),
    title: eventName,
    description: '', // <-- Edit this manually in media-json/<eventName>.json
    year: year,
    media: mediaEntries
  };

  // Write individual JSON file
  const outPath = path.join(OUTPUT_DIR, `${eventName}.json`);
  fs.writeFileSync(outPath, JSON.stringify(eventData, null, 2));
  console.log(`Generated: ${outPath}`);

  allEvents.push(eventData);
});

// 4) Combine all events into one JSON
fs.writeFileSync(COMBINED_FILE, JSON.stringify(allEvents, null, 2));
console.log(`Combined gallery data written to: ${COMBINED_FILE}`);

console.log('Gallery-data generation complete.\nNext: Fill in descriptions in gallery-json/*.json if needed.');
