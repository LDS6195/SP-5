const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const players = require(path.join(root, "player-data.js"));
const manifestPath = path.join(root, "player-images.json");
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};
const missingPlayers = players.filter((player) => !manifest[player.name]?.url);
const endpoint = "https://query.wikidata.org/sparql";
const aliases = {
  "Richard the Lionheart": "Richard I of England",
  "Niccolo Machiavelli": "Niccolò Machiavelli",
  "Steph Curry": "Stephen Curry",
  "Alex Ovechkin": "Alexander Ovechkin",
  "Luka Doncic": "Luka Dončić",
  "Nikola Jokic": "Nikola Jokić",
  "Peja Stojakovic": "Peja Stojaković",
  "Novak Djokovic": "Novak Đoković",
  "Jaromir Jagr": "Jaromír Jágr",
  "OJ Simpson": "O. J. Simpson",
  "Kylian Mbappe": "Kylian Mbappé",
  "\"Stone Cold\" Steve Austin": "Steve Austin",
  "Andre the Giant": "André the Giant",
  "Anthony Munoz": "Anthony Muñoz",
  "Quinton \"Rampage\" Jackson": "Quinton Jackson",
  "Zydrunas Savickas": "Žydrūnas Savickas",
  "Hafthor \"The Mountain\" Bjornsson": "Hafþór Júlíus Björnsson",
  "Zdeno Chara": "Zdeno Chára",
  "Butterbean": "Eric Esch",
  "Dwayne \"The Rock\" Johnson": "Dwayne Johnson",
  "Batista": "Dave Bautista",
  "\"Mean\" Joe Greene": "Joe Greene",
  "Salvador Dali": "Salvador Dalí",
  "Paul Cezanne": "Paul Cézanne",
  "Rene Magritte": "René Magritte",
  "Beyonce": "Beyoncé",
  "Bjork": "Björk",
  "The Notorious B.I.G.": "Biggie Smalls",
  "Harriet Wheeler": "The Sundays"
};

function sparqlLiteral(value) {
  return `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"@en`;
}

function commonsImageUrl(filename) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename.replaceAll(" ", "_"))}?width=320`;
}

async function fetchBatch(batch) {
  const lookupNames = batch.flatMap((player) => [player.name.trim(), aliases[player.name.trim()]].filter(Boolean));
  const values = [...new Set(lookupNames)].map(sparqlLiteral).join(" ");
  const query = `SELECT ?label ?image WHERE { VALUES ?label { ${values} } ?person (rdfs:label|skos:altLabel) ?label . ?person wdt:P18 ?image . FILTER(LANG(?label) = "en") }`;
  const url = `${endpoint}?query=${encodeURIComponent(query)}&format=json`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": "ProxyLeague/0.1 (local prototype)"
    }
  });
  if (!response.ok) throw new Error(`Wikidata HTTP ${response.status}`);
  const data = await response.json();
  return data.results.bindings;
}

async function main() {
  if (!missingPlayers.length) {
    console.log("No unresolved players remain.");
    return;
  }
  let matched = 0;
  for (let offset = 0; offset < missingPlayers.length; offset += 80) {
    const batch = missingPlayers.slice(offset, offset + 80);
    const results = await fetchBatch(batch);
    const displayNames = new Map(batch.flatMap((player) => {
      const displayName = player.name;
      return [[displayName.trim(), displayName], [aliases[displayName.trim()], displayName]].filter(([lookupName]) => lookupName);
    }));
    for (const result of results) {
      const name = displayNames.get(result.label.value);
      if (!name || manifest[name]?.url) continue;
      const filename = result.image.value.split("/Special:FilePath/").pop() || result.image.value.split("/wiki/").pop();
      manifest[name] = {
        title: filename.replaceAll("_", " "),
        url: commonsImageUrl(decodeURIComponent(filename)),
        pageUrl: result.image.value,
        source: "Wikidata / Wikimedia Commons"
      };
      matched += 1;
    }
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    console.log(`Batch ${offset + 1}-${offset + batch.length}/${missingPlayers.length}: ${results.length} image claims`);
  }
  console.log(`Added ${matched} Wikidata image matches.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
