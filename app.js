let selectedFranchiseIndex = 7;
let selectedConference = "Americas";
let draftSession = window.ProxyDraft.createDraft(window.PROXY_PLAYER_POOL, { userTeamIndex: selectedFranchiseIndex, seed: 3000 });
let userDraftTeam = draftSession.state.teams[draftSession.state.userTeamIndex];
const starterSlots = ["General", "Bruiser", "Bruiser", "Runner", "Runner", "Cannon", "Cannon", "Visual", "Musical"];
const strategySlotOrder = ["General", "Bruiser", "Bruiser", "Runner", "Runner", "Cannon", "Cannon", "Visual", "Musical"];
const benchSlots = ["Cannon", "Runner", "Bruiser"];
const USER_PICK_SECONDS = 180;
const roleImages = {
  General: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=82",
  Cannon: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=900&q=82",
  Runner: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=82",
  Bruiser: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=900&q=82",
  Visual: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=82",
  Musical: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=82"
};
const blankPlayerSilhouette = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 420"><rect width="320" height="420" fill="#d8c7aa"/><circle cx="160" cy="135" r="62" fill="#7d8179"/><path d="M48 420c7-94 51-151 112-151s105 57 112 151" fill="#7d8179"/><path d="M81 420c13-68 39-105 79-105s66 37 79 105" fill="#626860" opacity=".6"/></svg>`)}`;
const roleDisplayNames = { Visual: "Visual Signaler", Musical: "Sonic Signaler" };
const roleShortLabels = { Visual: "V-SIG", Musical: "S-SIG" };
function displayRole(role) {
  return roleDisplayNames[role] || role;
}
function roleLineLabel(player) {
  const primary = player?.primaryRole || player?.role;
  if (!primary) return "Player";
  const flex = player.flexRoles || [];
  const label = (role) => roleShortLabels[role] || role;
  if (flex.length > 1) return `${label(primary)} / Flex`;
  if (flex.length === 1) return `${label(primary)} / ${label(flex[0])}`;
  return displayRole(primary);
}
function shortRole(role) {
  return roleShortLabels[role] || role.slice(0, 3).toUpperCase();
}
function playerImage(player) {
  return player?.image?.url || blankPlayerSilhouette;
}
const roleAttributeLabels = {
  General: [["Tactical IQ", "tacticalIQ"], ["Leadership", "leadership"], ["Awareness", "awareness"], ["Composure", "composure"]],
  Cannon: [["Precision", "precision"], ["Range", "range"], ["Power", "power"], ["Composure", "composure"]],
  Runner: [["Speed", "speed"], ["Agility", "agility"], ["Evasion", "evasion"], ["Handling", "handling"]],
  Bruiser: [["Strength", "strength"], ["Resilience", "resilience"], ["Defense", "defense"], ["Power", "power"]],
  Visual: [["Visual Signal", "visualCommunication"], ["Creativity", "creativity"], ["Awareness", "awareness"], ["Coordination", "coordination"]],
  Musical: [["Sonic Signal", "sonicCommunication"], ["Coordination", "coordination"], ["Creativity", "creativity"], ["Composure", "composure"]]
};
const draftAttributeOrders = {
  All: ["speed", "strength", "precision", "defense", "handling", "tacticalIQ", "awareness", "creativity"],
  General: ["tacticalIQ", "leadership", "awareness", "composure", "discipline", "coordination", "creativity"],
  Cannon: ["precision", "range", "power", "awareness", "composure", "handling", "tacticalIQ", "strength"],
  Runner: ["speed", "agility", "evasion", "handling", "awareness", "endurance", "composure", "defense", "precision"],
  Bruiser: ["strength", "resilience", "defense", "power", "endurance", "awareness", "discipline", "speed"],
  Visual: ["visualCommunication", "creativity", "awareness", "coordination", "tacticalIQ", "composure", "discipline"],
  Musical: ["sonicCommunication", "coordination", "creativity", "composure", "tacticalIQ", "awareness", "endurance"]
};
const attributeLabels = {
  speed: "Speed", agility: "Agility", strength: "Strength", endurance: "Endurance", resilience: "Resilience",
  precision: "Precision", range: "Range", power: "Power", defense: "Defense", evasion: "Evasion", handling: "Handling",
  tacticalIQ: "Tactical IQ", awareness: "Awareness", composure: "Composure", discipline: "Discipline", creativity: "Creativity",
  leadership: "Leadership", coordination: "Coordination", visualCommunication: "Visual Signal", sonicCommunication: "Sonic Signal"
};
let prospects = [];
let selectedProspectId = null;
let activeRoleFilter = "All";
let draftSearch = "";
const watchlistIds = new Set();
let cpuDraftTimer = null;
let draftBoardView = false;
let draftClockPickIndex = -1;
let selectedAwardType = null;
let activePlayerProfileId = null;
let activePlayerProfileView = "overview";
let rulesEntry = "reference";

const rosterList = document.querySelector("#rosterList");
const candidateRail = document.querySelector("#candidateRail");
const toast = document.querySelector("#toast");
let toastTimer;

const mainMenu = document.querySelector("#mainMenu");
const loadScreen = document.querySelector("#loadScreen");
const introScreen = document.querySelector("#introScreen");
const rulesScreen = document.querySelector("#rulesScreen");
const franchiseScreen = document.querySelector("#franchiseScreen");
const seasonScreen = document.querySelector("#seasonScreen");
const recordsScreen = document.querySelector("#recordsScreen");
const playoffsScreen = document.querySelector("#playoffsScreen");
const awardsScreen = document.querySelector("#awardsScreen");
const progressionScreen = document.querySelector("#progressionScreen");
const offseasonScreen = document.querySelector("#offseasonScreen");
const squadScreen = document.querySelector("#squadScreen");
const strategyScreen = document.querySelector("#strategyScreen");
const matchScreen = document.querySelector("#matchScreen");
const gameInterface = document.querySelector("#gameInterface");
const introCrawl = document.querySelector("#introCrawl");
const seasonStorageKey = "proxy-season-results";
let selectedSeasonGame = 3;
let activeSeasonGame = null;
let activePlayoffGame = null;
let activeSeasonView = "schedule";
let activeRecordView = "players";
let activeRecordStat = "averageRating";
let franchiseSession = null;
let selectedProtectionIds = new Set();
let renewalFilter = "All";
let renewalSort = { key: "ovr", dir: -1 };
let renewalSelectedId = null;
let renewalTimer = null;
let selectedReleaseId = null;
let selectedFreeAgentId = null;
let freeAgentSearch = "";
let selectedLineupIds = new Set();
let selectedLineupAssignments = new Map();
let lineupSwapRole = null;
let selectedLineupSlots = null;
let defaultGamePlan = { formation: "balanced", tempo: "balanced", focus: "balanced", risk: "balanced" };
let startingFreshFranchise = false;
let latestSaveId = null;
let saveQueue = Promise.resolve();
let championshipCelebrationShown = false;
let currentStage = "menu";

const seasonOpponents = [
  ["Seoul Arrows", "Glass Gardens"], ["Cairo Scarabs", "Desert Causeway"], ["London Crown", "Flooded Borough"],
  ["Berlin Union", "Iron Ring"], ["Tokyo Ronin", "Neon Canals"], ["Lagos Cowries", "Lagoon Exchange"],
  ["New York Knights", "Madison Square Garden"], ["Rome Legion", "Marble Basin"], ["Mumbai Monsoon", "Rain District"],
  ["Mexico City Aguilas", "High Plateau"], ["Paris Catacombs", "Grand Arcade"], ["Austin Outlaws", "Hill Country"],
  ["Toronto Huskies", "Frozen Terminal"], ["Sao Paulo Pulse", "Canopy Grid"], ["Seoul Arrows", "Chicago War Room"],
  ["Cairo Scarabs", "Chicago War Room"]
];

function demoBox(week, won) {
  const names = [
    ["Bill Belichick", "General"], ["Steph Curry", "Cannon"], ["Tom Brady", "Cannon"],
    ["LeBron James", "Runner"], ["Serena Williams", "Runner"], ["Muhammad Ali", "Bruiser"],
    ["Aaron Donald", "Bruiser"], ["Banksy", "Visual"], ["Prince", "Musical"]
  ];
  return names.map(([name, role], index) => ({
    name,
    role,
    rating: Number((6.6 + ((week * 7 + index * 3) % 19) / 10 + (won ? .35 : 0)).toFixed(1)),
    eliminations: [0, 5, 4, 2, 1, 6, 7, 0, 0][index],
    contribution: role === "General" ? `${won ? 58 : 41} units remaining` : role === "Runner" ? `${2 + index % 2} zones captured` : role === "Visual" ? "91% coverage" : role === "Musical" ? "94% signal uptime" : `${4 + index} eliminations`
  }));
}

let seasonGames = seasonOpponents.map(([opponent, biome], index) => ({
  week: index + 1,
  opponent,
  biome,
  venue: index % 2 ? "Home" : "Away",
  status: index < 3 ? "completed" : index === 3 ? "current" : "upcoming"
}));
[
  { homeScore: 500, awayScore: 421, homeUnits: 58, awayUnits: 37, winner: "home", victoryType: "Control" },
  { homeScore: 388, awayScore: 500, homeUnits: 41, awayUnits: 49, winner: "away", victoryType: "Control" },
  { homeScore: 500, awayScore: 447, homeUnits: 52, awayUnits: 44, winner: "home", victoryType: "Control" }
].forEach((result, index) => { seasonGames[index].result = { ...result, players: { home: demoBox(index + 1, result.winner === "home") } }; });

try {
  const savedResults = JSON.parse(localStorage.getItem(seasonStorageKey) || "{}");
  Object.entries(savedResults).forEach(([week, result]) => {
    const game = seasonGames[Number(week) - 1];
    if (game) { game.status = "completed"; game.result = result; }
  });
  const firstUnplayed = seasonGames.find((game) => game.status !== "completed");
  if (firstUnplayed) {
    seasonGames.forEach((game) => { if (game.status === "current") game.status = "upcoming"; });
    firstUnplayed.status = "current";
    selectedSeasonGame = firstUnplayed.week - 1;
  }
} catch {
  localStorage.removeItem(seasonStorageKey);
}

function showGameScreen(screen) {
  [mainMenu, loadScreen, introScreen, rulesScreen, franchiseScreen, seasonScreen, recordsScreen, playoffsScreen, awardsScreen, progressionScreen, offseasonScreen, squadScreen, strategyScreen, matchScreen, gameInterface].forEach((item) => {
    item.hidden = item !== screen;
  });
  window.scrollTo(0, 0);
  if (screen === matchScreen) window.matchSimulator?.start();
  else window.matchSimulator?.pause();
  if (screen === strategyScreen) updateStrategyRoom();
  if (screen === seasonScreen) renderSeason();
  if (screen === franchiseScreen) renderFranchiseSelect();
  if (screen === recordsScreen) renderRecords();
  if (screen === playoffsScreen) renderPlayoffs();
  if (screen === awardsScreen) { selectedAwardType = null; renderAwards(); }
  if (screen === progressionScreen) renderProgression();
  if (screen === offseasonScreen) renderOffseason();
  if (screen === squadScreen) renderSquadRoom();
  if (screen === loadScreen) renderSaveList();
  if (screen === franchiseScreen) currentStage = "franchise";
  if (screen === gameInterface) currentStage = "draft";
  if ([seasonScreen, recordsScreen, squadScreen, strategyScreen, matchScreen].includes(screen) && draftSession.state.complete) currentStage = "season";
  if (screen === playoffsScreen) currentStage = "playoffs";
  if (screen === awardsScreen) currentStage = "awards";
  if (screen === progressionScreen) currentStage = "progression";
  if (screen === offseasonScreen) currentStage = "offseason";
}

function createGameSnapshot(stage = currentStage) {
  const savedStage = franchiseSession?.offseason ? "offseason" : franchiseSession?.playoffs ? "playoffs" : stage;
  return {
    gameVersion: "0.1.0-alpha",
    savedAt: new Date().toISOString(),
    stage: savedStage,
    franchise: { teamId: selectedFranchiseIndex, teamName: userDraftTeam.name, conference: userDraftTeam.conference },
    draft: draftSession.snapshot(),
    league: franchiseSession ? JSON.parse(JSON.stringify(franchiseSession)) : null,
    ui: { selectedSeasonGame, activeSeasonView, activeRecordView, activeRecordStat, selectedProtectionIds: [...selectedProtectionIds] }
  };
}

async function saveCurrentGame(type = "autosave") {
  if (!userDraftTeam) return null;
  const save = async () => {
    const id = type === "autosave" ? `autosave-${selectedFranchiseIndex}` : `manual-${selectedFranchiseIndex}-${Date.now()}`;
    const name = `${userDraftTeam.name} // ${franchiseSession ? `Season ${franchiseSession.season}` : "Draft"}`;
    const record = await window.ProxySaves.save(id, name, createGameSnapshot(), type);
    latestSaveId = record.id;
    await refreshContinueButton();
    return record;
  };
  const pending = saveQueue.then(save, save);
  saveQueue = pending.catch(() => undefined);
  return pending;
}

async function restoreGame(snapshot) {
  selectedFranchiseIndex = snapshot.franchise.teamId;
  selectedConference = snapshot.franchise.conference;
  draftSession = window.ProxyDraft.restoreDraft(window.PROXY_PLAYER_POOL, snapshot.draft);
  userDraftTeam = draftSession.state.teams[selectedFranchiseIndex];
  franchiseSession = snapshot.league || null;
  let repairedPlayoffsMvp = false;
  if (franchiseSession) {
    franchiseSession.transactions ||= [];
    repairedPlayoffsMvp = window.ProxyFranchise.repairPlayoffsMvp(franchiseSession);
    userDraftTeam = franchiseSession.teams[franchiseSession.userTeamId];
  }
  selectedSeasonGame = snapshot.ui?.selectedSeasonGame ?? 0;
  activeSeasonView = snapshot.ui?.activeSeasonView || "schedule";
  activeRecordView = snapshot.ui?.activeRecordView || "players";
  activeRecordStat = snapshot.ui?.activeRecordStat || "averageRating";
  selectedProtectionIds = new Set(snapshot.ui?.selectedProtectionIds || []);
  document.querySelector("#seasonTeamName").textContent = userDraftTeam.name;
  document.querySelector("#seasonConference").textContent = `${userDraftTeam.conference} Conference`;
  document.querySelector("#strategyTeamName").textContent = userDraftTeam.name;
  window.matchSimulator.setTeamIdentity("home", { name: userDraftTeam.name, abbreviation: teamAbbreviation(userDraftTeam.name), logo: teamLogo(userDraftTeam.name) });
  if (draftSession.state.complete) {
    const home = draftSession.buildActiveLineup(userDraftTeam);
    window.matchSimulator.setTeamRoster("home", home.lineup, home.reserves);
  }
  if (franchiseSession) syncUserSchedule();
  updateDraftUI();
  const destination = snapshot.stage === "draft" ? gameInterface : snapshot.stage === "playoffs" ? playoffsScreen : snapshot.stage === "offseason" ? offseasonScreen : seasonScreen;
  showGameScreen(destination);
  if (repairedPlayoffsMvp) persistFranchiseState();
}

async function refreshContinueButton() {
  const saves = await window.ProxySaves.list();
  const button = document.querySelector("#continueGameButton");
  const latest = saves[0];
  latestSaveId = latest?.id || null;
  button.disabled = !latest;
  document.querySelector("#continueGameLabel").textContent = latest ? `${latest.name} // ${new Date(latest.updatedAt).toLocaleDateString()}` : "No franchise found";
}

