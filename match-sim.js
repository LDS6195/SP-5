(() => {
  const canvas = document.querySelector("#matchCanvas");
  const context = canvas.getContext("2d");
  const duration = 30 * 60;
  const targetScore = 500;
  const controlTickSeconds = 10;
  const colors = { home: "#d85338", away: "#4dcca1", neutral: "#c5a15b" };
  const zoneLabels = ["Alpha", "Bravo", "Charlie", "Delta", "Echo"];
  function arenaOffset(name, salt, range) {
    let hash = 2166136261;
    for (const character of `${name}:${salt}`) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
    return ((hash >>> 0) / 4294967295 - .5) * range;
  }
  function arenaLayout(name) {
    const zones = [[.25, .22, .075], [.75, .22, .075], [.5, .5, .08], [.25, .78, .075], [.75, .78, .075]]
      .map(([x, y, radius], index) => ({ x: x + arenaOffset(name, index * 3, .075), y: y + arenaOffset(name, index * 3 + 1, .075), radius: radius + arenaOffset(name, index * 3 + 2, .012) }));
    const boundary = [[.06, .26], [.14, .09], [.34, .035], [.66, .035], [.86, .09], [.94, .26], [.97, .5], [.94, .74], [.86, .91], [.66, .965], [.34, .965], [.14, .91], [.06, .74], [.03, .5]]
      .map(([x, y], index) => [Math.max(.02, Math.min(.98, x + arenaOffset(name, 20 + index * 2, .04))), Math.max(.02, Math.min(.98, y + arenaOffset(name, 21 + index * 2, .04)))]);
    const terrain = [[.23, .48, .13, .055], [.77, .52, .13, .055], [.49, .18, .035, .15], [.51, .82, .035, .15]]
      .map(([x, y, width, height], index) => [x + arenaOffset(name, 50 + index * 2, .1), y + arenaOffset(name, 51 + index * 2, .1), width, height]);
    return { zones, boundary, terrain };
  }
  let arenaName = "Civic Rotunda";
  let arenaHomeSide = "home";
  let arenaGeometry = arenaLayout(arenaName);
  const initialSeed = 3000;
  let randomState = initialSeed;
  let completionHandler = null;
  const reserves = { home: [], away: [] };
  const teamIdentity = {
    home: { name: "Chicago Wind", abbreviation: "CHI", logo: "logos/chicago-wind.svg" },
    away: { name: "Berlin Union", abbreviation: "BER", logo: "logos/teams/berlin-union.svg" }
  };

  const attributeNames = [
    "speed", "agility", "strength", "endurance", "resilience", "precision", "range", "power", "defense", "evasion",
    "handling", "tacticalIQ", "awareness", "composure", "discipline", "creativity", "leadership", "coordination", "visualCommunication", "sonicCommunication"
  ];
  const roleTemplates = {
    General: { tacticalIQ: 92, leadership: 91, awareness: 88, composure: 87, discipline: 85, coordination: 84, creativity: 80 },
    Cannon: { precision: 92, range: 90, power: 86, awareness: 84, composure: 86, handling: 85, tacticalIQ: 80, strength: 76 },
    Runner: { speed: 92, agility: 91, evasion: 89, handling: 87, awareness: 84, endurance: 85, composure: 80, defense: 76, precision: 77 },
    Bruiser: { strength: 93, resilience: 90, defense: 89, power: 90, endurance: 86, awareness: 80, discipline: 82, speed: 73 },
    Visual: { visualCommunication: 94, creativity: 93, awareness: 85, coordination: 84, tacticalIQ: 80, composure: 81, discipline: 78 },
    Musical: { sonicCommunication: 95, coordination: 92, creativity: 91, composure: 86, tacticalIQ: 78, awareness: 79, endurance: 76 }
  };
  const roleWeights = {
    General: { tacticalIQ: .25, leadership: .20, awareness: .15, composure: .15, discipline: .10, coordination: .10, creativity: .05 },
    Cannon: { precision: .25, range: .20, power: .15, awareness: .10, composure: .10, handling: .10, tacticalIQ: .05, strength: .05 },
    Runner: { speed: .20, agility: .15, evasion: .15, handling: .15, awareness: .10, endurance: .10, composure: .05, defense: .05, precision: .05 },
    Bruiser: { strength: .25, resilience: .15, defense: .15, power: .15, endurance: .10, awareness: .10, discipline: .05, speed: .05 },
    Visual: { visualCommunication: .30, creativity: .20, awareness: .15, coordination: .15, tacticalIQ: .10, composure: .05, discipline: .05 },
    Musical: { sonicCommunication: .30, coordination: .20, creativity: .15, composure: .15, tacticalIQ: .10, awareness: .05, endurance: .05 }
  };

  function attributesFor(role, overrides = {}) {
    return Object.assign(Object.fromEntries(attributeNames.map((name) => [name, 70])), roleTemplates[role], overrides);
  }

  function overallFor(attributes, role) {
    return Math.round(Object.entries(roleWeights[role]).reduce((total, [attribute, weight]) => total + attributes[attribute] * weight, 0));
  }

  function random() {
    randomState |= 0;
    randomState = randomState + 0x6D2B79F5 | 0;
    let value = Math.imul(randomState ^ randomState >>> 15, 1 | randomState);
    value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  }

  const rosters = {
    home: [
      ["Bill Belichick", "General", { tacticalIQ: 99, leadership: 96, awareness: 97, discipline: 97 }],
      ["Steph Curry", "Cannon", { precision: 99, range: 99, agility: 92, composure: 96 }],
      ["Tom Brady", "Cannon", { precision: 98, awareness: 98, composure: 99, tacticalIQ: 97 }],
      ["LeBron James", "Runner", { speed: 94, strength: 96, awareness: 97, tacticalIQ: 96, handling: 95 }],
      ["Serena Williams", "Runner", { power: 96, precision: 95, speed: 91, composure: 96, resilience: 94 }],
      ["Muhammad Ali", "Bruiser", { agility: 97, evasion: 99, speed: 94, composure: 96 }],
      ["Aaron Donald", "Bruiser", { strength: 99, power: 98, defense: 96, speed: 88 }],
      ["Banksy", "Visual", { visualCommunication: 98, creativity: 98, evasion: 92 }],
      ["Prince", "Musical", { sonicCommunication: 99, creativity: 99, coordination: 98, agility: 91 }]
    ],
    away: [
      ["Sun Tzu", "General", { tacticalIQ: 99, awareness: 96, discipline: 94, creativity: 95 }],
      ["Patrick Mahomes", "Cannon", { precision: 97, range: 98, creativity: 97, handling: 96 }],
      ["Wayne Gretzky", "Cannon", { awareness: 99, tacticalIQ: 96, precision: 96, coordination: 97 }],
      ["Michael Jordan", "Runner", { agility: 97, speed: 96, evasion: 96, composure: 99, power: 92 }],
      ["Usain Bolt", "Runner", { speed: 99, endurance: 95, agility: 93, composure: 91 }],
      ["Mike Tyson", "Bruiser", { power: 99, strength: 96, speed: 92, aggression: 99 }],
      ["Shaquille O'Neal", "Bruiser", { strength: 99, resilience: 97, power: 98, defense: 94 }],
      ["Andy Warhol", "Visual", { visualCommunication: 97, creativity: 96, awareness: 90 }],
      ["David Bowie", "Musical", { sonicCommunication: 96, creativity: 99, composure: 93, coordination: 91 }]
    ]
  };

  const defaultPlan = { formation: "balanced", tempo: "balanced", focus: "balanced", risk: "balanced" };
  const awayPlan = { formation: "counter", tempo: "patient", focus: "control", risk: "balanced" };

  function planEffects(plan) {
    const effects = { capture: 1, combat: 1, defense: 1, mobility: 1 };
    const formation = {
      balanced: {}, pressure: { capture: 1.1, combat: 1.05, defense: .9, mobility: 1.08 },
      fortress: { capture: .92, defense: 1.15, mobility: .9 }, longRange: { capture: .93, combat: 1.14, defense: .96, mobility: .95 },
      wide: { capture: 1.08, combat: .96, defense: .94, mobility: 1.05 }, overload: { capture: 1.15, combat: 1.08, defense: .86 },
      escort: { capture: 1.1, defense: 1.08, mobility: .96 }, counter: { capture: .95, combat: 1.1, defense: 1.12, mobility: .92 }
    }[plan.formation] || {};
    const tempo = { patient: { combat: .94, defense: 1.07, mobility: .91 }, balanced: {}, fast: { capture: 1.06, combat: 1.05, defense: .93, mobility: 1.12 } }[plan.tempo] || {};
    const focus = { control: { capture: 1.12, combat: .92 }, balanced: {}, elimination: { capture: .88, combat: 1.14 } }[plan.focus] || {};
    const risk = { conservative: { capture: .95, combat: .9, defense: 1.12 }, balanced: {}, aggressive: { capture: 1.07, combat: 1.12, defense: .88, mobility: 1.04 } }[plan.risk] || {};
    const deltas = { capture: 0, combat: 0, defense: 0, mobility: 0 };
    [formation, tempo, focus, risk].forEach((source) => Object.entries(source).forEach(([key, value]) => { deltas[key] += value - 1; }));
    // Stacked choices add together at a quarter strength and cap at +/-5%, so no plan is a guaranteed win.
    Object.keys(effects).forEach((key) => { effects[key] = 1 + Math.max(-.05, Math.min(.05, deltas[key] * .25)); });
    return effects;
  }

  const formationBeats = { counter: "pressure", fortress: "overload", longRange: "fortress", pressure: "longRange", wide: "counter", escort: "wide", overload: "escort" };
  // Ratings below 65 (usually out-of-position players) hurt, but with diminishing impact.
  const ratingFactor = (rating) => 1 + ((rating < 65 ? 65 - (65 - rating) * .4 : rating) - 80) / 450;

  function randomAwayPlan() {
    const pick = (options) => options[Math.floor(random() * options.length)];
    return {
      formation: pick(["balanced", "pressure", "fortress", "longRange", "wide", "overload", "escort", "counter"]),
      tempo: pick(["patient", "balanced", "fast"]),
      focus: pick(["control", "balanced", "elimination"]),
      risk: pick(["conservative", "balanced", "aggressive"])
    };
  }

  function applyMatchupEffects() {
    ["home", "away"].forEach((team) => {
      const other = team === "home" ? "away" : "home";
      const plan = state.plans[team];
      const effects = state.effects[team];
      if (formationBeats[plan.formation] === state.plans[other].formation) { effects.capture *= 1.05; effects.combat *= 1.05; }
      const lean = (role) => Math.max(-.04, Math.min(.04, (teamRoleRating(team, role) - 82) / 250));
      if (plan.tempo === "fast") effects.mobility *= 1 + lean("Runner");
      if (plan.focus === "control") effects.capture *= 1 + lean("Runner");
      if (plan.focus === "elimination") effects.combat *= 1 + (lean("Cannon") + lean("Bruiser")) / 2;
      if (plan.formation === "longRange") effects.combat *= 1 + lean("Cannon");
      if (plan.formation === "fortress" || plan.formation === "escort") effects.defense *= 1 + lean("Bruiser");
      if (plan.formation === "counter") effects.defense *= 1 + lean("General");
    });
  }

  const state = {
    running: false,
    finished: false,
    speed: 30,
    elapsed: 0,
    lastFrame: 0,
    scoreAccumulator: 0,
    eventAccumulator: 0,
    homeScore: 0,
    awayScore: 0,
    homeUnits: 100,
    awayUnits: 100,
    lastLeader: null,
    zones: [],
    agents: [],
    players: { home: [], away: [] },
    plans: { home: { ...defaultPlan }, away: { ...awayPlan } },
    effects: { home: planEffects(defaultPlan), away: planEffects(awayPlan) },
    form: { home: 1, away: 1 },
    momentum: { home: 1, away: 1 },
    momentumClock: 0,
    bench: { home: [], away: [] },
    autoSub: { home: true, away: true },
    subClock: 0,
    boxRenderAt: 0,
    thresholdEvents: new Set()
    ,finishWinner: null
    ,finishReason: null
    ,watchdog: null
    ,skippedToResult: false
  };

  function createPlayers(team) {
    return rosters[team].map((entry, index) => {
      const supplied = !Array.isArray(entry);
      const [name, role, overrides] = supplied ? [entry.name, entry.assignedRole || entry.role || entry.primaryRole, entry.attributes] : entry;
      const attributes = supplied ? { ...entry.attributes } : attributesFor(role, overrides);
      const roleRatings = supplied ? { ...entry.roleRatings } : Object.fromEntries(Object.keys(roleWeights).map((position) => [position, overallFor(attributes, position)]));
      return {
      id: supplied ? entry.id : name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      primaryRole: supplied ? (entry.primaryRole || entry.role) : role,
      flexRoles: supplied ? (entry.flexRoles || []) : [],
      role,
      attributes,
      roleRatings,
      overall: roleRatings[role],
      rating: 6.4 + random() * 1.2,
      eliminations: 0,
      assists: 0,
      zoneCaptures: 0,
      zoneDefenses: 0,
      interceptions: 0,
      contribution: role === "General" ? "100 units active" : "Awaiting impact",
      active: true,
      stamina: Math.max(40, 100 - ((supplied && entry.fatigue) || 0)),
      minutes: 0,
      index
      };
    });
  }

  function createBench(team) {
    return reserves[team].filter((entry) => entry && entry.roleRatings).map((entry, index) => ({
      id: entry.id,
      name: entry.name,
      primaryRole: entry.primaryRole,
      flexRoles: entry.flexRoles || [],
      role: entry.primaryRole,
      attributes: { ...entry.attributes },
      roleRatings: { ...entry.roleRatings },
      overall: entry.roleRatings[entry.primaryRole],
      rating: 6.2 + random() * .8,
      eliminations: 0,
      assists: 0,
      zoneCaptures: 0,
      zoneDefenses: 0,
      interceptions: 0,
      contribution: "On the bench",
      active: false,
      stamina: Math.max(40, 100 - (entry.fatigue || 0)),
      minutes: 0,
      index: 100 + index
    }));
  }

  const STAMINA_DRAIN = { General: .35, Visual: .45, Musical: .45, Cannon: .8, Bruiser: 1, Runner: 1.05 };
  const staminaMultiplier = (player) => .78 + .22 * Math.max(0, player.stamina ?? 100) / 100;

  function updateStamina(delta) {
    ["home", "away"].forEach((team) => {
      state.players[team].forEach((player) => {
        player.stamina = Math.max(0, player.stamina - .032 * (STAMINA_DRAIN[player.role] || .9) * delta);
        player.minutes += delta;
      });
      state.bench[team].forEach((player) => { player.stamina = Math.min(100, player.stamina + .02 * delta); });
    });
  }

  let pendingSubIn = null;
  function substitute(team, outIndex, benchIndex) {
    const outgoing = state.players[team][outIndex];
    const incoming = state.bench[team][benchIndex];
    if (!outgoing || !incoming || outgoing.role === "General") return false;
    if (team === "home") pendingSubIn = null;
    incoming.role = outgoing.role;
    incoming.overall = incoming.roleRatings[incoming.role];
    incoming.active = true;
    incoming.contribution = "Fresh off the bench";
    outgoing.active = false;
    outgoing.contribution = "Resting";
    state.players[team][outIndex] = incoming;
    state.bench[team][benchIndex] = outgoing;
    addCommentary(formatClock(), `${teamIdentity[team].name}: ${incoming.name} checks in for ${outgoing.name}.`);
    renderBoxScore();
    return true;
  }

  function autoSubs(team) {
    state.bench[team].forEach((bencher, benchIndex) => {
      if (bencher.stamina < 70) return;
      let best = -1;
      let bestGain = .5;
      state.players[team].forEach((starter, outIndex) => {
        if (starter.role === "General" || starter.stamina > 55) return;
        const gain = (bencher.roleRatings[starter.role] || 0) * staminaMultiplier(bencher) - starter.roleRatings[starter.role] * staminaMultiplier(starter);
        if (gain > bestGain) { best = outIndex; bestGain = gain; }
      });
      if (best >= 0) substitute(team, best, benchIndex);
    });
  }

  function manualSub(benchIndex, outIndex) {
    if (!state.bench.home[benchIndex] || state.finished) return;
    if (!substitute("home", outIndex, benchIndex)) { pendingSubIn = null; renderBoxScore(); }
  }

  function reset() {
    randomState = (Math.random() * 2147483647) | 0;
    pendingSubIn = null;
    state.running = false;
    state.finished = false;
    state.elapsed = 0;
    state.scoreAccumulator = 0;
    state.eventAccumulator = 0;
    state.homeScore = 0;
    state.awayScore = 0;
    state.homeUnits = 100;
    state.awayUnits = 100;
    state.lastLeader = null;
    state.lastFrame = 0;
    state.finishWinner = null;
    state.finishReason = null;
    state.skippedToResult = false;
    if (state.watchdog) window.clearTimeout(state.watchdog);
    state.watchdog = null;
    state.thresholdEvents.clear();
    state.players.home = createPlayers("home");
    state.players.away = createPlayers("away");
    state.bench.home = createBench("home");
    state.bench.away = createBench("away");
    state.subClock = 0;
    state.plans.away = randomAwayPlan();
    state.effects.home = planEffects(state.plans.home);
    state.effects.away = planEffects(state.plans.away);
    applyMatchupEffects();
    state.form = { home: 1 + (random() - .5) * .22, away: 1 + (random() - .5) * .22 };
    state.form[arenaHomeSide] *= 1.015;
    state.momentum = { home: 1, away: 1 };
    state.momentumClock = 0;
    state.zones = arenaGeometry.zones.map((zone) => ({ ...zone, owner: null, capture: 0, pressure: 0 }));
    state.agents = [];
    ["home", "away"].forEach((team) => {
      const direction = team === "home" ? 1 : -1;
      const roles = ["runner", "runner", "bruiser", "bruiser", "cannon", "cannon", "support"];
      for (let index = 0; index < 30; index += 1) {
        const role = roles[index % roles.length];
        const roleName = role === "support" ? (index % 2 ? "Visual" : "Musical") : `${role[0].toUpperCase()}${role.slice(1)}`;
        const quality = teamRoleRating(team, roleName) / 100;
        state.agents.push({
          team,
          x: team === "home" ? .09 + random() * .08 : .83 + random() * .08,
          y: .12 + random() * .76,
          displayX: null,
          displayY: null,
          role,
          targetZone: chooseTargetZone(index, state.plans[team], team),
          assignment: chooseAssignment(role, index, state.plans[team]),
          offsetX: (random() - .5) * .09,
          offsetY: (random() - .5) * .09,
          nextDecision: 12 + random() * 22,
          speed: (.03 + quality * .012 + random() * .008) * direction,
          strength: (index < 9 ? 1.12 : .68) + quality * .24 + random() * .16,
          star: index < 9,
          phase: random() * Math.PI * 2
        });
      }
    });
    document.querySelector("#commentaryFeed").innerHTML = "";
    addCommentary("30:00", "Teams enter the Civic Rotunda. Five zones are live.", true);
    updateInterface();
    renderBoxScore();
    draw();
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function addCommentary(time, message, major = false) {
    const feed = document.querySelector("#commentaryFeed");
    const item = document.createElement("li");
    if (major) item.className = "major";
    item.innerHTML = `<time>${time}</time><span>${message}</span>`;
    feed.prepend(item);
    while (feed.children.length > 12) feed.lastElementChild.remove();
  }

  function formatClock() {
    const left = Math.max(0, duration - Math.floor(state.elapsed));
    return `${Math.floor(left / 60).toString().padStart(2, "0")}:${(left % 60).toString().padStart(2, "0")}`;
  }

  function selectPlayer(team, roles) {
    const choices = state.players[team].filter((player) => roles.includes(player.role) && player.active);
    return choices[Math.floor(random() * choices.length)] || state.players[team][0];
  }

  function teamRoleRating(team, role) {
    const eligible = state.players[team].filter((player) => player.role === role);
    const players = eligible.length ? eligible : state.players[team];
    return players.reduce((sum, player) => sum + player.roleRatings[role] * staminaMultiplier(player), 0) / players.length;
  }

  function chooseTargetZone(index, plan, team) {
    if (plan.formation === "overload") {
      const priority = team === "home" ? [0, 2, 2, 3, 2] : [1, 2, 2, 4, 2];
      return priority[index % priority.length];
    }
    if (plan.formation === "fortress" || plan.formation === "counter") {
      const homeZones = team === "home" ? [0, 2, 3] : [1, 2, 4];
      return homeZones[index % homeZones.length];
    }
    return index % state.zones.length;
  }

  function chooseAssignment(role, index, plan) {
    if (index % 6 === 5) return "diversion";
    if (plan.formation === "longRange" && role !== "runner") return "standoff";
    if (plan.formation === "fortress" && role !== "runner") return "screen";
    if (plan.formation === "escort" && (role === "bruiser" || role === "support")) return "screen";
    if (plan.formation === "pressure" && role !== "cannon") return "objective";
    if (plan.formation === "wide") return role === "cannon" ? "standoff" : "objective";
    if (plan.formation === "counter") return role === "runner" ? "patrol" : role === "cannon" ? "standoff" : "screen";
    return role === "cannon" ? "standoff" : role === "bruiser" ? "screen" : role === "support" ? "patrol" : "objective";
  }

  function updateAgents(delta) {
    state.agents.forEach((agent) => {
      agent.nextDecision -= delta;
      if (agent.nextDecision <= 0) {
        agent.nextDecision = 12 + random() * 24;
        if (random() < .38) agent.targetZone = Math.floor(random() * state.zones.length);
        if (random() < .2) agent.assignment = agent.assignment === "diversion" ? "objective" : "diversion";
        agent.offsetX = (random() - .5) * .11;
        agent.offsetY = (random() - .5) * .11;
      }
      const zone = state.zones[agent.targetZone];
      const side = agent.team === "home" ? -1 : 1;
      let targetX = zone.x + agent.offsetX;
      let targetY = zone.y + agent.offsetY;
      if (agent.assignment === "standoff") targetX += side * (.13 + Math.abs(agent.offsetY) * .2);
      if (agent.assignment === "screen") targetX += side * .075;
      if (agent.assignment === "patrol") {
        targetX = agent.team === "home" ? .34 : .66;
        targetY = .18 + ((agent.targetZone * .19 + .11) % .68);
      }
      if (agent.assignment === "diversion") {
        targetX = agent.team === "home" ? .4 : .6;
        targetY = agent.targetZone % 2 ? .08 : .92;
      }
      const wobble = Math.sin(state.elapsed * .8 + agent.phase) * .015;
      const dx = targetX - agent.x;
      const dy = targetY + wobble - agent.y;
      const distance = Math.hypot(dx, dy) || 1;
      const pace = Math.abs(agent.speed) * state.effects[agent.team].mobility * delta;
      if (distance > .025) {
        agent.x += (dx / distance) * pace;
        agent.y += (dy / distance) * pace;
      }
    });
  }

  function updateZones(delta) {
    state.zones.forEach((zone, zoneIndex) => {
      const nearby = { home: 0, away: 0 };
      state.agents.forEach((agent) => {
        if (Math.hypot(agent.x - zone.x, agent.y - zone.y) < zone.radius * 1.15) {
          const runnerQuality = ratingFactor(teamRoleRating(agent.team, "Runner"));
          const signalQuality = ratingFactor((teamRoleRating(agent.team, "Visual") + teamRoleRating(agent.team, "Musical")) / 2);
          const opponentDefense = state.effects[agent.team === "home" ? "away" : "home"].defense;
          nearby[agent.team] += agent.strength * state.effects[agent.team].capture * runnerQuality * signalQuality * state.form[agent.team] * state.momentum[agent.team] / Math.sqrt(opponentDefense);
        }
      });
      const difference = nearby.home - nearby.away;
      const previousOwner = zone.owner;
      if (Math.abs(difference) < .6) {
        zone.capture *= Math.pow(.985, delta);
      } else {
        zone.capture = Math.max(-100, Math.min(100, zone.capture + difference * delta * 2.2));
      }
      zone.owner = zone.capture >= 85 ? "home" : zone.capture <= -85 ? "away" : previousOwner;
      if (zone.owner && Math.sign(zone.capture) !== (zone.owner === "home" ? 1 : -1)) zone.owner = null;
      zone.pressure = difference;
      if (zone.owner !== previousOwner) {
        const label = zoneLabels[zoneIndex];
        if (zone.owner) {
          const teamName = teamIdentity[zone.owner].name;
          const runner = selectPlayer(zone.owner, ["Runner"]);
          runner.rating += .22;
          runner.zoneCaptures += 1;
          if (previousOwner && random() < .22) runner.interceptions += 1;
          runner.contribution = `${label} captured`;
          addCommentary(formatClock(), `${runner.name} secures Zone ${label} for ${teamName}.`, true);
        } else {
          addCommentary(formatClock(), `Zone ${label} has fallen neutral under heavy pressure.`);
        }
      }
    });
  }

  function resolveCombat(delta) {
    state.eventAccumulator += delta;
    if (state.eventAccumulator < 10) return;
    state.eventAccumulator = 0;
    const contested = state.zones.filter((zone) => Math.abs(zone.pressure) < 4 && Math.abs(zone.pressure) > .2);
    if (!contested.length || random() > .76) return;
    const homeAttack = ratingFactor((teamRoleRating("home", "Cannon") + teamRoleRating("home", "Bruiser")) / 2) * state.form.home * state.momentum.home * state.effects.home.combat / state.effects.away.defense;
    const awayAttack = ratingFactor((teamRoleRating("away", "Cannon") + teamRoleRating("away", "Bruiser")) / 2) * state.form.away * state.momentum.away * state.effects.away.combat / state.effects.home.defense;
    const losingTeam = random() < homeAttack / (homeAttack + awayAttack) ? "away" : "home";
    const winningTeam = losingTeam === "home" ? "away" : "home";
    const dominance = Math.max(homeAttack, awayAttack) / Math.max(.01, Math.min(homeAttack, awayAttack));
    const loss = dominance >= 1.45 ? (random() < .35 ? 5 : 3) : random() < .13 ? 2 : 1;
    state[`${losingTeam}Units`] = Math.max(0, state[`${losingTeam}Units`] - loss);
    const scorer = selectPlayer(winningTeam, random() < .12 ? ["Runner"] : ["Cannon", "Bruiser"]);
    scorer.eliminations += loss;
    if (scorer.role === "Cannon" && random() < .14) scorer.assists += 1;
    if (scorer.role === "Bruiser" && random() < .2) scorer.zoneDefenses += 1;
    scorer.rating = Math.min(10, scorer.rating + .08 * loss);
    scorer.contribution = `${scorer.eliminations} eliminations`;
    renderBoxScore();
    if (random() < .13) addCommentary(formatClock(), `${scorer.name} breaks the engagement with ${loss > 1 ? "a double elimination" : "a decisive strike"}.`);
  }

  function updateScoring(delta) {
    state.scoreAccumulator += delta;
    while (state.scoreAccumulator >= controlTickSeconds) {
      state.scoreAccumulator -= controlTickSeconds;
      state.homeScore = Math.min(targetScore, state.homeScore + state.zones.filter((zone) => zone.owner === "home").length);
      state.awayScore = Math.min(targetScore, state.awayScore + state.zones.filter((zone) => zone.owner === "away").length);
    }
    const leader = state.homeScore === state.awayScore ? null : state.homeScore > state.awayScore ? "home" : "away";
    if (leader && state.lastLeader && leader !== state.lastLeader) {
      addCommentary(formatClock(), `${teamIdentity[leader].name} takes the lead, ${state.homeScore}-${state.awayScore}.`, true);
    }
    state.lastLeader = leader;
  }

  function checkThresholds() {
    [[75, "Three quarters of the force remains"], [50, "Force strength has fallen below half"], [25, "Only a quarter of the force remains"]].forEach(([threshold, message]) => {
      ["home", "away"].forEach((team) => {
        const key = `${team}-${threshold}`;
        if (state[`${team}Units`] <= threshold && !state.thresholdEvents.has(key)) {
          state.thresholdEvents.add(key);
          addCommentary(formatClock(), `${teamIdentity[team].name}: ${message}.`, threshold <= 50);
        }
      });
    });
  }

  function finishMatch(reason) {
    state.running = false;
    state.finished = true;
    if (state.watchdog) window.clearTimeout(state.watchdog);
    state.watchdog = null;
    const homeWon = reason === "elimination"
      ? state.awayUnits === 0
      : state.homeScore > state.awayScore || (state.homeScore === state.awayScore && state.homeUnits > state.awayUnits);
    const winner = teamIdentity[homeWon ? "home" : "away"].name;
    state.finishWinner = homeWon ? "home" : "away";
    state.finishReason = reason;
    const completionActions = document.querySelector("#matchCompletionActions");
    if (completionActions) completionActions.hidden = false;
    document.querySelector("#matchState").textContent = `${winner} // ${reason} victory`;
    addCommentary(formatClock(), `${winner} wins by ${reason}.`, true);
    renderBoxScore();
    completionHandler?.(getResult());
  }

  function getResult() {
    if (!state.finished) return null;
    return {
      winner: state.finishWinner,
      victoryType: state.finishReason === "elimination" ? "Elimination" : state.finishReason === "control" ? "Control" : "Time Limit",
      homeScore: state.homeScore,
      awayScore: state.awayScore,
      homeUnits: state.homeUnits,
      awayUnits: state.awayUnits,
      duration: Math.min(duration, Math.floor(state.elapsed)),
      homeZonesCaptured: state.players.home.reduce((sum, player) => sum + player.zoneCaptures, 0),
      awayZonesCaptured: state.players.away.reduce((sum, player) => sum + player.zoneCaptures, 0),
      homeZoneHoldTime: state.homeScore * 10,
      awayZoneHoldTime: state.awayScore * 10,
      players: {
        home: [...state.players.home, ...state.bench.home.filter((player) => player.minutes > 0)].map((player) => resultPlayerLine(player)),
        away: [...state.players.away, ...state.bench.away.filter((player) => player.minutes > 0)].map((player) => resultPlayerLine(player))
      }
    };
  }

  function resultPlayerLine(player) {
    const artist = player.role === "Visual" || player.role === "Musical";
    return {
      id: player.id,
      name: player.name,
      role: player.role,
      rating: Number(player.rating.toFixed(1)),
      eliminations: player.eliminations,
      assists: player.assists,
      zoneCaptures: player.zoneCaptures,
      zoneDefenses: player.zoneDefenses,
      interceptions: player.interceptions,
      minutes: Math.round(player.minutes / 60),
      distanceCarried: player.role === "Runner" ? Math.round(player.minutes / 60 * 42 * player.overall / 90) : 0,
      decoysSuccessful: artist ? Math.floor(player.minutes / 280 * player.overall / 90) : 0,
      decoysDenied: artist ? Math.floor(player.minutes / 340 * player.overall / 90) : 0,
      networkCoverage: artist ? Math.min(99, Math.round(68 + player.overall * .3)) : 0,
      survived: true,
      contribution: player.contribution
    };
  }

  function update(delta) {
    if (!state.running || state.finished) return;
    state.elapsed += delta;
    state.momentumClock += delta;
    if (state.momentumClock >= 120) {
      state.momentumClock = 0;
      state.momentum = { home: 1 + (random() - .5) * .34, away: 1 + (random() - .5) * .34 };
    }
    updateStamina(delta);
    state.subClock += delta;
    if (state.subClock >= 30) {
      state.subClock = 0;
      ["home", "away"].forEach((team) => { if (state.autoSub[team]) autoSubs(team); });
    }
    const now = performance.now();
    if (now - state.boxRenderAt > 700) { state.boxRenderAt = now; renderBoxScore(); }
    updateAgents(delta);
    updateZones(delta);
    resolveCombat(delta);
    updateScoring(delta);
    checkThresholds();
    if (state.homeScore >= targetScore || state.awayScore >= targetScore) finishMatch("control");
    else if (state.homeUnits <= 0 || state.awayUnits <= 0) finishMatch("elimination");
    else if (state.elapsed >= duration) finishMatch("time");
    updateInterface();
  }

  function updateInterface() {
    document.querySelector("#homeScore").textContent = state.homeScore;
    document.querySelector("#awayScore").textContent = state.awayScore;
    document.querySelector("#matchClock").textContent = state.skippedToResult ? "--:--" : formatClock();
    if (!state.finished) document.querySelector("#matchState").textContent = state.running ? "Simulation live" : "Simulation paused";
    document.querySelector("#homeUnits").textContent = state.homeUnits;
    document.querySelector("#awayUnits").textContent = state.awayUnits;
    document.querySelector("#homeUnitsBar").style.width = `${state.homeUnits}%`;
    document.querySelector("#awayUnitsBar").style.width = `${state.awayUnits}%`;
    document.querySelectorAll("[data-zone-readout]").forEach((row, index) => {
      const zone = state.zones[index];
      const teamName = zone.owner ? teamIdentity[zone.owner].abbreviation : "Contested";
      row.querySelector("strong").textContent = teamName;
      const bar = row.querySelector("b");
      bar.style.width = `${Math.abs(zone.capture)}%`;
      bar.style.marginLeft = zone.capture < 0 ? `${100 - Math.abs(zone.capture)}%` : "0";
      bar.style.background = zone.capture < 0 ? colors.away : zone.capture > 0 ? colors.home : colors.neutral;
    });
  }

  function drawField(width, height) {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#0c1713";
    context.fillRect(0, 0, width, height);
    const boundary = arenaGeometry.boundary;
    context.save();
    context.beginPath();
    boundary.forEach(([x, y], index) => index ? context.lineTo(x * width, y * height) : context.moveTo(x * width, y * height));
    context.closePath();
    context.clip();
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#173328");
    gradient.addColorStop(.5, "#294c3d");
    gradient.addColorStop(1, "#152f26");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "rgba(233,220,197,.1)";
    context.lineWidth = 1;
    for (let x = 40; x < width; x += 48) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
    context.strokeStyle = "rgba(229,205,149,.24)";
    context.beginPath(); context.moveTo(width / 2, 18); context.lineTo(width / 2, height - 18); context.stroke();
    context.fillStyle = "rgba(216,83,56,.12)"; context.fillRect(0, 0, width * .105, height);
    context.fillStyle = "rgba(77,204,161,.12)"; context.fillRect(width * .895, 0, width * .105, height);
    const terrain = arenaGeometry.terrain;
    terrain.forEach(([x, y, terrainWidth, terrainHeight], index) => {
      context.save();
      context.translate(x * width, y * height);
      context.rotate(index % 2 ? -.22 : .22);
      context.fillStyle = "rgba(11,24,19,.72)";
      context.fillRect(-terrainWidth * width / 2, -terrainHeight * height / 2, terrainWidth * width, terrainHeight * height);
      context.strokeStyle = "rgba(197,161,91,.46)";
      context.strokeRect(-terrainWidth * width / 2, -terrainHeight * height / 2, terrainWidth * width, terrainHeight * height);
      context.restore();
    });
    context.restore();
    context.beginPath();
    boundary.forEach(([x, y], index) => index ? context.lineTo(x * width, y * height) : context.moveTo(x * width, y * height));
    context.closePath();
    context.lineWidth = 3;
    context.strokeStyle = "rgba(229,205,149,.7)";
    context.stroke();
    context.fillStyle = "rgba(244,234,215,.68)";
    context.font = "10px 'Fragment Mono'";
    context.textAlign = "center";
    context.fillText(arenaName.toUpperCase(), width / 2, height * .09);
  }

  function draw() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    drawField(width, height);
    state.zones.forEach((zone, index) => {
      const x = zone.x * width;
      const y = zone.y * height;
      const radius = zone.radius * Math.min(width, height);
      context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = zone.owner ? `${colors[zone.owner]}24` : "rgba(197,161,91,.09)";
      context.fill();
      context.lineWidth = 2; context.strokeStyle = zone.owner ? colors[zone.owner] : "rgba(224,201,149,.6)"; context.stroke();
      context.fillStyle = "rgba(244,234,215,.88)"; context.font = "10px 'Fragment Mono'"; context.textAlign = "center";
      context.fillText(zoneLabels[index].toUpperCase(), x, y + 4);
    });
    state.agents.forEach((agent) => {
      agent.displayX ??= agent.x;
      agent.displayY ??= agent.y;
      agent.displayX += (agent.x - agent.displayX) * .08;
      agent.displayY += (agent.y - agent.displayY) * .08;
      const x = agent.displayX * width;
      const y = agent.displayY * height;
      const direction = agent.team === "home" ? 1 : -1;
      const size = agent.star ? 9 : 5;
      context.save(); context.translate(x, y); context.rotate(direction > 0 ? Math.PI / 2 : -Math.PI / 2);
      context.beginPath(); context.moveTo(0, -size); context.lineTo(size * .72, size); context.lineTo(-size * .72, size); context.closePath();
      context.fillStyle = colors[agent.team]; context.fill();
      if (agent.star) { context.lineWidth = 2; context.strokeStyle = "#fff0cf"; context.stroke(); }
      context.restore();
    });
  }

  function frame(timestamp) {
    if (!state.lastFrame) state.lastFrame = timestamp;
    const realDelta = Math.min((timestamp - state.lastFrame) / 1000, .1);
    state.lastFrame = timestamp;
    update(realDelta * state.speed);
    draw();
    requestAnimationFrame(frame);
  }

  let selectedBoxTeam = "home";
  function renderBoxScore() {
    const staminaCell = (player) => `<td><span class="stamina-meter ${player.stamina < 45 ? "low" : ""}"><i style="width:${Math.round(player.stamina)}%"></i></span>${Math.round(player.stamina)}</td>`;
    const statCells = (player, contribution) => `<td class="${player.rating >= 8 ? "rating-elite" : ""}">${player.rating.toFixed(1)}</td><td>${player.eliminations}</td><td>${player.assists}</td><td>${player.zoneCaptures}</td><td>${player.zoneDefenses}</td><td>${player.interceptions}</td><td>${Math.round(player.minutes / 60)}'</td><td>${contribution}</td>`;
    const canSub = selectedBoxTeam === "home" && !state.finished;
    if (state.finished) pendingSubIn = null;
    const incoming = canSub && pendingSubIn !== null ? state.bench.home[pendingSubIn] : null;
    const activeRows = state.players[selectedBoxTeam].map((player, outIndex) => {
      let contribution = player.contribution;
      if (player.role === "General") contribution = `${state[`${selectedBoxTeam}Units`]} units remaining`;
      if (player.role === "Visual") contribution = `${Math.round(72 + player.rating * 2)}% coverage`;
      if (player.role === "Musical") contribution = `${Math.round(77 + player.rating * 1.7)}% signal uptime`;
      const target = incoming && player.role !== "General";
      if (target) contribution = `<button class="sub-in-button sub-out-button" data-sub-out="${outIndex}">Sub Out // ${incoming.roleRatings[player.role]} as ${player.role}</button>`;
      return `<tr class="${target ? "sub-target-row" : ""}"><td><strong>${player.name}</strong></td><td>${player.role}</td>${staminaCell(player)}${statCells(player, contribution)}</tr>`;
    }).join("");
    const benchButton = (benchIndex) => pendingSubIn === benchIndex
      ? `<button class="sub-in-button cancel" data-sub-cancel>Cancel</button>`
      : `<button class="sub-in-button" data-sub-in="${benchIndex}">Sub In</button>`;
    const benchRows = state.bench[selectedBoxTeam].map((player, benchIndex) => `<tr class="bench-row ${canSub && pendingSubIn === benchIndex ? "sub-pending" : ""}"><td><strong>${player.name}</strong></td><td>${player.primaryRole}</td>${staminaCell(player)}${statCells(player, canSub ? benchButton(benchIndex) : player.contribution)}</tr>`).join("");
    document.querySelector("#boxScoreBody").innerHTML = activeRows + (benchRows ? `<tr class="bench-divider-row"><td colspan="11">Bench</td></tr>${benchRows}` : "");
  }

  document.querySelector("#boxScoreBody").addEventListener("pointerdown", (event) => {
    const subIn = event.target.closest("[data-sub-in]");
    const subOut = event.target.closest("[data-sub-out]");
    if (subIn) { pendingSubIn = Number(subIn.dataset.subIn); renderBoxScore(); }
    else if (subOut && pendingSubIn !== null) manualSub(pendingSubIn, Number(subOut.dataset.subOut));
    else if (event.target.closest("[data-sub-cancel]")) { pendingSubIn = null; renderBoxScore(); }
  });
  document.querySelector("#autoSubToggle")?.addEventListener("click", (event) => {
    state.autoSub.home = !state.autoSub.home;
    event.currentTarget.setAttribute("aria-pressed", String(state.autoSub.home));
    event.currentTarget.textContent = `Auto Subs: ${state.autoSub.home ? "On" : "Off"}`;
  });

  function previewPlan(plan) {
    const effects = planEffects(plan);
    const general = teamRoleRating("home", "General");
    const runners = teamRoleRating("home", "Runner");
    const cannons = teamRoleRating("home", "Cannon");
    const bruisers = teamRoleRating("home", "Bruiser");
    const clamp = (value) => Math.max(50, Math.min(99, Math.round(value)));
    const notes = {
      balanced: "No pronounced weakness. Reliable spacing and measured pressure across all five zones.",
      pressure: "Fast occupation and frequent engagements, but rear zones and signal units receive less protection.",
      fortress: "Excellent zone retention and force preservation. Captures develop slowly and distant zones may be conceded.",
      longRange: "Cannons establish deep firing lanes. Strong denial pressure, with fewer bodies committed to captures.",
      wide: "Maximum map coverage across five objectives. Individual clusters receive less local support.",
      overload: "Overwhelms priority zones with concentrated force. Vulnerable to diversions on the weak side.",
      escort: "Bruiser screens improve Runner capture attempts. Cannon spacing and broad coverage are reduced.",
      counter: "Absorbs the opening attack and punishes exposed formations. Slow to recover from an early control deficit."
    };
    return {
      control: clamp((runners * .72 + general * .28) * effects.capture),
      combat: clamp((cannons * .58 + bruisers * .42) * effects.combat),
      defense: clamp((bruisers * .72 + general * .28) * effects.defense),
      mobility: clamp(runners * effects.mobility),
      note: notes[plan.formation]
    };
  }

  document.querySelectorAll(".box-tab").forEach((button) => {
    button.addEventListener("click", () => {
      selectedBoxTeam = button.dataset.boxTeam;
      document.querySelectorAll(".box-tab").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      renderBoxScore();
    });
  });

  document.querySelectorAll(".speed-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.speed = Number(button.dataset.speed);
      document.querySelectorAll(".speed-button").forEach((item) => item.classList.toggle("active", item === button));
    });
  });
  document.querySelector("#matchSkipButton").addEventListener("click", () => {
    if (state.finished) return;
    state.running = true;
    state.skippedToResult = true;
    document.querySelector("#matchClock").textContent = "--:--";
    while (!state.finished) {
      const remaining = Math.max(0, duration - state.elapsed);
      if (remaining <= 0) {
        finishMatch("time");
        break;
      }
      update(Math.min(10, remaining));
    }
    if (state.finishReason === "time") state.elapsed = duration;
    updateInterface();
    draw();
  });
  document.querySelector("#matchPauseButton").addEventListener("click", (event) => {
    state.running = !state.running;
    event.currentTarget.querySelector("b").textContent = state.running ? "Ⅱ" : "▶";
    event.currentTarget.querySelector(".control-label").textContent = state.running ? "Pause" : "Resume";
    event.currentTarget.setAttribute("aria-pressed", String(!state.running));
    updateInterface();
  });
  window.addEventListener("resize", () => { resizeCanvas(); draw(); });

  reset();
  resizeCanvas();
  requestAnimationFrame(frame);
  window.matchSimulator = {
    start() { resizeCanvas(); if (!state.finished) { state.running = true; state.watchdog = window.setTimeout(() => { if (state.running && !state.finished) { state.elapsed = duration; finishMatch("time"); } }, 210000); } state.lastFrame = performance.now(); updateInterface(); },
    pause() { state.running = false; updateInterface(); },
    reset,
    configure(plan) {
      state.plans.home = { ...defaultPlan, ...plan };
      state.speed = 30;
      document.querySelectorAll(".speed-button").forEach((button) => button.classList.toggle("active", button.dataset.speed === "30"));
      reset();
      addCommentary("30:00", `${teamIdentity.home.name} deploys in ${state.plans.home.formation} formation with ${state.plans.home.focus} priority.`);
    },
    getRoster(team) {
      return state.players[team].map(({ id, name, primaryRole, role, overall, roleRatings, stamina, flexRoles }) => ({ id, name, primaryRole, role, overall, roleRatings, stamina, flexRoles }));
    },
    getReserves(team) { return reserves[team].map(({ id, name, primaryRole, overall, fatigue, flexRoles, roleRatings }) => ({ id, name, primaryRole, role: primaryRole, overall, roleRatings, flexRoles, stamina: Math.max(40, 100 - (fatigue || 0)) })); },
    setTeamIdentity(team, identity) {
      teamIdentity[team] = { ...teamIdentity[team], ...identity };
      document.querySelector(`#${team}TeamLogo`).src = teamIdentity[team].logo;
      document.querySelector(`#${team}TeamLogo`).alt = `${teamIdentity[team].name} logo`;
      document.querySelector(`#${team}TeamAbbr`).textContent = teamIdentity[team].abbreviation;
      document.querySelector(`#${team}TeamLabel`).textContent = teamIdentity[team].name;
      const boxTab = document.querySelector(`#${team}BoxTab`);
      if (boxTab) boxTab.textContent = teamIdentity[team].name;
      const fieldLabel = document.querySelector(`#${team}FieldLabel`);
      if (fieldLabel) fieldLabel.textContent = teamIdentity[team].name;
      document.querySelector("#matchTitle").textContent = `${teamIdentity.home.name} vs ${teamIdentity.away.name}`;
    },
    setArena(name, homeSide = "home") {
      arenaName = name || "Civic Rotunda";
      arenaHomeSide = homeSide;
      arenaGeometry = arenaLayout(arenaName);
      reset();
    },
    setTeamRoster(team, lineup, bench = []) {
      rosters[team] = lineup.map(({ player, role }) => ({ ...player, assignedRole: role }));
      reserves[team] = bench.slice();
      reset();
    },
    previewPlan,
    getResult,
    setCompletionHandler(handler) { completionHandler = handler; },
    quickSim(plan) {
      state.plans.home = { ...defaultPlan, ...plan };
      reset();
      const manualPreference = state.autoSub.home;
      state.autoSub.home = true;
      state.running = true;
      while (!state.finished) update(Math.min(2, duration - state.elapsed));
      state.autoSub.home = manualPreference;
      draw();
      return getResult();
    }
  };
})();
