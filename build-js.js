// build-js.js
const fs = require("fs");
const path = require("path");

const JS_DIR = path.join(__dirname, "JS");
const OUT_DIR = path.join(__dirname, "dist");

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

// QUAN TRỌNG: thứ tự này PHẢI khớp chính xác với thứ tự
// các thẻ <script> hiện có trong index.html
const desktopOrder = [
  "description.js",
  "sticky-scroll.js",
  "play-button.js",
  "follow-button.js",
  "add-to-playlist.js",
  "see-more.js",
  "carousel.js",
  "x-about.js",
  "hide-about.js",
  "play-progress.js",
  "volume.js",
  "marquee.js",
  "mv-data.js",
  "tracks.js",
  "shuffle-repeat.js",
  "next-song.js",
  "mini-player.js",
  "lyrics-data.js",
  "lyrics.js",
  "queue.js",
  "mv.js",
];

// Thứ tự này khớp với mobile.html
const mobileOrder = [
  "description.js",
  "play-button.js",
  "follow-button.js",
  "add-to-playlist.js",
  "carousel.js",
  "x-about.js",
  "hide-about.js",
  "play-progress.js",
  "marquee.js",
  "tracks-mobile.js",
  "shuffle-repeat.js",
  "media-session.js",
  "next-song.js",
  "lyrics-data.js",
  "lyrics.js",
  "queue.js",
];

function bundle(fileList, outName) {
  const content = fileList
    .map((name) => {
      const code = fs.readFileSync(path.join(JS_DIR, name), "utf8");
      return `/* ---- ${name} ---- */\n${code}`;
    })
    .join("\n\n");

  fs.writeFileSync(path.join(OUT_DIR, outName), content, "utf8");
  console.log(`✔ ${outName} — gộp ${fileList.length} file`);
}

bundle(desktopOrder, "bundle.js");
bundle(mobileOrder, "bundle-mobile.js");