async function renderSaveList() {
  const saves = await window.ProxySaves.list();
  document.querySelector("#saveCount").textContent = `${saves.length} save${saves.length === 1 ? "" : "s"}`;
  document.querySelector("#manualSaveButton").disabled = currentStage === "menu" || currentStage === "franchise";
  document.querySelector("#saveList").innerHTML = saves.length ? saves.map((record) => {
    const payload = record.envelope.payload;
    const progress = payload.stage === "draft" ? `Draft pick ${payload.draft.pickIndex + 1}` : `Season ${payload.league?.season || 1} // Week ${Math.min(payload.league?.currentWeek || 1, 16)}`;
    return `<article class="save-entry"><img src="${teamLogo(payload.franchise.teamName)}" alt=""><div><span>${record.type} // ${new Date(record.updatedAt).toLocaleString()}</span><h2>${record.name}</h2><p>${progress} // ${payload.franchise.conference}</p></div><div class="save-actions"><button data-save-action="load" data-save-id="${record.id}">Load</button><button data-save-action="export" data-save-id="${record.id}">Export</button><button data-save-action="delete" data-save-id="${record.id}">Delete</button></div></article>`;
  }).join("") : `<div class="empty-saves"><span class="empty-file" aria-hidden="true">00</span><h2>No local franchises</h2><p>Start a franchise or import an exported save file.</p></div>`;
}

