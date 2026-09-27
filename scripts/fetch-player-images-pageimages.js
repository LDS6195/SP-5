const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const players = require(path.join(root, "player-data.js"));
const manifestPath = path.join(root, "player-images.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const pending = players.filter((player) => !manifest[player.name]?.url);
const aliases = {
  "The Notorious B.I.G.": "Biggie Smalls",
  "Harriet Wheeler": "The Sundays"
};

async function main() {
  const query = new URLSearchParams({
    action: "query",
    titles: pending.map((player) => aliases[player.name.trim()] || player.name.trim()).join("|"),
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
  let matched = 0;
  for (const player of pending) {
    const lookupName = aliases[player.name.trim()] || player.name.trim();
    const target = redirects.get(lookupName) || lookupName;
    const page = pages.find((candidate) => candidate.title.toLowerCase() === target.toLowerCase());
    if (!page?.thumbnail?.source) continue;
    manifest[player.name] = {
      title: page.title,
      url: page.thumbnail.source,
      pageUrl: page.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replaceAll(" ", "_"))}`,
      source: "Wikipedia / Wikimedia Commons"
    };
    matched += 1;
  }
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Added ${matched} Wikipedia page-image matches from ${pending.length} unresolved players.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
