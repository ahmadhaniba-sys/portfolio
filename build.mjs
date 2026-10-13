import { copyFileSync, linkSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";

const OUT = "dist";
const FILES = ["index.html", "main.js", "styles.css", "_headers"];
const MAX_BYTES = 25 * 1024 * 1024;

function place(from, to) {
  try {
    linkSync(from, to);
  } catch {
    copyFileSync(from, to);
  }
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(`${OUT}/clips`, { recursive: true });

for (const file of FILES) place(file, `${OUT}/${file}`);

const sizes = {};
const tooBig = [];
for (const name of readdirSync("clips")) {
  if (!name.endsWith(".mp4")) continue;
  const path = `clips/${name}`;
  const { size } = statSync(path);
  if (size > MAX_BYTES) {
    tooBig.push(name);
    continue;
  }
  place(path, `${OUT}/${path}`);
  sizes[name] = size;
}

if (tooBig.length) {
  console.error(`Over Cloudflare's 25 MiB file limit: ${tooBig.join(", ")}`);
  process.exit(1);
}

writeFileSync("clip-sizes.json", `${JSON.stringify(sizes, null, 2)}\n`);