function teamSlug(name) {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function teamLogo(name) {
  const slug = teamSlug(name);
  return name === "Chicago Wind" || name === "Austin Outlaws" ? `logos/${slug}.svg` : `logos/teams/${slug}.svg`;
}

function teamAbbreviation(name) {
  const cityAliases = { "New York": "NY", "Los Angeles": "LA", "Mexico City": "MEX", "Buenos Aires": "BA", "Costa Rica": "CR", "New Orleans": "NO", "Sao Paulo": "SP" };
  const alias = Object.entries(cityAliases).find(([city]) => name.startsWith(city));
  return alias ? alias[1] : name.split(" ")[0].slice(0, 3).toUpperCase();
}

function renderFranchiseSelect() {
  const teams = draftSession.state.teams.slice().sort((first, second) => first.name.localeCompare(second.name));
  document.querySelector("#franchiseGrid").innerHTML = teams.map((team) => `<button class="franchise-choice ${team.id === selectedFranchiseIndex ? "active" : ""}" data-team-index="${team.id}">
    <img src="${teamLogo(team.name)}" alt=""><span>${team.conference}</span><strong>${team.name}</strong><small>${team.homeField}</small>
  </button>`).join("");
  const selected = draftSession.state.teams[selectedFranchiseIndex];
  document.querySelector("#selectedFranchiseLogo").src = teamLogo(selected.name);
  document.querySelector("#selectedFranchiseLogo").alt = `${selected.name} logo`;
  document.querySelector("#selectedFranchiseConference").textContent = `${selected.conference} Conference`;
  document.querySelector("#selectedFranchiseName").textContent = selected.name;
  document.querySelector("#selectedFranchiseField").textContent = selected.homeField;
}

function applyFranchiseSelection() {
  draftSession = window.ProxyDraft.createDraft(window.PROXY_PLAYER_POOL, { userTeamIndex: selectedFranchiseIndex, seed: 3000, randomizeDraftOrder: true, deferCpu: true });
  userDraftTeam = draftSession.state.teams[selectedFranchiseIndex];
  selectedProspectId = null;
  startingFreshFranchise = true;
  selectedLineupIds = new Set();
  selectedLineupAssignments = new Map();
  selectedLineupSlots = null;
  document.querySelector("#seasonTeamName").textContent = userDraftTeam.name;
  document.querySelector("#seasonConference").textContent = `${userDraftTeam.conference} Conference`;
  document.querySelector("#strategyTeamName").textContent = userDraftTeam.name;
  window.matchSimulator.setTeamIdentity("home", { name: userDraftTeam.name, abbreviation: teamAbbreviation(userDraftTeam.name), logo: teamLogo(userDraftTeam.name) });
  window.matchSimulator.setTeamIdentity("away", { name: "Berlin Union", abbreviation: "BER", logo: teamLogo("Berlin Union") });
  updateDraftUI();
  currentStage = "draft";
  void saveCurrentGame("autosave");
}

function renderSeason() {
  document.querySelector("#seasonBackButton").hidden = Boolean(franchiseSession);
  document.querySelector(".season-header").classList.toggle("season-active", Boolean(franchiseSession));
  const userRecord = franchiseSession?.standings[userDraftTeam.id];
  const wins = userRecord?.wins ?? seasonGames.filter((game) => game.result?.winner === "home").length;
  const losses = userRecord?.losses ?? seasonGames.filter((game) => game.result?.winner === "away").length;
  const current = seasonGames.find((game) => game.status === "current");
  document.querySelector("#seasonRecord").textContent = `${wins}-${losses}`;
  if (franchiseSession) document.querySelector("#seasonCycleLabel").textContent = `Season ${franchiseSession.season.toString().padStart(2, "0")} // Set 3000-09-01`;
  document.querySelector("#seasonProgress").textContent = current ? `Week ${current.week} of 16` : "Regular season complete";
  document.querySelector("#scheduleList").innerHTML = seasonGames.map((game, index) => {
    const result = game.result;
    const resultLabel = result ? `${result.winner === "home" ? "W" : "L"} ${result.homeScore}-${result.awayScore}` : game.status === "current" ? "NEXT" : "--";
    return `<button class="schedule-game ${game.status} ${index === selectedSeasonGame ? "active" : ""}" data-game-index="${index}">
      <span class="schedule-week">W${game.week.toString().padStart(2, "0")}</span>
      <img class="schedule-team-logo" src="${teamLogo(game.opponent)}" alt="">
      <span class="schedule-opponent"><strong>${game.opponent}</strong><small>${game.venue} // ${game.biome}</small></span>
      <span class="schedule-result ${result?.winner === "home" ? "win" : result ? "loss" : ""}">${resultLabel}</span>
    </button>`;
  }).join("");
  renderGameDetail(seasonGames[selectedSeasonGame]);
  renderStandings();
  if (franchiseSession) {
    const leaders = [
      ["Rating", "averageRating", "rating"],
      ["Eliminations", "eliminations", "eliminations"],
      ["Captures", "zoneCaptures", "zoneCaptures"]
    ].map(([label, stat, display]) => {
      const leader = window.ProxyFranchise.playerLeaderboard(franchiseSession, { scope: "season", stat })[0];
      return `<div><dt>${label}</dt><dd>${leader?.name || "—"} <b>${leader ? formatRecordValue(stat, leader[display]) : "—"}</b></dd></div>`;
    }).join("");
    document.querySelector(".season-leaders").innerHTML = leaders;
  }
  renderPostseasonControl();
  if (franchiseSession) {
    const conferenceRecords = window.ProxyFranchise.standingsFor(franchiseSession, userDraftTeam.conference);
    const rank = conferenceRecords.findIndex((record) => record.teamId === userDraftTeam.id) + 1;
    document.querySelector(".standing-rank strong").textContent = rank.toString().padStart(2, "0");
    document.querySelector(".standing-rank + p").textContent = rank <= 6 ? "Currently inside the playoff field." : `${rank - 6} position${rank - 6 === 1 ? "" : "s"} outside the playoff field.`;
  }
  document.querySelector(".schedule-panel").hidden = activeSeasonView !== "schedule";
  document.querySelector("#gameDetailPanel").hidden = activeSeasonView !== "schedule";
  document.querySelector("#standingsPanel").hidden = activeSeasonView !== "standings";
  document.querySelectorAll(".season-view-button").forEach((button) => {
    const active = button.dataset.seasonView === activeSeasonView;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderPostseasonControl() {
  const container = document.querySelector("#postseasonControl");
  if (!franchiseSession?.complete) {
    container.innerHTML = `<span class="menu-kicker">Postseason</span><h3>Playoff Race</h3><p>Six teams per conference qualify. The top two seeds receive byes.</p>`;
    return;
  }
  if (!franchiseSession.playoffs?.complete) {
    container.innerHTML = `<span class="menu-kicker">Regular Season Complete</span><h3>Season Awards Ready</h3><p>Review regular-season honors before the postseason begins.</p><button data-postseason-action="awards">Open Season Awards <span>→</span></button>`;
    return;
  }
  const champion = franchiseSession.teams[franchiseSession.playoffs.championTeamId];
  container.innerHTML = `<span class="menu-kicker">Season ${franchiseSession.season} Champion</span><img src="${teamLogo(champion.name)}" alt=""><h3>${champion.name}</h3><div class="season-award-reel"><span><b>Record</b>${franchiseSession.standings[champion.id].wins}-${franchiseSession.standings[champion.id].losses}</span><span><b>Playoffs MVP</b>${franchiseSession.playoffs.awards.find((award) => award.type === "playoffs-mvp")?.playerName || "—"}</span></div><button data-postseason-action="playoffs">Review Playoffs <span>→</span></button><button data-postseason-action="advance">Begin Offseason <span>→</span></button>`;
}

function playoffCard(game) {
  const home = franchiseSession.teams[game.homeTeamId];
  const away = franchiseSession.teams[game.awayTeamId];
  const result = game.result;
  return `<article class="bracket-game ${result ? "complete" : "pending"}" data-playoff-game="${game.id}" tabindex="0" role="button"><span>${game.conference || "League Final"}</span><div class="bracket-team ${result?.winner === "home" ? "winner" : ""}"><img src="${teamLogo(home.name)}" alt=""><strong>${home.name}</strong><b>${result?.homeScore ?? "–"}</b></div><div class="bracket-team ${result?.winner === "away" ? "winner" : ""}"><img src="${teamLogo(away.name)}" alt=""><strong>${away.name}</strong><b>${result?.awayScore ?? "–"}</b></div></article>`;
}

function renderPlayoffBoxscore(game) {
  const result = game.result;
  if (!result) return;
  const home = franchiseSession.teams[game.homeTeamId];
  const away = franchiseSession.teams[game.awayTeamId];
    document.querySelector("#playoffBoxscoreTitle").textContent = `${home.name} vs ${away.name} // ${game.round}`;
    document.querySelector("#playoffBoxscoreContent").innerHTML = `<div class="playoff-boxscore-summary"><strong>${result.homeScore}-${result.awayScore}</strong><span>${result.victoryType} victory // Units ${result.homeUnits}-${result.awayUnits}</span></div><div class="playoff-boxscore"><section><h3>${home.name}</h3>${(result.players?.home || []).map((player) => `<p><b>${player.name}</b><span>${player.role} // ${player.rating} RTG // ${player.eliminations} ELIM // ${player.assists || 0} AST // ${player.zoneCaptures || 0} CAP</span></p>`).join("")}</section><section><h3>${away.name}</h3>${(result.players?.away || []).map((player) => `<p><b>${player.name}</b><span>${player.role} // ${player.rating} RTG // ${player.eliminations} ELIM // ${player.assists || 0} AST // ${player.zoneCaptures || 0} CAP</span></p>`).join("")}</section></div>`;
    document.querySelector("#playoffBoxscoreModal").hidden = false;
}

function advancePlayoffRound() {
  try {
    if (!franchiseSession) throw new Error("No active franchise.");
    const playoffs = window.ProxyFranchise.playPlayoffRound(franchiseSession);
    activePlayoffGame = null;
    persistFranchiseState();
    showGameScreen(playoffsScreen);
    renderPlayoffs();
    showToast(playoffs.complete ? "Playoffs complete // honors ready" : `${playoffs.round} ready`);
  } catch (error) {
    showToast(`Playoff round failed: ${error.message}`);
    renderPlayoffs();
  }
}

function showChampionshipCelebration() {
  const champion = franchiseSession?.teams[franchiseSession.playoffs?.championTeamId];
  if (!champion || champion.id !== userDraftTeam.id || championshipCelebrationShown) return;
  championshipCelebrationShown = true;
  document.querySelector("#championshipLogo").src = teamLogo(champion.name);
  document.querySelector("#championshipLogo").alt = `${champion.name} team mark`;
  document.querySelector("#championshipTitle").textContent = `${champion.name} // Champions`;
  document.querySelector("#championshipMessage").textContent = `The League Final is complete. Your franchise has claimed Season ${franchiseSession.season}.`;
  document.querySelector("#championshipModal").hidden = false;
}

function renderPlayoffs() {
  if (!franchiseSession) return;
  const playoffs = window.ProxyFranchise.startPlayoffs(franchiseSession);
  document.querySelector("#playoffsSeasonLabel").textContent = `Season ${franchiseSession.season.toString().padStart(2, "0")} // Postseason`;
  document.querySelector("#playoffRoundLabel").textContent = playoffs.round;
  const roundNames = ["Wild Card", "Conference Semifinal", "Conference Championship", "League Championship"];
  document.querySelector("#bracketBoard").innerHTML = roundNames.map((round) => {
    const played = playoffs.games.filter((game) => game.round === round);
    const pending = playoffs.pendingGames.filter((game) => game.round === round);
    return `<section class="bracket-round"><header><span>${round}</span><b>${played.length + pending.length || "—"} games</b></header><div>${[...played, ...pending].map(playoffCard).join("") || `<p>Awaiting prior round</p>`}</div></section>`;
  }).join("");
  const command = document.querySelector("#playoffCommand");
  if (playoffs.complete) {
    const champion = franchiseSession.teams[playoffs.championTeamId];
    const mvp = playoffs.awards.find((award) => award.type === "playoffs-mvp");
    command.innerHTML = `<span class="menu-kicker">Season ${franchiseSession.season} Champion</span><img class="playoff-champion-logo" src="${teamLogo(champion.name)}" alt=""><h2>${champion.name}</h2><p>Final complete. View the full postseason honors reel.</p><button data-playoff-action="awards">Open Postseason Honors <span>→</span></button>`;
    showChampionshipCelebration();
    return;
  }
  const userGame = window.ProxyFranchise.playoffGameForUser(franchiseSession);
  if (userGame) {
    const opponentId = userGame.homeTeamId === userDraftTeam.id ? userGame.awayTeamId : userGame.homeTeamId;
    const opponent = franchiseSession.teams[opponentId];
    command.innerHTML = `<span class="menu-kicker">Your ${playoffs.round} Matchup</span><img class="playoff-champion-logo" src="${teamLogo(opponent.name)}" alt=""><h2>${opponent.name}</h2><p>${userGame.homeTeamId === userDraftTeam.id ? userDraftTeam.homeField : opponent.homeField} // Win or season ends</p><div class="playoff-actions"><button data-playoff-action="watch">Watch Live</button><button data-playoff-action="quick">Quick Sim</button><button data-playoff-action="round">Advance Round</button></div>`;
  } else {
    const bracketTeams = Object.values(playoffs.seedsByConference).flat().map((entry) => entry.teamId);
    const qualified = bracketTeams.includes(userDraftTeam.id);
    const eliminated = playoffs.games.some((game) => (game.homeTeamId === userDraftTeam.id || game.awayTeamId === userDraftTeam.id) && (game.result.winner === "home" ? game.awayTeamId : game.homeTeamId) === userDraftTeam.id);
    const status = !qualified ? "Your franchise missed the postseason. Simulate the bracket to crown a champion." : eliminated ? "Your franchise has been eliminated. Continue simulating to crown a champion." : "Your franchise has a first-round bye and advances automatically.";
    command.innerHTML = `<span class="menu-kicker">Season ${franchiseSession.season} Postseason</span><h2>${playoffs.round}</h2><p>${status}</p><button data-playoff-action="round">Simulate ${playoffs.round} <span>→</span></button>`;
  }
}

function renderAwards() {
  if (!franchiseSession) return;
  const postseason = Boolean(franchiseSession.playoffs?.complete);
  const awards = postseason ? (franchiseSession.playoffs.awards || []) : (franchiseSession.seasonAwards || window.ProxyFranchise.calculateSeasonAwards(franchiseSession));
  if (!postseason && !selectedAwardType) selectedAwardType = "general-of-year";
  if (!postseason) {
    franchiseSession.seasonAwards = awards;
    document.querySelector("#awardsTitle").textContent = "Regular Season Awards";
    document.querySelector("#awardsPhaseLabel").textContent = "Before Playoffs";
    document.querySelector("#awardsCommand").innerHTML = `<span class="menu-kicker">The league recognizes</span><h2>Season ${franchiseSession.season} is archived.</h2><p>These honors are recorded before the postseason begins.</p><button data-awards-action="playoffs">Continue to Playoffs <span>→</span></button>`;
  } else {
    document.querySelector("#awardsTitle").textContent = "Postseason Honors";
    document.querySelector("#awardsPhaseLabel").textContent = "After Final";
    const champion = franchiseSession.teams[franchiseSession.playoffs.championTeamId];
    const mvp = awards.find((award) => award.type === "playoffs-mvp");
    document.querySelector("#awardsCommand").innerHTML = `<span class="menu-kicker">League Final</span><img class="awards-champion-logo" src="${teamLogo(champion.name)}" alt=""><h2>${champion.name}</h2><p>League Champion${mvp ? ` // ${mvp.playerName} named Playoffs MVP` : ""}</p><button data-awards-action="offseason">Continue to Offseason <span>→</span></button>`;
    document.querySelector("#awardsSeasonLabel").textContent = `Season ${franchiseSession.season.toString().padStart(2, "0")} // Honors Office`;
    const playoffGames = franchiseSession.playoffs.games || [];
    const winnerOf = (game) => game.result.winner === "home" ? game.homeTeamId : game.awayTeamId;
    const championGames = playoffGames.filter((game) => game.homeTeamId === champion.id || game.awayTeamId === champion.id);
    const playoffWins = championGames.filter((game) => winnerOf(game) === champion.id).length;
    const standing = franchiseSession.standings[champion.id];
    const statKeys = ["eliminations", "assists", "zoneCaptures", "zoneDefenses", "interceptions", "distanceCarried", "decoysSuccessful", "decoysDenied", "networkCoverage"];
    const mvpStats = { games: 0, ratingTotal: 0, coverageGames: 0, ...Object.fromEntries(statKeys.map((key) => [key, 0])) };
    let mvpTeamId = mvp?.teamId;
    let mvpRole;
    playoffGames.forEach((game) => ["home", "away"].forEach((side) => {
      const line = (game.result.players?.[side] || []).find((player) => player.id === mvp?.playerId);
      if (!line) return;
      mvpTeamId ??= game[`${side}TeamId`];
      mvpRole ??= line.role;
      mvpStats.games += 1;
      mvpStats.ratingTotal += line.rating || 0;
      statKeys.forEach((key) => { mvpStats[key] += line[key] || 0; });
      if (line.networkCoverage > 0) mvpStats.coverageGames += 1;
    }));
    const mvpTeam = franchiseSession.teams[mvpTeamId];
    const mvpPlayer = mvpTeam?.roster.find((player) => player.id === mvp?.playerId);
    const mvpRoleMetrics = {
      Bruiser: [["Eliminations", "eliminations"], ["Zone Defenses", "zoneDefenses"]],
      Cannon: [["Eliminations", "eliminations"], ["Assists", "assists"]],
      Runner: [["Captures", "zoneCaptures"], ["Interceptions", "interceptions"], ["Distance", "distanceCarried"]],
      Visual: [["Decoys Successful", "decoysSuccessful"], ["Decoys Denied", "decoysDenied"], ["Avg Coverage", "networkCoverage"]],
      Musical: [["Decoys Successful", "decoysSuccessful"], ["Decoys Denied", "decoysDenied"], ["Avg Coverage", "networkCoverage"]]
    };
    const mvpMetrics = [["Games", mvpStats.games], ["Avg Rating", mvpStats.games ? (mvpStats.ratingTotal / mvpStats.games).toFixed(1) : "—"], ...(mvpRoleMetrics[mvpPlayer?.primaryRole || mvpRole] || []).map(([label, key]) => [label, key === "networkCoverage" ? (mvpStats.coverageGames ? `${(mvpStats.networkCoverage / mvpStats.coverageGames).toFixed(1)}%` : "0%") : mvpStats[key]])];
    const championCard = `<article class="award-dossier"><img src="${teamLogo(champion.name)}" alt=""><div><span>League Champion</span><h2>${champion.name}</h2><strong>${champion.conference}</strong><p>Season ${franchiseSession.season} champions</p><dl><div><dt>Regular Season</dt><dd>${standing ? `${standing.wins}-${standing.losses}` : "—"}</dd></div><div><dt>Playoffs</dt><dd>${playoffWins}-${championGames.length - playoffWins}</dd></div></dl></div></article>`;
    const mvpCard = mvp ? `<article class="award-dossier"><img src="${playerImage(mvpPlayer)}" alt=""><div><span>Playoffs MVP</span><h2>${mvp.playerName}</h2><strong>${mvpTeam?.name || "League"}</strong><p>${mvpPlayer ? displayRole(mvpPlayer.primaryRole) : "Postseason honor"}</p><dl>${mvpMetrics.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl></div></article>` : "";
    document.querySelector("#awardsBoard").innerHTML = `<div class="award-dossiers">${championCard}${mvpCard}</div>`;
    return;
  }
  document.querySelector("#awardsSeasonLabel").textContent = `Season ${franchiseSession.season.toString().padStart(2, "0")} // Honors Office`;
  const awardTypes = [...new Map(awards.map((award) => [award.type, award])).values()];
  if (!awardTypes.some((award) => award.type === selectedAwardType)) selectedAwardType = awardTypes[0]?.type;
  const selected = awards.filter((award) => award.type === selectedAwardType);
  const teamForPlayer = (playerId) => franchiseSession.teams.find((team) => team.roster.some((player) => player.id === playerId));
  const roleMetrics = {
    Bruiser: [["Eliminations", "eliminations"], ["Zone Defenses", "zoneDefenses"]],
    Cannon: [["Eliminations", "eliminations"], ["Assists", "assists"]],
    Runner: [["Captures", "zoneCaptures"], ["Distance", "distanceCarried"]],
    Visual: [["Decoys Successful", "decoysSuccessful"], ["Coverage", "networkCoverage"]],
    Musical: [["Decoys Denied", "decoysDenied"], ["Coverage", "networkCoverage"]]
  };
  const awardStats = {
    "season-distanceCarried": ["Distance", "distanceCarried"],
    "season-eliminations": ["Eliminations", "eliminations"],
    "season-assists": ["Assists", "assists"],
    "season-zoneCaptures": ["Captures", "zoneCaptures"],
    "season-zoneDefenses": ["Zone Defenses", "zoneDefenses"],
    "season-interceptions": ["Interceptions", "interceptions"]
  };
  const awardMetrics = (award, record) => {
    if (award.type === "general-of-year" || ((award.type === "all-league-first" || award.type === "all-league-second") && (award.role || record?.primaryRole) === "General")) {
      const general = record?.seasons[franchiseSession.season]?.general;
      const starts = general?.starts || 0;
      return [["Rating", starts ? (general.ratingTotal / starts).toFixed(1) : "—"], ["Team Elims", general?.teamEliminations || 0], ["Survival Rate", starts ? `${(general.survivalTotal / starts).toFixed(1)}%` : "0%"], ["Zones Captured", general?.zonesCaptured || 0]];
    }
    const totals = record?.seasons[franchiseSession.season]?.totals;
    const average = totals?.appearances ? (totals.ratingTotal / totals.appearances).toFixed(1) : "—";
    const stats = [...(roleMetrics[award.role || record?.primaryRole] || [])];
    const awardStat = awardStats[award.type];
    if (awardStat && !stats.some(([, key]) => key === awardStat[1])) stats.push(awardStat);
    return [["Rating", average], ...stats.map(([label, key]) => [label, key === "networkCoverage" ? (totals?.coverageAppearances ? `${(totals.coverageTotal / totals.coverageAppearances).toFixed(1)}%` : "0%") : totals?.[key] ?? (awardStat?.[1] === key ? award.value : 0) ?? 0])];
  };
  const awardTitles = { "all-league-first": "1st Team All-EWSL", "all-league-second": "2nd Team All-EWSL" };
  const awardTitle = (award) => awardTitles[award.type] || award.title;
  const playerCard = (award) => {
    const team = teamForPlayer(award.playerId);
    const record = franchiseSession.playerRecords[award.playerId];
    const teamStanding = team ? franchiseSession.standings[team.id] : null;
    return `<article class="award-dossier"><img src="${playerImage(team?.roster.find((player) => player.id === award.playerId))}" alt=""><div><span>${awardTitle(award)}${award.role ? ` // ${displayRole(award.role)}` : ""}</span><h2>${award.playerName}</h2><strong>${team?.name || "League"}</strong><p>${teamStanding ? `Team record ${teamStanding.wins}-${teamStanding.losses}` : "Season honor"}</p><dl>${awardMetrics(award, record).map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl></div></article>`;
  };
  const cards = `<div class="award-dossiers">${selected.map(playerCard).join("") || `<div class="records-empty"><strong>Award details unavailable.</strong></div>`}</div>`;
  document.querySelector("#awardsBoard").innerHTML = `<nav class="award-tabs">${awardTypes.map((award) => `<button class="award-tab ${award.type === selectedAwardType ? "active" : ""}" data-award-type="${award.type}">${awardTitle(award)}</button>`).join("")}</nav>${cards}`;
}

function renderProgression() {
  if (!franchiseSession?.offseason) return;
  const changes = new Map(franchiseSession.offseason.formChanges.map((change) => [change.playerId, change]));
  document.querySelector("#progressionSeasonLabel").textContent = `Season ${franchiseSession.season.toString().padStart(2, "0")} // Form Report`;
  document.querySelector("#progressionTeamName").textContent = userDraftTeam.name;
  document.querySelector("#progressionGrid").innerHTML = userDraftTeam.roster.map((player) => {
    const change = changes.get(player.id) || { previous: player.form || 0, current: player.form || 0, change: 0 };
    const record = franchiseSession.playerRecords[player.id];
    const totals = record?.seasons[franchiseSession.season]?.totals;
    const average = totals?.appearances ? (totals.ratingTotal / totals.appearances).toFixed(1) : "—";
    const direction = change.change > 0 ? "up" : change.change < 0 ? "down" : "steady";
    return `<article class="progression-card ${direction}"><img src="${playerImage(player)}" alt="" loading="lazy"><div><span>${displayRole(player.primaryRole)}</span><h3>${player.name}</h3><small>Season rating ${average} // ${totals?.appearances || 0} appearances</small></div><div class="form-shift"><b>${change.current > 0 ? "+" : ""}${change.current}</b><span>${change.change > 0 ? "+" : ""}${change.change} form</span></div></article>`;
  }).join("");
  const rises = [...changes.values()].filter((change) => change.change > 0).length;
  const falls = [...changes.values()].filter((change) => change.change < 0).length;
  document.querySelector("#progressionCommand").innerHTML = `<span class="menu-kicker">Development Ledger</span><h2>${rises} rising // ${falls} falling</h2><p>Season performance has changed player form. These updates carry into the next campaign and affect renewal decisions.</p><button data-progression-action="continue">Continue to Protection <span>→</span></button>`;
}

function renderOffseason() {
  if (!franchiseSession) return;
  const offseason = window.ProxyFranchise.startOffseason(franchiseSession);
  const grid = document.querySelector("#offseasonGrid");
  const command = document.querySelector("#offseasonCommand");
  grid.classList.remove("renewal-mode");
  document.querySelector("#offseasonSeasonLabel").textContent = `Season ${franchiseSession.season.toString().padStart(2, "0")} // Roster Renewal`;
  if (offseason.stage === "protection") {
    const changes = new Map(offseason.formChanges.map((change) => [change.playerId, change]));
    document.querySelector("#offseasonTitle").textContent = "Protect Your Core";
    document.querySelector("#offseasonPhaseLabel").textContent = "Protection Phase";
    document.querySelector("#offseasonCount").textContent = `${selectedProtectionIds.size} / 6`;
    document.querySelector("#offseasonBoardLabel").textContent = "Current Roster";
    document.querySelector("#offseasonBoardTitle").textContent = "Select Six Players";
    document.querySelector("#offseasonPoolCount").textContent = "12 rostered";
    grid.innerHTML = userDraftTeam.roster.map((player) => {
      const change = changes.get(player.id);
      const selected = selectedProtectionIds.has(player.id);
      return `<button class="protection-card ${selected ? "selected" : ""}" data-protect-id="${player.id}"><img src="${playerImage(player)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span>${displayRole(player.primaryRole)}</span><strong>${player.name}</strong><div><b>${player.overall + (player.form || 0)}</b><em class="${change.change > 0 ? "up" : change.change < 0 ? "down" : ""}">${change.change > 0 ? "+" : ""}${change.change}</em></div></button>`;
    }).join("");
    const selected = userDraftTeam.roster.filter((player) => selectedProtectionIds.has(player.id));
    const valid = window.ProxyFranchise.validProtections(userDraftTeam, [...selectedProtectionIds]);
    command.innerHTML = `<span class="menu-kicker">Protected List</span><h2>${selected.length ? `${selected.length} Selected` : "No Players Selected"}</h2><div class="protected-list">${selected.map((player) => `<span>${player.name}<b>${displayRole(player.primaryRole)}</b></span>`).join("") || `<p>Select exactly six players. The other six enter the renewal pool.</p>`}</div><p class="protection-warning">${selectedProtectionIds.size === 6 && !valid ? "This group would leave more roster holes than six renewal picks can fill." : "Protected players retain their current form and roster history."}</p><button data-offseason-action="recommend">Recommend Six</button><button data-offseason-action="protect" ${valid ? "" : "disabled"}>Lock Protections <span>→</span></button>`;
    return;
  }

  if (offseason.stage === "renewal") {
    grid.classList.add("renewal-mode");
    const current = window.ProxyFranchise.renewalCurrentPick(franchiseSession);
    const userTurn = current?.teamId === userDraftTeam.id;
    const counts = userDraftTeam.roster.reduce((result, player) => { result[player.primaryRole] = (result[player.primaryRole] || 0) + 1; return result; }, {});
    const targets = window.ProxyDraft.ROSTER_TARGETS;
    const canTake = (player) => (counts[player.primaryRole] || 0) < targets[player.primaryRole];
    const rating = (player) => player.overall + (player.form || 0);
    const sorters = { name: (a, b) => a.name.localeCompare(b.name), role: (a, b) => a.primaryRole.localeCompare(b.primaryRole) || rating(b) - rating(a), ovr: (a, b) => rating(a) - rating(b), form: (a, b) => (a.form || 0) - (b.form || 0) };
    const available = window.ProxyFranchise.renewalAvailable(franchiseSession)
      .filter((player) => renewalFilter === "All" || player.primaryRole === renewalFilter)
      .sort((a, b) => sorters[renewalSort.key](a, b) * (renewalSort.key === "name" || renewalSort.key === "role" ? -renewalSort.dir : renewalSort.dir) || rating(b) - rating(a));
    if (!available.some((player) => player.id === renewalSelectedId && canTake(player))) renewalSelectedId = available.find(canTake)?.id || null;
    const selectedPlayer = available.find((player) => player.id === renewalSelectedId);
    document.querySelector("#offseasonTitle").textContent = "Renewal Draft";
    document.querySelector("#offseasonPhaseLabel").textContent = `Round ${current?.round || 6} // Pick ${offseason.pickIndex + 1}`;
    document.querySelector("#offseasonCount").textContent = `${userDraftTeam.roster.length} / 12`;
    document.querySelector("#offseasonBoardLabel").textContent = "Available Pool";
    document.querySelector("#offseasonBoardTitle").textContent = userTurn ? "You Are On the Clock" : `${franchiseSession.teams[current.teamId].name} Selecting`;
    document.querySelector("#offseasonPoolCount").textContent = `${offseason.availableIds.length} available`;
    const roles = ["All", "General", "Cannon", "Runner", "Bruiser", "Visual", "Musical"];
    const sortHead = (key, label) => `<button data-renewal-sort="${key}" class="${renewalSort.key === key ? "active" : ""}">${label}${renewalSort.key === key ? (renewalSort.dir < 0 ? " ▾" : " ▴") : ""}</button>`;
    const renewalDetail = (player) => `<div class="renewal-detail"><img src="${playerImage(player)}" alt="" loading="lazy" referrerpolicy="no-referrer"><div><span>${displayRole(player.primaryRole)} // ${rating(player)} OVR // ${player.form > 0 ? `+${player.form}` : player.form || 0} form</span><strong>${player.name}</strong><small>${playerPositionSummary(player)}</small><dl>${(roleAttributeLabels[player.primaryRole] || []).map(([label, key]) => `<div><dt>${label}</dt><dd>${player.attributes[key]}</dd></div>`).join("")}</dl></div><button data-renewal-draft="${player.id}" ${userTurn && canTake(player) ? "" : "disabled"}>${userTurn ? `Draft ${player.name.split(" ")[0]}` : "Waiting for your pick"} <span>→</span></button></div>`;
    grid.innerHTML = `<nav class="renewal-filters">${roles.map((role) => `<button data-renewal-filter="${role}" class="${renewalFilter === role ? "active" : ""}">${role === "All" ? "All" : displayRole(role)}${role !== "All" ? ` <b>${counts[role] || 0}/${targets[role]}</b>` : ""}</button>`).join("")}</nav><div class="renewal-table"><div class="renewal-row renewal-head">${sortHead("name", "Player")}${sortHead("role", "Position")}${sortHead("ovr", "OVR")}${sortHead("form", "Form")}<span>Role Ratings</span></div>${available.map((player) => `<button class="renewal-row ${player.id === renewalSelectedId ? "active" : ""} ${canTake(player) ? "" : "full"}" data-renewal-select="${player.id}"><span class="renewal-name"><img src="${playerImage(player)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"><strong>${player.name}</strong></span><span>${displayRole(player.primaryRole)}</span><b>${rating(player)}</b><span>${player.form > 0 ? `+${player.form}` : player.form || 0}</span><small>${canTake(player) ? playerPositionSummary(player) : "Position filled"}</small></button>${player.id === renewalSelectedId ? renewalDetail(player) : ""}`).join("") || `<p class="renewal-empty">No available players at this position.</p>`}</div>`;
    const recent = offseason.picks.slice().reverse().map((pick) => {
      const player = offseason.pool.find((candidate) => candidate.id === pick.playerId);
      return `<div class="${pick.teamId === userDraftTeam.id ? "mine" : ""}"><span>${pick.round}.${String(pick.overall).padStart(2, "0")}</span><strong>${franchiseSession.teams[pick.teamId].name}</strong><b>${player?.name || "—"}</b><small>${player ? displayRole(player.primaryRole) : ""}</small></div>`;
    }).join("");
    const upcoming = offseason.order.slice(offseason.pickIndex, offseason.pickIndex + 5).map((pick, index) => `<div class="${pick.teamId === userDraftTeam.id ? "mine" : ""}"><span>${pick.round}.${String(offseason.pickIndex + index + 1).padStart(2, "0")}</span><strong>${franchiseSession.teams[pick.teamId].name}</strong><b>${index === 0 ? "On the clock" : "Upcoming"}</b><small></small></div>`).join("");
    command.innerHTML = `<span class="menu-kicker">${userTurn ? "Your Selection" : "On the Clock"}</span><h2>${userTurn ? (selectedPlayer?.name || "Choose a Player") : franchiseSession.teams[current.teamId].name}</h2><p>Round ${current.round} // Overall pick ${offseason.pickIndex + 1} of ${offseason.order.length}</p><div class="renewal-needs">${Object.entries(targets).map(([role, target]) => `<span class="${(counts[role] || 0) >= target ? "filled" : ""}">${displayRole(role)}<b>${counts[role] || 0}/${target}</b></span>`).join("")}</div><button data-offseason-action="draft-pick" ${userTurn && selectedPlayer ? "" : "disabled"}>Draft ${selectedPlayer ? selectedPlayer.name.split(" ")[0] : "Player"} <span>→</span></button><button data-offseason-action="auto-pick" ${userTurn ? "" : "disabled"}>Auto Pick <span>→</span></button><button data-offseason-action="sim-to-user" ${userTurn ? "disabled" : ""}>Sim to My Pick <span>→</span></button><button data-offseason-action="sim-all">Simulate Remaining Draft <span>→</span></button><div class="renewal-draft-board"><header><span>Renewal Draft Board</span><b>${offseason.pickIndex} / ${offseason.order.length}</b></header><div class="renewal-progress"><i style="width:${(offseason.pickIndex / offseason.order.length) * 100}%"></i></div><div class="renewal-board-list">${upcoming}${recent || "<p>Waiting for the first selection.</p>"}</div></div>`;
    if (!userTurn) startRenewalCpu();
    return;
  }

  grid.classList.remove("renewal-mode");
  document.querySelector("#offseasonTitle").textContent = "Roster Renewed";
  document.querySelector("#offseasonPhaseLabel").textContent = "Complete";
  document.querySelector("#offseasonCount").textContent = "12 / 12";
  document.querySelector("#offseasonBoardLabel").textContent = "New Roster";
  document.querySelector("#offseasonBoardTitle").textContent = userDraftTeam.name;
  document.querySelector("#offseasonPoolCount").textContent = `${franchiseSession.freeAgents.length} free agents`;
  grid.innerHTML = userDraftTeam.roster.map((player) => `<div class="renewal-card complete"><span>${displayRole(player.primaryRole)}</span><strong>${player.name}</strong><div><b>${player.overall + (player.form || 0)}</b><small>${player.form > 0 ? `+${player.form}` : player.form} form</small></div></div>`).join("");
  command.innerHTML = `<span class="menu-kicker">Roster Certified</span><h2>Ready for Season ${franchiseSession.season + 1}</h2><p>Six players retained. Six renewal selections completed. Career records and team histories remain intact.</p><button data-offseason-action="next-season">Begin Next Season <span>→</span></button>`;
}

function playerPositionSummary(player) {
  return Object.entries(player.roleRatings).sort((first, second) => second[1] - first[1]).slice(0, 3).map(([role, rating]) => `${shortRole(role)} ${rating}`).join(" // ");
}

function renderSquadRoom() {
  const rosterContainer = document.querySelector("#squadPlayerList");
  const freeAgentContainer = document.querySelector("#freeAgentList");
  const desk = document.querySelector("#transactionDesk");
  if (!franchiseSession) {
    rosterContainer.innerHTML = `<div class="records-empty"><strong>No active roster</strong><p>Complete the initial draft to manage personnel.</p></div>`;
    freeAgentContainer.innerHTML = "";
    desk.innerHTML = "";
    return;
  }
  const seasonTransactions = franchiseSession.transactions.filter((transaction) => transaction.season === franchiseSession.season && transaction.teamId === userDraftTeam.id);
  document.querySelector("#squadSeasonLabel").textContent = `Season ${franchiseSession.season.toString().padStart(2, "0")} // Personnel`;
  document.querySelector("#squadTeamName").textContent = userDraftTeam.name;
  document.querySelector("#transactionCount").textContent = `${seasonTransactions.length} / 4`;
  rosterContainer.innerHTML = userDraftTeam.roster.map((player) => `<button class="squad-management-player ${selectedReleaseId === player.id ? "selected" : ""}" data-release-id="${player.id}"><img src="${playerImage(player)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span>${displayRole(player.primaryRole)}</span><strong>${player.name}</strong><small>${playerPositionSummary(player)}</small><b>${player.overall + (player.form || 0)}</b></button>`).join("");
  const available = franchiseSession.freeAgents.filter((player) => !freeAgentSearch || player.name.toLowerCase().includes(freeAgentSearch)).sort((first, second) => (second.overall + (second.form || 0)) - (first.overall + (first.form || 0))).slice(0, 60);
  freeAgentContainer.innerHTML = available.map((player) => `<button class="squad-management-player free-agent ${selectedFreeAgentId === player.id ? "selected" : ""}" data-free-agent-id="${player.id}"><span>${displayRole(player.primaryRole)}</span><strong>${player.name}</strong><small>${playerPositionSummary(player)}</small><b>${player.overall + (player.form || 0)}</b></button>`).join("");
  const released = userDraftTeam.roster.find((player) => player.id === selectedReleaseId);
  const signed = franchiseSession.freeAgents.find((player) => player.id === selectedFreeAgentId);
  const locked = franchiseSession.complete || franchiseSession.playoffs || seasonTransactions.length >= 4;
  desk.innerHTML = `<span class="menu-kicker">Transaction Desk</span><h2>${locked ? "Transactions Locked" : "Sign & Release"}</h2><div class="transaction-swap"><section><span>Release</span><strong>${released?.name || "Select roster player"}</strong><small>${released ? playerPositionSummary(released) : "—"}</small></section><i>⇄</i><section><span>Sign</span><strong>${signed?.name || "Select free agent"}</strong><small>${signed ? playerPositionSummary(signed) : "—"}</small></section></div><button data-transaction-action="confirm" ${locked || !released || !signed ? "disabled" : ""}>Confirm Transaction <span>→</span></button><div class="transaction-history"><h3>Season Transactions</h3>${seasonTransactions.slice().reverse().map((transaction) => `<p><b>IN ${transaction.signedName}</b><span>OUT ${transaction.releasedName} // W${transaction.week}</span></p>`).join("") || `<p>No transactions this season.</p>`}</div>`;
}

function persistFranchiseState() {
  if (!franchiseSession) return;
  const storageKey = `${seasonStorageKey}-${userDraftTeam.id}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify({
    season: franchiseSession.season,
    currentWeek: franchiseSession.currentWeek,
    standings: franchiseSession.standings,
    playerRecords: franchiseSession.playerRecords,
    leagueHistory: franchiseSession.leagueHistory,
    achievements: franchiseSession.achievements,
    seasonAwards: franchiseSession.seasonAwards,
    freeAgents: franchiseSession.freeAgents,
    transactions: franchiseSession.transactions,
    playoffs: franchiseSession.playoffs,
    offseason: franchiseSession.offseason,
    teams: franchiseSession.teams,
    gameRecords: franchiseSession.gameRecords,
    results: franchiseSession.schedule.map((week) => week.games.map((game) => game.result))
    }));
  } catch {
    // Late-season payloads can exceed the localStorage quota; the IndexedDB autosave remains authoritative.
    localStorage.removeItem(storageKey);
  }
  void saveCurrentGame("autosave");
}

function userFacingResult(game, result) {
  if (!result || game.homeTeamId === userDraftTeam.id) return result;
  return {
    ...result,
    winner: result.winner === "home" ? "away" : "home",
    homeScore: result.awayScore,
    awayScore: result.homeScore,
    homeUnits: result.awayUnits,
    awayUnits: result.homeUnits,
    players: { home: result.players?.away || [], away: result.players?.home || [] }
  };
}

function syncUserSchedule() {
  if (!franchiseSession) return;
  seasonGames = franchiseSession.schedule.map((week) => {
    const game = week.games.find((item) => item.homeTeamId === userDraftTeam.id || item.awayTeamId === userDraftTeam.id);
    const opponentId = game.homeTeamId === userDraftTeam.id ? game.awayTeamId : game.homeTeamId;
    const opponent = franchiseSession.teams[opponentId];
    const venue = game.homeTeamId === userDraftTeam.id ? "Home" : "Away";
    return {
      week: week.week,
      opponent: opponent.name,
      biome: venue === "Home" ? userDraftTeam.homeField : opponent.homeField,
      venue,
      status: game.status === "completed" ? "completed" : week.week === franchiseSession.currentWeek ? "current" : "upcoming",
      result: userFacingResult(game, game.result),
      leagueGameId: game.id
    };
  });
  const currentIndex = seasonGames.findIndex((game) => game.status === "current");
  if (currentIndex >= 0) selectedSeasonGame = currentIndex;
}

function initializeFranchiseSeason() {
  franchiseSession = window.ProxyFranchise.createLeague(draftSession.state.teams, userDraftTeam.id, { season: 1, seed: 3000 + selectedFranchiseIndex * 7919, freeAgents: draftSession.availablePlayers() });
  try {
    const saved = startingFreshFranchise ? null : JSON.parse(localStorage.getItem(`${seasonStorageKey}-${userDraftTeam.id}`) || "null");
    startingFreshFranchise = false;
    if (saved?.currentWeek && Array.isArray(saved.standings) && Array.isArray(saved.results)) {
      if (saved.teams) franchiseSession.teams = saved.teams;
      if (saved.season) franchiseSession.season = saved.season;
      userDraftTeam = franchiseSession.teams[franchiseSession.userTeamId];
      franchiseSession.schedule = window.ProxyFranchise.generateSchedule(franchiseSession.teams, franchiseSession.season);
      franchiseSession.currentWeek = saved.currentWeek;
      franchiseSession.complete = saved.currentWeek > 16;
      franchiseSession.standings = saved.standings;
      franchiseSession.playerRecords = saved.playerRecords || {};
      franchiseSession.leagueHistory = saved.leagueHistory || [];
      franchiseSession.achievements = saved.achievements || { unlocked: [] };
      franchiseSession.seasonAwards = saved.seasonAwards || null;
      franchiseSession.freeAgents = saved.freeAgents || franchiseSession.freeAgents;
      franchiseSession.transactions = saved.transactions || [];
      franchiseSession.playoffs = saved.playoffs || null;
      franchiseSession.offseason = saved.offseason || null;
      franchiseSession.gameRecords = saved.gameRecords || null;
      franchiseSession.schedule.forEach((week, weekIndex) => week.games.forEach((game, gameIndex) => {
        const result = saved.results[weekIndex]?.[gameIndex];
        if (result) { game.result = result; game.status = "completed"; }
      }));
    }
  } catch {
    localStorage.removeItem(`${seasonStorageKey}-${userDraftTeam.id}`);
  }
  syncUserSchedule();
  activeSeasonView = "schedule";
}

function renderStandings() {
  const container = document.querySelector("#conferenceStandings");
  if (!franchiseSession) {
    container.innerHTML = `<p class="standings-empty">Complete the draft to begin league standings.</p>`;
    return;
  }
  const conferences = ["Americas", "Eurasia-Africa"];
  container.innerHTML = conferences.map((conference) => {
    const records = window.ProxyFranchise.standingsFor(franchiseSession, conference);
    return `<section><h3>${conference} Conference</h3><div class="standings-table-wrap"><table><thead><tr><th>#</th><th>Team</th><th>W</th><th>L</th><th>CONF</th><th>DIFF</th></tr></thead><tbody>${records.map((record, index) => {
      const team = franchiseSession.teams[record.teamId];
      const row = `<tr class="${team.id === userDraftTeam.id ? "user-standing" : ""}"><td>${index + 1}</td><td><img src="${teamLogo(team.name)}" alt=""><strong>${team.name}</strong></td><td>${record.wins}</td><td>${record.losses}</td><td>${record.conferenceWins}-${record.conferenceLosses}</td><td>${record.unitsFor - record.unitsAgainst >= 0 ? "+" : ""}${record.unitsFor - record.unitsAgainst}</td></tr>`;
      return `${row}${index === 5 ? `<tr class="playoff-cutoff"><td colspan="6"><span>PLAYOFF CUT LINE</span></td></tr>` : ""}`;
    }).join("")}</tbody></table></div></section>`;
  }).join("");
}

const recordStats = {
  players: { averageRating: "Average Rating", wins: "Wins", eliminations: "Eliminations", assists: "Assists", zoneCaptures: "Zone Captures", zoneDefenses: "Zone Defenses", interceptions: "Interceptions", distanceCarried: "Distance Carried", decoysSuccessful: "Decoys Successful", decoysDenied: "Decoys Denied", networkCoverage: "Network Coverage" },
  generals: { averageRating: "Average Rating", wins: "Wins", winPercentage: "Win Percentage", teamEliminations: "Team Eliminations", survivalRate: "Survival Rate", zonesCaptured: "Zones Captured", zoneHoldTime: "Zone Hold Time", zoneWins: "Zone Wins", eliminationWins: "Elimination Wins", playoffWins: "Playoff Wins", championships: "Championships" }
};

function statLabel(stat) {
  return Object.values({ ...recordStats.players, ...recordStats.generals }).find((label) => label.toLowerCase().replace(/\s/g, "") === stat.toLowerCase()) || stat.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function formatRecordValue(stat, value) {
  if (["winPercentage", "survivalRate", "networkCoverage"].includes(stat)) return `${value}%`;
  if (stat === "zoneHoldTime") return `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, "0")}`;
  if (stat === "distanceCarried") return Math.round(value).toLocaleString();
  return value;
}

function renderLeaderboard(general = false) {
  const records = general
    ? window.ProxyFranchise.generalLeaderboard(franchiseSession, { scope: "season", stat: activeRecordStat })
    : window.ProxyFranchise.playerLeaderboard(franchiseSession, { scope: "season", stat: activeRecordStat });
  const valueLabel = recordStats[general ? "generals" : "players"][activeRecordStat];
  const columns = general ? ["starts", "wins", "averageRating", "teamEliminations", "survivalRate", "zonesCaptured"] : ["appearances", "wins", "averageRating", "eliminations", "assists", "zoneCaptures", "zoneDefenses", "interceptions", "distanceCarried", "decoysSuccessful", "decoysDenied", "networkCoverage"];
  return `<div class="records-table-wrap"><table class="records-table sortable-records"><thead><tr><th>#</th><th>${general ? "General" : "Player"}</th>${columns.map((stat) => `<th><button data-record-stat="${stat}">${statLabel(stat)}${activeRecordStat === stat ? " ↓" : ""}</button></th>`).join("")}</tr></thead><tbody>${records.map((record, index) => `<tr><td>${index + 1}</td><td><button class="player-history-link" data-player-record="${record.id}"><strong>${record.name}</strong><small>${displayRole(record.primaryRole)}</small></button></td>${columns.map((stat) => `<td>${formatRecordValue(stat, record[stat] ?? 0)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function renderRecordBook(scope) {
  const limit = scope === "career" ? 10 : 5;
  const stats = ["eliminations", "assists", "zoneCaptures", "zoneDefenses", "interceptions", "distanceCarried", "decoysSuccessful", "decoysDenied", "networkCoverage", "playerOfMatch"];
  const cards = stats.flatMap((stat) => {
    const records = scope === "career"
      ? window.ProxyFranchise.playerLeaderboard(franchiseSession, { scope, stat }).filter((record) => stat !== "networkCoverage" || record.coverageAppearances >= 5).slice(0, limit)
      : Object.values(franchiseSession.playerRecords).flatMap((record) => Object.values(record.seasons).filter((season) => season.totals?.appearances && (stat !== "networkCoverage" || season.totals.coverageAppearances >= 5)).map((season) => ({ id: record.id, name: record.name, season: season.season, teams: Object.values(season.teams || {}).map((team) => team.teamName).join(" / "), coverageAppearances: season.totals.coverageAppearances || 0, [stat]: stat === "networkCoverage" ? Number((season.totals.coverageTotal / season.totals.coverageAppearances).toFixed(1)) : season.totals[stat] || 0 })))
        .sort((first, second) => second[stat] - first[stat] || second.season - first.season).slice(0, limit);
    return `<article class="ranked-record-card"><span>${scope === "career" ? "Career Leaders // Top 10" : "All Seasons // Top 5"}</span><h3>${stat === "networkCoverage" ? "Average Network Coverage" : statLabel(stat)}</h3><ol>${records.map((record, index) => `<li><b>${index + 1}</b><span><button class="player-history-link" data-player-record="${record.id}">${record.name}</button>${scope === "season" ? `<small>Season ${record.season} (Year ${2999 + record.season})${record.teams ? ` // ${record.teams}` : ""}${stat === "networkCoverage" ? ` // ${record.coverageAppearances} GP` : ""}</small>` : stat === "networkCoverage" ? `<small>${record.coverageAppearances} GP</small>` : ""}</span><strong>${formatRecordValue(stat, record[stat])}</strong></li>`).join("") || `<li><span>No records yet</span></li>`}</ol></article>`;
  });
  return `<div class="record-book">${cards.join("")}</div>`;
}

