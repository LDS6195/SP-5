const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const playerDataPath = path.join(root, "player-data.js");
const outputPath = path.join(root, "player-images.json");
const players = require(playerDataPath);
const existing = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, "utf8")) : {};
const refresh = process.argv.includes("--refresh");
const delayMs = 180;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWikipediaImages(names) {
  const query = new URLSearchParams({
    action: "query",
    titles: names.join("|"),
    prop: "pageimages|info",
    piprop: "thumbnail",
    pithumbsize: "320",
    inprop: "url",
    redirects: "1",
    format: "json",
    origin: "*"
  });
  const response = await fetch(`https://en.wikipedia.org/w/api.php?${query}`, {
    headers: { "User-Agent": "ProxyLeague/0.1 (local prototype)" }
  });
  if (!response.ok) throw new Error(`Wikipedia HTTP ${response.status}`);
  const data = await response.json();
  const redirects = new Map((data.query?.redirects || []).map((redirect) => [redirect.from, redirect.to]));
  const pages = Object.values(data.query?.pages || {});
  return Object.fromEntries(names.map((name) => {
    const title = redirects.get(name) || name;
    const page = pages.find((candidate) => candidate.title.toLowerCase() === title.toLowerCase());
    if (!page || page.missing !== undefined || !page.thumbnail?.source) return [name, null];
    return [name, {
      title: page.title,
      url: page.thumbnail.source,
      pageUrl: page.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replaceAll(" ", "_"))}`,
      source: "Wikipedia / Wikimedia Commons"
    }];
  }));
}

async function main() {
  let matched = 0;
  let missing = 0;
  const pending = players.filter((player) => refresh || !existing[player.name]?.url);
  for (let offset = 0; offset < pending.length; offset += 40) {
    const batch = pending.slice(offset, offset + 40);
    try {
      const images = await fetchWikipediaImages(batch.map((player) => player.name));
      batch.forEach((player, batchIndex) => {
        const image = images[player.name];
        existing[player.name] = image;
        if (image) {
          matched += 1;
          console.log(`[${offset + batchIndex + 1}/${pending.length}] ${player.name} -> ${image.title}`);
        } else {
          missing += 1;
          console.log(`[${offset + batchIndex + 1}/${pending.length}] ${player.name} -> no thumbnail`);
        }
      });
    } catch (error) {
      batch.forEach((player) => {
        existing[player.name] = existing[player.name]?.url ? existing[player.name] : null;
        missing += 1;
      });
      console.warn(`[${offset + 1}-${offset + batch.length}/${pending.length}] ${error.message}`);
    }
    fs.writeFileSync(outputPath, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
    await wait(delayMs);
  }
  fs.writeFileSync(outputPath, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
  console.log(`Fetched ${matched} thumbnails; ${missing} players will use fallback portraits.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