function renderGameRecords() {
  window.ProxyFranchise.ensureGameRecords(franchiseSession);
  const statDefs = [["eliminations", "Most Eliminations"], ["assists", "Most Assists"], ["zoneCaptures", "Most Captures"], ["zoneDefenses", "Most Defenses"], ["interceptions", "Most Interceptions"], ["distanceCarried", "Longest Carry"], ["decoysSuccessful", "Most Successful Decoys"], ["decoysDenied", "Most Denied Decoys"], ["networkCoverage", "Highest Network Coverage"]];
  const cards = statDefs.map(([stat, title]) => {
    const records = franchiseSession.gameRecords[stat] || [];
    return `<article class="ranked-record-card"><span>Single-Game // Top 5</span><h3>${title}</h3><ol>${records.map((record, index) => `<li><b>${index + 1}</b><span>${record.name}<small>${record.teamName ? `${record.teamName} // ` : ""}Season ${record.season}, ${record.round || `Week ${record.week}`}</small></span><strong>${formatRecordValue(stat, record.value)}</strong></li>`).join("") || `<li><span>No games recorded</span></li>`}</ol></article>`;
  });
  return `<div class="record-book">${cards.join("")}</div>`;
}

function renderLeagueHistory() {
  if (!franchiseSession.leagueHistory.length) return `<div class="records-empty"><strong>No championships archived yet.</strong><p>Completed seasons will preserve champions, runners-up, awards, standings, and record holders here permanently.</p></div>`;
  return `<div class="history-list">${franchiseSession.leagueHistory.slice().reverse().map((season) => `<article><span>Season ${season.season}</span><img src="${teamLogo(season.championName)}" alt=""><div><h3>${season.championName}</h3><p>League Champion // defeated ${season.runnerUpName}</p></div></article>`).join("")}</div>`;
}

function renderTrophyRoom() {
  const unlocked = franchiseSession.achievements?.unlocked || [];
  const unlockedTypes = new Set(unlocked.map((achievement) => achievement.id)).size;
  const tiers = ["trophy", "banner", "plaque", "badge"];
  return `<div class="trophy-room-summary"><strong>${unlockedTypes}</strong><span>of ${window.ProxyFranchise.ACHIEVEMENTS.length} milestone types earned</span></div>${tiers.map((tier) => `<section class="trophy-tier"><header><span>${tier}</span><strong>${tier === "trophy" ? "Major Honors" : tier === "banner" ? "Season Honors" : tier === "plaque" ? "Career Milestones" : "Progress Badges"}</strong></header><div>${window.ProxyFranchise.ACHIEVEMENTS.filter((achievement) => achievement.tier === tier).map((achievement) => {
    const awards = unlocked.filter((item) => item.id === achievement.id);
    const earned = awards.length > 0;
    const detail = earned ? awards.map((item) => item.subjectName ? `${item.subjectName} // S${item.season}` : `Season ${item.season}`).join(" · ") : achievement.description;
    return `<article class="achievement ${earned ? "earned" : "locked"}"><i class="achievement-emblem ${tier}" aria-hidden="true"></i><div><span>${earned ? "Earned" : "Locked"}${awards.length > 1 ? ` ×${awards.length}` : ""}</span><h3>${achievement.title}</h3><p>${detail}</p></div></article>`;
  }).join("")}</div></section>`).join("")}`;
}

function renderPlayerProfile(record) {
  const career = record.career;
  const seasons = Object.values(record.seasons).sort((first, second) => second.season - first.season);
  const panel = document.querySelector("#playerHistoryPanel");
  const content = document.querySelector("#playerHistoryContent");
  const general = record.primaryRole === "General";
  const columns = general ? ["GP", "RTG", "W-L", "TEAM ELIM", "SURVIVAL", "ZONES", "ZONE WINS", "ELIM WINS"] : ["GP", "RTG", "W-L", "ELIM", "AST", "CAP", "DEF", "INT", "DIST", "DECOYS", "DENIED", "COVERAGE", "SURVIVAL"];
  const statValues = (totals, generalTotals) => general
    ? [generalTotals?.starts || 0, generalTotals?.starts ? (generalTotals.ratingTotal / generalTotals.starts).toFixed(1) : "—", `${generalTotals?.wins || 0}-${generalTotals?.losses || 0}`, generalTotals?.teamEliminations || 0, generalTotals?.starts ? `${(generalTotals.survivalTotal / generalTotals.starts).toFixed(1)}%` : "0%", generalTotals?.zonesCaptured || 0, generalTotals?.zoneWins || 0, generalTotals?.eliminationWins || 0]
    : [totals.appearances, totals.appearances ? (totals.ratingTotal / totals.appearances).toFixed(1) : "—", `${totals.wins}-${totals.losses}`, totals.eliminations, totals.assists, totals.zoneCaptures, totals.zoneDefenses, totals.interceptions, formatRecordValue("distanceCarried", totals.distanceCarried), totals.decoysSuccessful, totals.decoysDenied, totals.coverageAppearances ? `${(totals.coverageTotal / totals.coverageAppearances).toFixed(1)}%` : "0%", totals.appearances ? `${(totals.survived / totals.appearances * 100).toFixed(1)}%` : "0%"];
  const seasonEntry = (season, team, totals, generalTotals) => {
    const values = totals ? statValues(totals, generalTotals) : columns.map((column) => column === "GP" ? team.appearances : column === "W-L" ? `${team.wins}-${team.losses}` : "—");
    return { year: 2999 + season.season, season: season.season, teamName: team?.teamName || "Combined season", unavailable: !totals, values };
  };
  const entries = seasons.flatMap((season) => {
    const teams = Object.values(season.teams || {});
    const rows = teams.map((team) => {
      const totals = team.totals?.appearances === team.appearances ? team.totals : teams.length === 1 ? season.totals : null;
      const generalTotals = teams.length === 1 && !team.general?.starts ? season.general : team.general;
      return seasonEntry(season, team, totals, generalTotals);
    });
    const needsCombined = teams.length !== 1 && teams.some((team) => team.totals?.appearances !== team.appearances);
    if (needsCombined) rows.push(seasonEntry(season, null, season.totals, season.general));
    return rows;
  });
  const featuredStats = general ? ["TEAM ELIM", "SURVIVAL", "ZONES"] : ({ Bruiser: ["ELIM", "DEF"], Cannon: ["ELIM", "AST"], Runner: ["CAP", "DIST"], Visual: ["DECOYS", "DENIED", "COVERAGE"], Musical: ["DECOYS", "DENIED", "COVERAGE"] })[record.primaryRole] || ["ELIM", "AST"];
  const overview = `<section class="profile-overview"><div class="profile-career-total"><strong>${career.appearances}</strong><span>Career appearances</span><b>${career.wins}-${career.losses}</b><span>Career record</span></div><div class="profile-career-copy"><p>${displayRole(record.primaryRole)} // ${seasons.length} seasons in the archive</p><p>${career.eliminations} eliminations // ${career.zoneCaptures} captures // ${career.assists} assists</p></div></section>`;
  const desktopStats = `<div class="profile-stats-scroll" role="region" aria-label="Season statistics" tabindex="0"><table class="profile-stats-table"><thead><tr><th scope="col">Year</th><th scope="col">Team</th>${columns.map((column) => `<th scope="col">${column}</th>`).join("")}</tr></thead><tbody>${entries.map((entry) => `<tr><th scope="row">${entry.year}<small>S${entry.season}</small></th><td class="profile-team-name" ${entry.unavailable ? `title="Team stats unavailable for this saved season"` : ""}>${entry.teamName}</td>${entry.values.map((value) => `<td>${value}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const mobileStats = `<div class="profile-stats-mobile">${entries.map((entry) => {
    const highlights = entry.unavailable ? ["GP", "W-L"] : ["GP", "RTG", ...featuredStats];
    return `<details class="profile-season-entry"><summary><span class="profile-season-identity"><strong>${entry.year}</strong><small>S${entry.season}</small><b>${entry.teamName}</b></span><span class="profile-season-highlights">${highlights.map((column) => `<span><b>${entry.values[columns.indexOf(column)]}</b>${column}</span>`).join("")}</span></summary><dl>${columns.map((column, index) => `<div><dt>${column}</dt><dd>${entry.values[index]}</dd></div>`).join("")}</dl>${entry.unavailable ? `<p>Team stats unavailable for this saved season.</p>` : ""}</details>`;
  }).join("")}</div>`;
  const seasonsView = `<section class="profile-seasons">${seasons.length ? desktopStats + mobileStats : `<p>No season stats recorded yet.</p>`}</section>`;
  const accolades = record.awards.slice().sort((first, second) => second.season - first.season).map((award) => `<li><b>${award.title}</b><span>Season ${award.season}${award.role ? ` // ${displayRole(award.role)}` : ""}${award.value ? ` // ${award.value}` : ""}</span></li>`).join("");
  const accoladesView = `<section class="profile-accolades"><div class="accolade-summary"><strong>${record.awards.length}</strong><span>Career accolades</span><strong>${career.championships}</strong><span>Championships</span></div><ol>${accolades || `<li><span>No accolades recorded yet.</span></li>`}</ol></section>`;
  const views = { overview, seasons: seasonsView, accolades: accoladesView };
  content.innerHTML = `<span class="menu-kicker">Player Archive</span><h2>${record.name}</h2><p class="history-role">${displayRole(record.primaryRole)} // Career Profile</p><nav class="profile-tabs"><button data-profile-view="overview" class="${activePlayerProfileView === "overview" ? "active" : ""}">Overview</button><button data-profile-view="seasons" class="${activePlayerProfileView === "seasons" ? "active" : ""}">Season Stats</button><button data-profile-view="accolades" class="${activePlayerProfileView === "accolades" ? "active" : ""}">Accolades</button></nav>${views[activePlayerProfileView]}`;
  panel.hidden = false;
}

function openPlayerHistory(playerId) {
  const record = franchiseSession?.playerRecords[playerId];
  if (!record) return;
  activePlayerProfileId = playerId;
  activePlayerProfileView = "seasons";
  renderPlayerProfile(record);
}

function renderRecords() {
  const content = document.querySelector("#recordsContent");
  const select = document.querySelector("#recordsStatSelect");
  if (!franchiseSession) {
    content.innerHTML = `<div class="records-empty"><strong>No franchise records yet.</strong><p>Complete the draft and begin the season to create the league archive.</p></div>`;
    select.hidden = true;
    return;
  }
  const completedGames = franchiseSession.schedule.flatMap((week) => week.games).filter((game) => game.status === "completed").length;
  document.querySelector("#recordsSeasonNumber").textContent = franchiseSession.season.toString().padStart(2, "0");
  document.querySelector("#recordsCycleLabel").textContent = `EWSL Archive // Season ${franchiseSession.season.toString().padStart(2, "0")}`;
  document.querySelector("#recordsGamesPlayed").textContent = `Set 3000-09-01`;
  const titles = { players: "Player Statistics", generals: "General Statistics", season: "Season Record Holders", games: "Game Records", career: "Career Leaders", history: "League History", trophies: "Trophy Room" };
  document.querySelector("#recordsViewTitle").textContent = titles[activeRecordView];
  document.querySelector("#recordsEyebrow").textContent = ["season", "career", "history"].includes(activeRecordView) ? "All Seasons" : `Season ${franchiseSession.season}`;
  select.hidden = true;
  if (!select.hidden) {
    const options = recordStats[activeRecordView];
    if (!options[activeRecordStat]) activeRecordStat = Object.keys(options)[0];
    select.innerHTML = Object.entries(options).map(([value, label]) => `<option value="${value}" ${value === activeRecordStat ? "selected" : ""}>${label}</option>`).join("");
  }
  if (activeRecordView === "players") content.innerHTML = renderLeaderboard(false);
  if (activeRecordView === "generals") content.innerHTML = renderLeaderboard(true);
  if (activeRecordView === "season") content.innerHTML = renderRecordBook("season");
  if (activeRecordView === "games") content.innerHTML = renderGameRecords();
  if (activeRecordView === "career") content.innerHTML = renderRecordBook("career");
  if (activeRecordView === "history") content.innerHTML = renderLeagueHistory();
  if (activeRecordView === "trophies") content.innerHTML = renderTrophyRoom();
}

function renderGameDetail(game) {
  const detail = document.querySelector("#gameDetail");
  if (game.result) {
    const result = game.result;
    const players = result.players?.home || [];
    detail.innerHTML = `<header class="game-detail-header"><div><span class="menu-kicker">Week ${game.week} Final</span><h2>Box Score</h2></div><span class="game-result-tag">${result.victoryType} Victory</span></header>
      <div class="game-detail-score"><span>${game.biome} // ${game.venue}</span><div class="detail-scoreline"><div><img src="${teamLogo(userDraftTeam.name)}" alt="">${userDraftTeam.name}</div><strong>${result.homeScore}-${result.awayScore}</strong><div><img src="${teamLogo(game.opponent)}" alt="">${game.opponent}</div></div><span>Units remaining ${result.homeUnits}-${result.awayUnits}</span></div>
      <div class="schedule-box"><h3>${userDraftTeam.name} Player Performance</h3><div class="schedule-box-scroll"><table><thead><tr><th>Player</th><th>Role</th><th>RTG</th><th>ELIM</th><th>AST</th><th>CAP</th><th>DEF</th><th>INT</th><th>Carry</th><th>Coverage</th></tr></thead><tbody>${players.map((player) => `<tr><td>${player.name}</td><td>${player.role}</td><td>${player.rating}</td><td>${player.eliminations}</td><td>${player.assists || 0}</td><td>${player.zoneCaptures || 0}</td><td>${player.zoneDefenses || 0}</td><td>${player.interceptions || 0}</td><td>${player.distanceCarried || 0}</td><td>${player.networkCoverage || 0}%</td></tr>`).join("")}</tbody></table></div></div>`;
    return;
  }
  const playable = game.status === "current";
  const simEligible = !franchiseSession?.complete && game.week >= (franchiseSession?.currentWeek || 1);
  detail.innerHTML = `<header class="game-detail-header"><div><span class="menu-kicker">Week ${game.week} ${playable ? "Current" : "Upcoming"}</span><h2>Match Brief</h2></div><span class="game-result-tag">${game.venue}</span></header>
    <div class="upcoming-brief"><img class="brief-opponent-logo" src="${teamLogo(game.opponent)}" alt=""><span class="menu-kicker">${userDraftTeam.name} vs</span><h2>${game.opponent}</h2><p>${game.biome} presents a symmetrical five-zone battlefield. Review the active lineup and lock a game plan before live simulation, or resolve the matchup immediately.</p><div class="matchup-facts"><div><span>Opponent form</span><strong>${game.week % 2 ? "Aggressive" : "Balanced"}</strong></div><div><span>Projected edge</span><strong>Home +2</strong></div></div></div>
    ${simEligible ? `<div class="game-actions"><button class="watch-live" data-season-action="watch" data-game-index="${game.week - 1}">Watch Live<span>${game.week > (franchiseSession?.currentWeek || 1) ? `Sim through Week ${game.week}` : "Open Strategy Room"}</span></button><button class="quick-sim" data-season-action="quick" data-game-index="${game.week - 1}">Quick Sim<span>${game.week > (franchiseSession?.currentWeek || 1) ? `Resolve Weeks 1-${game.week}` : "Resolve immediately"}</span></button></div>` : ""}`;
}

function storeSeasonResult(gameIndex, result) {
  if (gameIndex === null || !result) return;
  if (franchiseSession) {
    const targetWeek = seasonGames[gameIndex]?.week || franchiseSession.currentWeek;
    window.ProxyFranchise.playUntilWeek(franchiseSession, targetWeek, result);
    const completedWeek = targetWeek;
    syncUserSchedule();
    selectedSeasonGame = completedWeek - 1;
    persistFranchiseState();
    renderSeason();
    return;
  }
  const game = seasonGames[gameIndex];
  game.status = "completed";
  game.result = result;
  const next = seasonGames[gameIndex + 1];
  if (next) next.status = "current";
  const saved = Object.fromEntries(seasonGames.filter((item) => item.result && item.week > 3).map((item) => [item.week, item.result]));
  localStorage.setItem(seasonStorageKey, JSON.stringify(saved));
  selectedSeasonGame = gameIndex;
  renderSeason();
}

function getSelectedGamePlan() {
  const form = new FormData(document.querySelector("#gamePlanForm"));
  return {
    formation: form.get("formation"),
    tempo: form.get("tempo"),
    focus: form.get("focus"),
    risk: form.get("risk")
  };
}

function getUserActiveLineup() {
  const best = draftSession.buildActiveLineup(userDraftTeam);
  const rosterIds = new Set(userDraftTeam.roster.map((player) => player.id));
  if (!Array.isArray(selectedLineupSlots) || selectedLineupSlots.length !== 9 || selectedLineupSlots.some((id) => id && !rosterIds.has(id))) {
    const unused = best.lineup.slice();
    selectedLineupSlots = strategySlotOrder.map((role) => {
      const matchIndex = unused.findIndex((entry) => entry.role === role);
      return matchIndex < 0 ? null : unused.splice(matchIndex, 1)[0].player.id;
    });
    selectedLineupIds = new Set(selectedLineupSlots.filter(Boolean));
  }
  const lineupPlayers = selectedLineupSlots.map((id) => userDraftTeam.roster.find((player) => player.id === id)).filter(Boolean);
  return {
    lineup: lineupPlayers.map((player, index) => ({ player, role: strategySlotOrder[index] })),
    reserves: userDraftTeam.roster.filter((player) => !selectedLineupIds.has(player.id))
  };
}

function updateStrategyRoom() {
  const simulator = window.matchSimulator;
  if (!simulator) return;
  if (activeSeasonGame !== null) {
    configureSeasonMatchup(activeSeasonGame);
    const game = seasonGames[activeSeasonGame];
    const opponent = document.querySelector(".strategy-opponent");
    opponent.querySelector("strong").textContent = game.opponent;
    opponent.querySelector("small").textContent = `${game.biome} // ${game.venue}`;
    document.querySelector("#matchTitle").textContent = `Chicago Wind vs ${game.opponent}`;
  }
  const activeLineup = simulator.getRoster("home");
  const reserveLineup = simulator.getReserves("home");
  const visibleRoster = [...activeLineup, ...reserveLineup];
  const energyTag = (player) => `<i class="lineup-energy ${player.stamina < 75 ? "low" : ""}">Energy ${Math.round(player.stamina ?? 100)}%</i>`;
  document.querySelector("#strategyLineup").innerHTML = activeLineup.map((player, slotIndex) => `
    <button class="strategy-player ${selectedLineupIds.has(player.id) ? "selected" : ""} ${lineupSwapRole === slotIndex ? "swapping" : ""}" type="button" data-lineup-player="${player.id}" data-lineup-role="${player.role}" data-lineup-slot="${slotIndex}">
      <span>${shortRole(player.role)}</span>
      <div><small>${roleLineLabel({ ...player, primaryRole: player.primaryRole || player.role })}</small><strong>${player.name}</strong>${energyTag(player)}</div>
      <b>${player.overall}</b>
    </button>
  `).join("") + `<div class="bench-divider">Bench // select a starter, then a player to swap with</div>` + reserveLineup.map((player) => `
    <button class="strategy-player" type="button" data-lineup-player="${player.id}" data-lineup-role="${player.role}" data-lineup-reserve="true">
      <span>${shortRole(player.role)}</span>
      <div><small>${roleLineLabel({ ...player, primaryRole: player.primaryRole || player.role })}</small><strong>${player.name}</strong>${energyTag(player)}</div>
      <b>${player.overall}</b>
    </button>
  `).join("");
  document.querySelector("#strategyReserves").innerHTML = `<span class="reserve-player"><span>${selectedLineupIds.size} of 9 active // click players to swap</span><b>${12 - selectedLineupIds.size} reserve</b></span>`;
  document.querySelector("#activeLineupOverall").textContent = `${Math.round(activeLineup.reduce((sum, player) => sum + player.overall, 0) / activeLineup.length)} OVR`;
  const preview = simulator.previewPlan(getSelectedGamePlan());
  ["control", "combat", "defense", "mobility"].forEach((key) => {
    const value = preview[key];
    document.querySelector(`#plan${key[0].toUpperCase()}${key.slice(1)}Value`).textContent = value;
    document.querySelector(`#plan${key[0].toUpperCase()}${key.slice(1)}Bar`).style.width = `${value}%`;
  });
  document.querySelector("#planNote").textContent = preview.note;
}

function configureSeasonMatchup(gameIndex) {
  if (!franchiseSession) return;
  const displayGame = seasonGames[gameIndex];
  const opponent = franchiseSession.teams.find((team) => team.name === displayGame.opponent);
  if (!opponent) return;
  const homeLineup = getUserActiveLineup();
  const awayLineup = draftSession.buildActiveLineup(opponent);
  window.matchSimulator.setTeamRoster("home", homeLineup.lineup, homeLineup.reserves);
  window.matchSimulator.setTeamRoster("away", awayLineup.lineup, awayLineup.reserves);
  window.matchSimulator.setTeamIdentity("home", { name: userDraftTeam.name, abbreviation: teamAbbreviation(userDraftTeam.name), logo: teamLogo(userDraftTeam.name) });
  window.matchSimulator.setTeamIdentity("away", { name: opponent.name, abbreviation: teamAbbreviation(opponent.name), logo: teamLogo(opponent.name) });
}

function configurePlayoffMatch(game) {
  const opponentId = game.homeTeamId === userDraftTeam.id ? game.awayTeamId : game.homeTeamId;
  const opponent = franchiseSession.teams[opponentId];
  const homeLineup = getUserActiveLineup();
  const awayLineup = draftSession.buildActiveLineup(opponent);
  window.matchSimulator.setTeamRoster("home", homeLineup.lineup, homeLineup.reserves);
  window.matchSimulator.setTeamRoster("away", awayLineup.lineup, awayLineup.reserves);
  window.matchSimulator.setTeamIdentity("home", { name: userDraftTeam.name, abbreviation: teamAbbreviation(userDraftTeam.name), logo: teamLogo(userDraftTeam.name) });
  window.matchSimulator.setTeamIdentity("away", { name: opponent.name, abbreviation: teamAbbreviation(opponent.name), logo: teamLogo(opponent.name) });
  document.querySelector(".strategy-opponent strong").textContent = opponent.name;
  document.querySelector(".strategy-opponent small").textContent = `${game.round} // Postseason`;
  document.querySelector("#matchTitle").textContent = `${userDraftTeam.name} vs ${opponent.name}`;
}

function stopRenewalCpu() {
  if (renewalTimer) window.clearInterval(renewalTimer);
  renewalTimer = null;
}

function startRenewalCpu() {
  if (renewalTimer) return;
  renewalTimer = window.setInterval(() => {
    try {
      const stepped = !offseasonScreen.hidden && window.ProxyFranchise.renewalCpuStep(franchiseSession);
      if (!stepped) { stopRenewalCpu(); persistFranchiseState(); }
    } catch (error) { stopRenewalCpu(); showToast(`Renewal draft failed: ${error.message}`); }
    renderOffseason();
  }, 400);
}

function advanceOffseason() {
  try {
    window.ProxyFranchise.startOffseason(franchiseSession);
    selectedProtectionIds = new Set(franchiseSession.offseason.protections[userDraftTeam.id] || []);
    persistFranchiseState();
    showGameScreen(progressionScreen);
  } catch (error) { showToast(`Offseason failed: ${error.message}`); }
}

function startBriefing() {
  introCrawl.classList.remove("paused");
  introCrawl.classList.remove("manual");
  introCrawl.style.animation = "none";
  introCrawl.style.transform = "";
  void introCrawl.offsetWidth;
  introCrawl.style.animation = "";
  document.querySelector("#pauseIntroButton").textContent = "Pause";
  document.querySelector("#pauseIntroButton").setAttribute("aria-pressed", "false");
  showGameScreen(introScreen);
}

document.querySelector("#newGameButton").addEventListener("click", startBriefing);
document.querySelector("#continueGameButton").addEventListener("click", async () => {
  if (!latestSaveId) return;
  try { await restoreGame(await window.ProxySaves.load(latestSaveId)); } catch (error) { showToast(error.message); }
});
document.querySelector("#loadNewGameButton").addEventListener("click", startBriefing);
document.querySelector("#loadGameButton").addEventListener("click", () => showGameScreen(loadScreen));
document.querySelector("#rulesButton").addEventListener("click", () => { rulesEntry = "reference"; showRulesSlide(0); showGameScreen(rulesScreen); });
function openRulesFromIntro() {
  introCrawl.classList.add("paused");
  rulesEntry = "intro";
  showRulesSlide(0);
  showGameScreen(rulesScreen);
}
function returnToBriefing() {
  introCrawl.classList.add("manual");
  introCrawl.style.animation = "none";
  introCrawl.style.transform = "none";
  showGameScreen(introScreen);
  document.querySelector(".intro-date").scrollIntoView({ block: "start" });
}
function exitRules() {
  if (rulesEntry === "intro") returnToBriefing();
  else showGameScreen(rulesEntry === "newGame" ? franchiseScreen : mainMenu);
}
document.querySelector("#rulesBackButton").addEventListener("click", exitRules);
let activeRulesSlide = 0;
document.querySelector("#rulesToc").innerHTML = [...document.querySelectorAll(".rules-slide")].map((slide, index) => {
  const section = slide.querySelector(".menu-kicker").textContent.split("//")[1]?.trim();
  const label = section && section !== "Position" ? section : slide.querySelector("h2").textContent;
  return `<li><button data-rules-toc="${index}"><span>${label}</span><b>${index + 1}</b></button></li>`;
}).join("");
document.querySelector("#rulesToc").addEventListener("click", (event) => {
  const entry = event.target.closest("[data-rules-toc]");
  if (entry) showRulesSlide(Number(entry.dataset.rulesToc));
});
function showRulesSlide(index) {
  const lastSlide = document.querySelectorAll(".rules-slide").length - 1;
  activeRulesSlide = Math.max(0, Math.min(lastSlide, index));
  document.querySelectorAll("[data-rules-toc]").forEach((entry) => entry.classList.toggle("active", Number(entry.dataset.rulesToc) === activeRulesSlide));
  document.querySelectorAll(".rules-slide").forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === activeRulesSlide));
  document.querySelector("#rulesNextButton").textContent = activeRulesSlide === lastSlide ? (rulesEntry === "reference" ? "Close Rules" : "Choose Franchise →") : "Next →";
  document.querySelector("#skipRulesButton").textContent = rulesEntry === "intro" ? "Back to Briefing" : rulesEntry === "newGame" ? "Skip All" : "Exit Rules";
  document.querySelector("#rulesPrevButton").disabled = activeRulesSlide === 0;
  document.querySelector("#rulesCounter").textContent = `${activeRulesSlide + 1} / ${lastSlide + 1}`;
  document.querySelector(".rules-stage").scrollIntoView({ block: "start" });
}
document.querySelector("#rulesPrevButton").addEventListener("click", () => showRulesSlide(activeRulesSlide - 1));
document.querySelector("#rulesNextButton").addEventListener("click", () => {
  if (activeRulesSlide < document.querySelectorAll(".rules-slide").length - 1) { showRulesSlide(activeRulesSlide + 1); return; }
  showGameScreen(rulesEntry === "reference" ? mainMenu : franchiseScreen);
});
document.querySelector("#skipRulesButton").addEventListener("click", exitRules);
document.querySelector("#loadBackButton").addEventListener("click", () => showGameScreen(mainMenu));
document.querySelector("#matchBackButton").addEventListener("click", () => showGameScreen(activePlayoffGame ? playoffsScreen : activeSeasonGame === null ? mainMenu : seasonScreen));
document.querySelector("#strategyBackButton").addEventListener("click", () => showGameScreen(franchiseSession ? seasonScreen : mainMenu));
document.querySelector("#seasonBackButton").addEventListener("click", () => showGameScreen(mainMenu));
document.querySelector("#gamePlanForm").addEventListener("change", () => {
  defaultGamePlan = getSelectedGamePlan();
  updateStrategyRoom();
});
document.querySelector("#bestLineupButton").addEventListener("click", () => {
  selectedLineupSlots = null;
  getUserActiveLineup();
  updateStrategyRoom();
});
document.querySelector("#strategyLineup").addEventListener("click", (event) => {
  const playerButton = event.target.closest("[data-lineup-player]");
  if (!playerButton) return;
  const playerId = playerButton.dataset.lineupPlayer;
  const isReserve = playerButton.dataset.lineupReserve === "true";
  getUserActiveLineup();
  if (lineupSwapRole === null) {
    if (isReserve) { showToast("Select a starter first, then the player to swap in"); return; }
    lineupSwapRole = Number(playerButton.dataset.lineupSlot);
    playerButton.classList.add("swapping");
    showToast("Now select a starter or bench player to swap with");
    return;
  }
  const fromSlot = lineupSwapRole;
  lineupSwapRole = null;
  if (isReserve) selectedLineupSlots[fromSlot] = playerId;
  else {
    const toSlot = Number(playerButton.dataset.lineupSlot);
    [selectedLineupSlots[fromSlot], selectedLineupSlots[toSlot]] = [selectedLineupSlots[toSlot], selectedLineupSlots[fromSlot]];
  }
  selectedLineupIds = new Set(selectedLineupSlots.filter(Boolean));
  if (activePlayoffGame) configurePlayoffMatch(activePlayoffGame);
  updateStrategyRoom();
});
document.querySelector("#launchMatchButton").addEventListener("click", () => {
  document.querySelector("#matchCompletionActions").hidden = true;
  window.matchSimulator.setCompletionHandler(activePlayoffGame
    ? (result) => { try { window.ProxyFranchise.playPlayoffRound(franchiseSession, result); persistFranchiseState(); document.querySelector("#matchCompletionActions").hidden = false; } catch (error) { showToast(`Playoff result failed: ${error.message}`); } }
    : activeSeasonGame === null ? null : (result) => { storeSeasonResult(activeSeasonGame, result); document.querySelector("#matchCompletionActions").hidden = false; });
  window.matchSimulator.configure(getSelectedGamePlan());
  showGameScreen(matchScreen);
});
document.querySelector("#matchContinueButton").addEventListener("click", () => {
  document.querySelector("#matchCompletionActions").hidden = true;
  showGameScreen(activePlayoffGame ? playoffsScreen : seasonScreen);
});
document.querySelector("#skipIntroButton").addEventListener("click", () => showGameScreen(franchiseScreen));
document.querySelector("#beginDraftButton").addEventListener("click", () => showGameScreen(franchiseScreen));
document.querySelector("#introRulesButton").addEventListener("click", openRulesFromIntro);
document.querySelector("#introRulesFinalButton").addEventListener("click", openRulesFromIntro);
document.querySelector("#franchiseBackButton").addEventListener("click", () => showGameScreen(mainMenu));
document.querySelector("#franchiseGrid").addEventListener("click", (event) => {
  const choice = event.target.closest("[data-team-index]");
  if (!choice) return;
  selectedFranchiseIndex = Number(choice.dataset.teamIndex);
  renderFranchiseSelect();
});
document.querySelector("#confirmFranchiseButton").addEventListener("click", () => { applyFranchiseSelection(); showGameScreen(gameInterface); });
document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  showGameScreen(mainMenu);
});
document.querySelector("#recordsBackButton").addEventListener("click", () => showGameScreen(franchiseSession ? seasonScreen : gameInterface));
document.querySelector("#squadBackButton").addEventListener("click", () => showGameScreen(franchiseSession ? seasonScreen : gameInterface));
document.querySelector("#playoffsBackButton").addEventListener("click", () => showGameScreen(seasonScreen));
document.querySelectorAll(".records-tab").forEach((button) => {
  button.addEventListener("click", () => {
    activeRecordView = button.dataset.recordView;
    document.querySelectorAll(".records-tab").forEach((item) => item.classList.toggle("active", item === button));
    renderRecords();
  });
});
document.querySelector("#recordsStatSelect").addEventListener("change", (event) => {
  activeRecordStat = event.target.value;
  renderRecords();
});
document.querySelector("#recordsContent").addEventListener("click", (event) => {
  const sort = event.target.closest("[data-record-stat]");
  if (sort) { activeRecordStat = sort.dataset.recordStat; renderRecords(); return; }
  const player = event.target.closest("[data-player-record]");
  if (player) openPlayerHistory(player.dataset.playerRecord);
});
document.querySelector("#playerHistoryClose").addEventListener("click", () => { document.querySelector("#playerHistoryPanel").hidden = true; });
document.querySelector("#playerHistoryPanel").addEventListener("click", (event) => {
  const tab = event.target.closest("[data-profile-view]");
  if (!tab || !activePlayerProfileId) return;
  activePlayerProfileView = tab.dataset.profileView;
  const record = franchiseSession?.playerRecords[activePlayerProfileId];
  if (record) renderPlayerProfile(record);
});
document.querySelector("#scheduleList").addEventListener("click", (event) => {
  const gameButton = event.target.closest("[data-game-index]");
  if (!gameButton) return;
  selectedSeasonGame = Number(gameButton.dataset.gameIndex);
  renderSeason();
});
document.querySelectorAll(".season-view-button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.seasonAction === "lineup") {
      activeSeasonGame = seasonGames.findIndex((game) => game.status === "current");
      if (activeSeasonGame < 0) activeSeasonGame = selectedSeasonGame;
      showGameScreen(strategyScreen);
      return;
    }
    if (button.dataset.seasonAction === "free-agents") { showGameScreen(squadScreen); return; }
    if (button.dataset.seasonAction === "records") { activeRecordView = "players"; showGameScreen(recordsScreen); return; }
    if (button.dataset.seasonAction === "trophies") { activeRecordView = "trophies"; showGameScreen(recordsScreen); return; }
    activeSeasonView = button.dataset.seasonView;
    renderSeason();
  });
});
document.querySelector("#gameDetailPanel").addEventListener("click", (event) => {
  const action = event.target.closest("[data-season-action]");
  if (!action) return;
  event.preventDefault();
  if (action.dataset.seasonAction === "squad") { showGameScreen(squadScreen); return; }
  if (action.dataset.seasonAction === "records") { showGameScreen(recordsScreen); return; }
  activeSeasonGame = Number(action.dataset.gameIndex);
  configureSeasonMatchup(activeSeasonGame);
  if (action.dataset.seasonAction === "watch") {
    showGameScreen(strategyScreen);
    return;
  }
  action.disabled = true;
  action.dataset.originalLabel = action.innerHTML;
  action.innerHTML = "Resolving...<span>Updating schedule and records</span>";
  showToast("Resolving selected week and all prior weeks...");
  window.setTimeout(() => {
    const resolvedGameIndex = activeSeasonGame;
    try {
      window.matchSimulator.setCompletionHandler(null);
      const result = window.matchSimulator.quickSim(defaultGamePlan || getSelectedGamePlan());
      storeSeasonResult(resolvedGameIndex, result);
      activeSeasonView = "schedule";
      showGameScreen(seasonScreen);
      window.requestAnimationFrame(() => renderSeason());
      showToast(`Week ${seasonGames[resolvedGameIndex].week} and prior weeks resolved`);
    } catch (error) {
      try { activeSeasonView = "schedule"; showGameScreen(seasonScreen); renderSeason(); } catch { /* Preserve the original error for the user. */ }
      showToast(`Simulation failed: ${error.message}`);
    }
  }, 0);
});
document.querySelector("#postseasonControl").addEventListener("click", (event) => {
  const action = event.target.closest("[data-postseason-action]")?.dataset.postseasonAction;
  if (!action || !franchiseSession) return;
  if (action === "awards") { showGameScreen(awardsScreen); return; }
  if (action === "playoffs") {
    try {
      window.ProxyFranchise.startPlayoffs(franchiseSession);
      showGameScreen(playoffsScreen);
      showToast("Playoffs ready // Wild Card round");
    } catch (error) { showToast(`Playoff startup failed: ${error.message}`); }
    return;
  }
  advanceOffseason();
});
document.querySelector("#playoffCommand").addEventListener("click", (event) => {
  const action = event.target.closest("[data-playoff-action]")?.dataset.playoffAction;
  if (!action) return;
  if (action === "awards") { showGameScreen(awardsScreen); return; }
  if (action === "back-to-bracket") { document.querySelector("#playoffBoxscoreModal").hidden = true; return; }
  if (action === "offseason") { advanceOffseason(); return; }
  if (action === "round") {
    advancePlayoffRound();
    return;
  }
  const game = window.ProxyFranchise.playoffGameForUser(franchiseSession);
  if (!game) { showToast("No user matchup is available in this round."); return; }
  activePlayoffGame = game;
  activeSeasonGame = null;
  try {
    configurePlayoffMatch(game);
    if (action === "watch") { showGameScreen(strategyScreen); return; }
    window.matchSimulator.setCompletionHandler(null);
    const result = window.matchSimulator.quickSim(defaultGamePlan || getSelectedGamePlan());
    window.ProxyFranchise.playPlayoffRound(franchiseSession, result);
    persistFranchiseState();
    activePlayoffGame = null;
    renderPlayoffs();
    showToast(`${game.round} Quick Sim complete`);
  } catch (error) { activePlayoffGame = null; showToast(`Playoff simulation failed: ${error.message}`); }
});
document.querySelector("#bracketBoard").addEventListener("click", (event) => {
  const card = event.target.closest("[data-playoff-game]");
  if (!card) return;
  const game = [...(franchiseSession.playoffs?.games || []), ...(franchiseSession.playoffs?.pendingGames || [])].find((item) => item.id === card.dataset.playoffGame);
  if (game?.result) renderPlayoffBoxscore(game);
  else showToast("This matchup has not been resolved yet");
});
document.querySelector("#closePlayoffBoxscore").addEventListener("click", () => { document.querySelector("#playoffBoxscoreModal").hidden = true; });
document.querySelector("#closeChampionship").addEventListener("click", () => { document.querySelector("#championshipModal").hidden = true; });
document.querySelector("#championshipModal").addEventListener("click", (event) => {
  if (event.target.closest("[data-championship-action='continue']")) document.querySelector("#championshipModal").hidden = true;
});
document.querySelector("#offseasonBackButton").addEventListener("click", () => showGameScreen(playoffsScreen));
document.querySelector("#awardsBackButton").addEventListener("click", () => showGameScreen(seasonScreen));
document.querySelector("#progressionBackButton").addEventListener("click", () => showGameScreen(awardsScreen));
document.querySelector("#progressionCommand").addEventListener("click", (event) => {
  if (!event.target.closest("[data-progression-action='continue']")) return;
  showGameScreen(offseasonScreen);
});
document.querySelector("#awardsCommand").addEventListener("click", (event) => {
  const action = event.target.closest("[data-awards-action]")?.dataset.awardsAction;
  if (action === "playoffs") { try { window.ProxyFranchise.startPlayoffs(franchiseSession); showGameScreen(playoffsScreen); } catch (error) { showToast(`Playoffs failed: ${error.message}`); } }
  if (action === "offseason") {
    try {
      if (!franchiseSession?.playoffs?.complete) throw new Error("The playoff final is not complete.");
      advanceOffseason();
      showToast("Season progression ready");
    } catch (error) { showToast(`Offseason failed: ${error.message}`); }
  }
});
document.querySelector("#awardsBoard").addEventListener("click", (event) => {
  const tab = event.target.closest("[data-award-type]");
  if (!tab) return;
  selectedAwardType = tab.dataset.awardType;
  renderAwards();
});
document.querySelector("#offseasonGrid").addEventListener("click", (event) => {
  const protect = event.target.closest("[data-protect-id]");
  if (protect) {
    const id = protect.dataset.protectId;
    if (selectedProtectionIds.has(id)) selectedProtectionIds.delete(id);
    else if (selectedProtectionIds.size < 6) selectedProtectionIds.add(id);
    renderOffseason();
    return;
  }
  const filter = event.target.closest("[data-renewal-filter]");
  if (filter) { renewalFilter = filter.dataset.renewalFilter; renderOffseason(); return; }
  const sort = event.target.closest("[data-renewal-sort]");
  if (sort) {
    const key = sort.dataset.renewalSort;
    renewalSort = renewalSort.key === key ? { key, dir: -renewalSort.dir } : { key, dir: -1 };
    renderOffseason();
    return;
  }
  const draftNow = event.target.closest("[data-renewal-draft]");
  if (draftNow) {
    if (!window.ProxyFranchise.renewalUserPick(franchiseSession, draftNow.dataset.renewalDraft)) { showToast("That player cannot be drafted"); return; }
    renewalSelectedId = null;
    persistFranchiseState();
    renderOffseason();
    return;
  }
  const row = event.target.closest("[data-renewal-select]");
  if (row && !row.classList.contains("full")) { renewalSelectedId = row.dataset.renewalSelect; renderOffseason(); }
});
document.querySelector("#offseasonCommand").addEventListener("click", (event) => {
  const action = event.target.closest("[data-offseason-action]")?.dataset.offseasonAction;
  if (!action) return;
  if (action === "recommend") {
    selectedProtectionIds = new Set(window.ProxyFranchise.recommendedProtections(userDraftTeam).map((player) => player.id));
    renderOffseason();
    return;
  }
  if (action === "protect") {
    if (!window.ProxyFranchise.submitProtections(franchiseSession, [...selectedProtectionIds])) { showToast("Select a valid group of six players"); return; }
    persistFranchiseState();
    renderOffseason();
    return;
  }
  if (action === "draft-pick" || action === "auto-pick") {
    const picked = action === "draft-pick" ? window.ProxyFranchise.renewalUserPick(franchiseSession, renewalSelectedId) : window.ProxyFranchise.renewalAutoPick(franchiseSession);
    if (!picked) { showToast("That player cannot be drafted"); return; }
    renewalSelectedId = null;
    persistFranchiseState();
    renderOffseason();
    return;
  }
  if (action === "sim-to-user" || action === "sim-all") {
    stopRenewalCpu();
    try { window.ProxyFranchise.simulateRenewal(franchiseSession, { stopAtUser: action === "sim-to-user" }); } catch (error) { showToast(`Renewal draft failed: ${error.message}`); }
    persistFranchiseState();
    renderOffseason();
    return;
  }
  if (action === "next-season") {
    const summary = window.ProxyFranchise.beginNextSeason(franchiseSession);
    userDraftTeam = franchiseSession.teams[franchiseSession.userTeamId];
    syncUserSchedule();
    selectedSeasonGame = 0;
    activeSeasonView = "schedule";
    activePlayoffGame = null;
    persistFranchiseState();
    showToast(`Season ${summary.season} ready`);
    showGameScreen(seasonScreen);
  }
});
document.querySelector("#pauseIntroButton").addEventListener("click", (event) => {
  const paused = introCrawl.classList.toggle("paused");
  event.currentTarget.textContent = paused ? "Resume" : "Pause";
  event.currentTarget.setAttribute("aria-pressed", String(paused));
});
function activateManualIntro() {
  if (introCrawl.classList.contains("manual")) return;
  const currentTransform = getComputedStyle(introCrawl).transform;
  introCrawl.classList.add("manual");
  introCrawl.style.animation = "none";
  if (currentTransform !== "none") introCrawl.style.transform = currentTransform;
}

document.querySelector(".crawl-viewport").addEventListener("wheel", activateManualIntro, { passive: true });
document.querySelector(".crawl-viewport").addEventListener("touchstart", activateManualIntro, { passive: true });
document.querySelector(".crawl-viewport").addEventListener("scroll", activateManualIntro, { passive: true });
document.querySelector("#saveImport").addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  try {
    const imported = await window.ProxySaves.importText(await file.text());
    showToast(`${imported.length} save${imported.length === 1 ? "" : "s"} imported`);
    await renderSaveList();
    await refreshContinueButton();
  } catch (error) { showToast(error.message); }
  event.target.value = "";
});
document.querySelector("#manualSaveButton").addEventListener("click", async () => {
  try { await saveCurrentGame("manual"); showToast("Manual save created"); await renderSaveList(); } catch (error) { showToast(error.message); }
});
document.querySelector("#exportAllButton").addEventListener("click", async () => {
  try { await window.ProxySaves.exportAll(); } catch (error) { showToast(error.message); }
});
document.querySelector("#saveList").addEventListener("click", async (event) => {
  const action = event.target.closest("[data-save-action]");
  if (!action) return;
  const id = action.dataset.saveId;
  try {
    if (action.dataset.saveAction === "load") await restoreGame(await window.ProxySaves.load(id));
    if (action.dataset.saveAction === "export") await window.ProxySaves.exportSave(id);
    if (action.dataset.saveAction === "delete") { await window.ProxySaves.remove(id); await renderSaveList(); await refreshContinueButton(); }
  } catch (error) { showToast(error.message); }
});

function renderRoster() {
  document.querySelector("#draftTeamLogo").src = teamLogo(userDraftTeam.name);
  document.querySelector("#draftTeamLogo").alt = `${userDraftTeam.name} logo`;
  document.querySelector("#draftTeamName").textContent = userDraftTeam.name;
  const remaining = userDraftTeam.roster.slice();
  const takeRole = (role) => {
    const index = remaining.findIndex((player) => player.primaryRole === role);
    return index < 0 ? null : remaining.splice(index, 1)[0];
  };
  const rows = [...starterSlots.map((role) => ({ role, label: "Starter", member: takeRole(role) })), ...benchSlots.map((role) => ({ role, label: "Bench", member: takeRole(role) }))];
  rosterList.innerHTML = rows.map(({ role, label, member }) => {
    const player = member;
    return `
    <div class="roster-slot ${player ? "filled" : "open"}">
      ${player
        ? `<img class="roster-avatar" src="${playerImage(player)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">`
        : `<span class="roster-avatar empty">+</span>`}
      <span><small>${label === "Bench" ? label : `${label} // ${role}`}</small><strong>${player?.name || "Open Position"}</strong></span>
      <span class="roster-rating">${player?.overall ?? "--"}</span>
    </div>
  `;
  }).join("");
  document.querySelector("#rosterCapacity").textContent = `${userDraftTeam.roster.length} / 12`;
  const roleCoverage = new Set(userDraftTeam.roster.map((player) => player.primaryRole)).size;
  const chemistry = Math.min(99, 42 + Math.round(userDraftTeam.roster.length / 12 * 34) + Math.round(roleCoverage / 6 * 24));
  const chemistryDial = document.querySelector(".chemistry-dial");
  chemistryDial.style.setProperty("--score", chemistry);
  chemistryDial.querySelector("strong").textContent = chemistry;
  document.querySelector(".chemistry-summary > div:last-child > strong").textContent = chemistry >= 82 ? "Connected Vanguard" : chemistry >= 65 ? "Forming Vanguard" : "Unformed Squad";
  document.querySelector(".chemistry-summary > div:last-child > p").textContent = `${roleCoverage}/6 role families online // improves as the roster fills`;
}

function ratingForDraftView(player) {
  return player.roleRatings[player.primaryRole] ?? player.overall;
}

function renderCandidates() {
  const allAvailable = draftSession.availablePlayers().filter((player) => {
    const matchesRole = activeRoleFilter === "All" || (activeRoleFilter === "Watchlist" ? watchlistIds.has(player.id) : player.primaryRole === activeRoleFilter);
    const matchesSearch = !draftSearch || player.name.toLowerCase().includes(draftSearch);
    return matchesRole && matchesSearch && draftSession.canPick(player);
  }).sort((first, second) => ratingForDraftView(second) - ratingForDraftView(first) || first.name.localeCompare(second.name));
  prospects = allAvailable;
  if (!prospects.some((player) => player.id === selectedProspectId)) selectedProspectId = prospects[0]?.id || null;
  const attributeColumns = draftAttributeOrders[activeRoleFilter === "Watchlist" ? "All" : activeRoleFilter];
  const overallLabel = "OVR MAIN";
  const tableStyle = `--stat-count:${attributeColumns.length}`;
  candidateRail.style.setProperty("--stat-count", attributeColumns.length);
  candidateRail.innerHTML = `<div class="candidate-table-head" style="${tableStyle}"><span>Player</span><span>Position</span><span>${overallLabel}</span>${attributeColumns.map((attribute) => `<span>${attributeLabels[attribute]}</span>`).join("")}</div>${prospects.map((prospect) => `
    <button class="candidate candidate-row ${prospect.id === selectedProspectId ? "active" : ""}" data-prospect-id="${prospect.id}">
      <span class="candidate-name"><img src="${playerImage(prospect)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"><strong>${prospect.name}</strong></span><span>${roleLineLabel(prospect)}</span><b>${ratingForDraftView(prospect)}</b>${attributeColumns.map((attribute) => `<span>${prospect.attributes[attribute]}</span>`).join("")}
    </button>
  `).join("")}`;
  document.querySelector("#draftPoolSummary").textContent = `${allAvailable.length} available // scroll to browse`;
}

function selectProspect(playerId) {
  selectedProspectId = playerId;
  const prospect = draftSession.state.players.find((player) => player.id === playerId);
  if (!prospect) return;
  const nameParts = prospect.name.split(" ");
  const displayName = nameParts.length > 1 ? `${nameParts.slice(0, -1).join(" ")}<br>${nameParts.at(-1)}` : prospect.name;
  document.querySelector("#prospectName").innerHTML = displayName;
  document.querySelector("#prospectRole").textContent = `${roleLineLabel(prospect)} // ${ratingForDraftView(prospect)} OVR`;
  document.querySelector("#prospectPortrait").src = playerImage(prospect);
  document.querySelector("#prospectPortrait").loading = "eager";
  document.querySelector("#prospectPortrait").decoding = "async";
  document.querySelector("#prospectPortrait").referrerPolicy = "no-referrer";
  const secondaryRoles = (prospect.flexRoles || []).map((role) => [role, prospect.roleRatings[role]]).sort((a, b) => b[1] - a[1]);
  document.querySelector("#prospectEra").textContent = `Natural: ${displayRole(prospect.primaryRole)} ${ratingForDraftView(prospect)} // ${secondaryRoles.length ? `Secondary: ${secondaryRoles.map(([role, rating]) => `${displayRole(role)} ${rating}`).join(", ")}` : "No secondary positions"}`;
  document.querySelector(".rank").textContent = `Overall Rank ${draftSession.availablePlayers().sort((first, second) => second.overall - first.overall).findIndex((player) => player.id === playerId) + 1}`;
  const attributeRows = document.querySelectorAll(".attribute-grid > div");
  roleAttributeLabels[prospect.primaryRole].forEach(([label, key], index) => {
    attributeRows[index].querySelector("span").textContent = label;
    attributeRows[index].querySelector("strong").textContent = prospect.attributes[key];
    attributeRows[index].querySelector("i").style.setProperty("--value", `${prospect.attributes[key]}%`);
  });
  const secondary = Object.entries(prospect.roleRatings).filter(([role]) => role !== prospect.primaryRole).sort((a, b) => b[1] - a[1])[0];
  document.querySelector(".prospect-summary").textContent = `${displayRole(prospect.primaryRole)} specialist with a ${secondary[1]} secondary rating at ${displayRole(secondary[0])}. Current form is neutral.`;
  const topAttributes = Object.entries(prospect.attributes).sort((a, b) => b[1] - a[1]).slice(0, 3);
  document.querySelector(".traits").innerHTML = topAttributes.map(([key]) => `<span>${key.replace(/([A-Z])/g, " $1")}</span>`).join("");
  const counts = draftSession.roleCounts(userDraftTeam);
  const needed = (window.ProxyDraft.ROSTER_TARGETS[prospect.primaryRole] || 0) > (counts[prospect.primaryRole] || 0);
  document.querySelector(".fit-grade").textContent = needed ? "A" : "B";
  document.querySelector(".fit-callout p").textContent = needed ? `Fills an open ${displayRole(prospect.primaryRole)} roster target.` : `Adds depth and positional flexibility at ${displayRole(prospect.primaryRole)}.`;
  document.querySelector("#draftButton").childNodes[0].textContent = `Draft ${prospect.name.split(" ")[0]} `;
  document.querySelector("#watchButton").classList.toggle("saved", watchlistIds.has(prospect.id));
  document.querySelector("#watchButton").innerHTML = watchlistIds.has(prospect.id) ? "<span>◆</span> Watching" : "<span>◇</span> Watchlist";
  renderCandidates();
}

function renderDraftBoard() {
  const board = document.querySelector("#draftBoard");
  const isCpuTurn = !draftSession.state.complete && draftSession.currentPick()?.teamIndex !== userDraftTeam.id;
  board.hidden = !isCpuTurn && !draftBoardView;
  if (!isCpuTurn && !draftBoardView) return;
  const recent = draftSession.state.history.slice(-10).reverse().map((entry) => {
    const team = draftSession.state.teams[entry.teamIndex];
    const player = draftSession.state.players.find((candidate) => candidate.id === entry.playerId);
    return `<div><span>${entry.overall.toString().padStart(3, "0")}</span><strong>${team.name}</strong><b>${player.name}</b><small>${displayRole(player.primaryRole)} // ${player.roleRatings[player.primaryRole]} OVR</small></div>`;
  }).join("");
  const pick = draftSession.currentPick();
  board.innerHTML = `<header><div><span class="eyebrow">Live Draft Board</span><h2>${isCpuTurn ? `${draftSession.state.teams[pick.teamIndex].name} is selecting` : "Draft history"}</h2></div>${isCpuTurn ? `<button data-draft-board-action="skip">Skip to Your Pick</button>` : ""}</header><div class="draft-board-list">${recent || "<p>Waiting for the first selection.</p>"}</div>`;
}

function stopCpuDraft() {
  if (cpuDraftTimer) window.clearInterval(cpuDraftTimer);
  cpuDraftTimer = null;
}

function startCpuDraft() {
  stopCpuDraft();
  if (draftSession.state.complete || draftSession.currentPick()?.teamIndex === userDraftTeam.id) return;
  cpuDraftTimer = window.setInterval(() => {
    draftSession.commitCpuPick();
    updateDraftUI();
    if (draftSession.state.complete || draftSession.currentPick()?.teamIndex === userDraftTeam.id) stopCpuDraft();
  }, 500);
}

function updateDraftUI() {
  renderRoster();
  renderCandidates();
  renderDraftBoard();
  const pick = draftSession.currentPick();
  gameInterface.classList.toggle("cpu-turn", Boolean(pick && pick.teamIndex !== userDraftTeam.id));
  if (pick) {
    document.querySelector("#draftPickStatus").textContent = `Round ${pick.round} / Pick ${draftSession.state.pickIndex + 1}`;
    document.querySelector("#draftTeamStatus").textContent = draftSession.state.teams[pick.teamIndex].name;
    document.querySelector("#globalSeasonLabel").textContent = "Draft // Preseason";
    document.querySelector("#draftButton").disabled = pick.teamIndex !== userDraftTeam.id;
    if (pick.teamIndex === userDraftTeam.id && draftClockPickIndex !== draftSession.state.pickIndex) {
      draftClockPickIndex = draftSession.state.pickIndex;
      remainingSeconds = USER_PICK_SECONDS;
    }
    document.querySelector("#draftClock").textContent = pick.teamIndex === userDraftTeam.id ? `${Math.floor(remainingSeconds / 60).toString().padStart(2, "0")}:${(remainingSeconds % 60).toString().padStart(2, "0")}` : "CPU";
    document.querySelector("#autoDraftButton").innerHTML = "Auto Draft <span>→</span>";
  } else {
    document.querySelector("#draftPickStatus").textContent = "Draft Complete";
    document.querySelector("#draftTeamStatus").textContent = "Roster locked";
    document.querySelector("#draftButton").disabled = false;
    document.querySelector("#draftButton").innerHTML = "Enter Season <span>→</span>";
    document.querySelector("#autoDraftButton").innerHTML = "Continue to Season <span>→</span>";
  }
  if (pick?.teamIndex !== userDraftTeam.id) startCpuDraft();
  if (selectedProspectId) selectProspect(selectedProspectId);
}

function autoSelectDraftPick() {
  if (draftSession.state.complete || draftSession.currentPick()?.teamIndex !== userDraftTeam.id) return;
  const player = draftSession.state.players.find((candidate) => draftSession.canPick(candidate) && draftSession.state.availableIds.has(candidate.id));
  if (!player) return;
  draftSession.userPick(player.id, { advance: false });
  selectedProspectId = null;
  updateDraftUI();
  startCpuDraft();
  void saveCurrentGame("autosave");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

candidateRail.addEventListener("click", (event) => {
  const candidate = event.target.closest(".candidate");
  if (!candidate) return;
  selectProspect(candidate.dataset.prospectId);
  if (window.matchMedia("(max-width: 760px)").matches) document.querySelector(".prospect-card").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector("#draftBoard").addEventListener("click", (event) => {
  if (!event.target.closest("[data-draft-board-action='skip']")) return;
  stopCpuDraft();
  draftSession.advanceToUser();
  updateDraftUI();
});
document.querySelector("#draftRoomTab").addEventListener("click", () => {
  draftBoardView = false;
  gameInterface.classList.remove("draft-board-view");
  document.querySelector("#draftRoomTab").classList.add("active");
  document.querySelector("#draftBoardTab").classList.remove("active");
  renderDraftBoard();
});
document.querySelector("#draftBoardTab").addEventListener("click", () => {
  draftBoardView = true;
  gameInterface.classList.add("draft-board-view");
  document.querySelector("#draftBoardTab").classList.add("active");
  document.querySelector("#draftRoomTab").classList.remove("active");
  renderDraftBoard();
});

document.querySelector("#draftSearch").addEventListener("input", (event) => {
  draftSearch = event.target.value.trim().toLowerCase();
  renderCandidates();
  if (selectedProspectId) selectProspect(selectedProspectId);
});

document.querySelectorAll(".role-filter").forEach((button) => {
  button.addEventListener("click", () => {
    activeRoleFilter = button.dataset.roleFilter;
    document.querySelectorAll(".role-filter").forEach((item) => item.classList.toggle("active", item === button));
    renderCandidates();
    if (selectedProspectId) selectProspect(selectedProspectId);
  });
});

document.querySelector("#watchButton").addEventListener("click", (event) => {
  if (!selectedProspectId) return;
  if (watchlistIds.has(selectedProspectId)) watchlistIds.delete(selectedProspectId);
  else watchlistIds.add(selectedProspectId);
  const saved = watchlistIds.has(selectedProspectId);
  event.currentTarget.classList.toggle("saved", saved);
  event.currentTarget.innerHTML = saved ? "<span>◆</span> Watching" : "<span>◇</span> Watchlist";
  showToast(saved ? "Added to private board" : "Removed from private board");
  renderCandidates();
});

document.querySelector("#draftButton").addEventListener("click", () => {
  if (draftSession.state.complete) {
    const home = draftSession.buildActiveLineup(userDraftTeam);
    const berlinTeam = draftSession.state.teams.find((team) => team.name === "Berlin Union");
    const berlin = draftSession.buildActiveLineup(berlinTeam);
    window.matchSimulator.setTeamRoster("home", home.lineup, home.reserves);
    window.matchSimulator.setTeamRoster("away", berlin.lineup, berlin.reserves);
    initializeFranchiseSeason();
    activeSeasonGame = null;
    showGameScreen(seasonScreen);
    void saveCurrentGame("autosave");
    return;
  }
  const prospect = draftSession.state.players.find((player) => player.id === selectedProspectId);
  if (!prospect || draftSession.currentPick()?.teamIndex !== userDraftTeam.id || !draftSession.userPick(prospect.id, { advance: false })) {
    showToast("That pick would leave an unfillable roster position");
    return;
  }
  showToast(`${prospect.name} drafted // ${userDraftTeam.roster.length} of 12`);
  remainingSeconds = USER_PICK_SECONDS;
  selectedProspectId = null;
  updateDraftUI();
  startCpuDraft();
  void saveCurrentGame("autosave");
});

document.querySelector("#autoDraftButton").addEventListener("click", () => {
  if (draftSession.state.complete) { document.querySelector("#draftButton").click(); return; }
  stopCpuDraft();
  draftSession.autoDraftAll();
  selectedProspectId = null;
  updateDraftUI();
  showToast("Draft complete // roster locked");
  void saveCurrentGame("autosave");
});

let remainingSeconds = USER_PICK_SECONDS;
window.setInterval(() => {
  const userTurn = draftSession.currentPick()?.teamIndex === userDraftTeam.id;
  if (!userTurn) {
    document.querySelector("#draftClock").textContent = "CPU";
    return;
  }
  if (remainingSeconds > 0) remainingSeconds -= 1;
  if (remainingSeconds === 0) {
    autoSelectDraftPick();
    return;
  }
  const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
  document.querySelector("#draftClock").textContent = `${minutes}:${seconds}`;
}, 1000);

const uiRevision = "broadcast-aa-v1";
if (localStorage.getItem("proxy-ui-revision") !== uiRevision) {
  localStorage.setItem("proxy-ui-concept", "broadcast");
  localStorage.setItem("proxy-ui-revision", uiRevision);
}

const savedTheme = localStorage.getItem("proxy-ui-concept");
if (savedTheme && document.querySelector(`[data-theme-choice="${savedTheme}"]`)) {
  document.body.dataset.theme = savedTheme;
  document.querySelectorAll("[data-theme-choice]").forEach((button) => button.classList.toggle("active", button.dataset.themeChoice === savedTheme));
}

updateDraftUI();
void refreshContinueButton();