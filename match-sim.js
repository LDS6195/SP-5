(() => {
  const canvas = document.querySelector("#matchCanvas");
  const context = canvas.getContext("2d");
  const duration = 30 * 60;
  const targetScore = 500;
  const controlTickSeconds = 10;
  const colors = { home: "#d85338", away: "#4dcca1", neutral: "#c5a15b" };
  const zoneLabels = ["Alpha", "Bravo", "Charlie", "Delta", "Echo"];
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
    [formation, tempo, focus, risk].forEach((source) => Object.entries(source).forEach(([key, value]) => { effects[key] *= value; }));
    return effects;
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
      index
      };
    });
  }

  function reset() {
    randomState = initialSeed;
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
    state.effects.home = planEffects(state.plans.home);
    state.effects.away = planEffects(state.plans.away);
    state.zones = [
      { x: .25, y: .22, radius: .075, owner: null, capture: 0, pressure: 0 },
      { x: .75, y: .22, radius: .075, owner: null, capture: 0, pressure: 0 },
      { x: .5, y: .5, radius: .08, owner: null, capture: 0, pressure: 0 },
      { x: .25, y: .78, radius: .075, owner: null, capture: 0, pressure: 0 },
      { x: .75, y: .78, radius: .075, owner: null, capture: 0, pressure: 0 }
    ];
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
          speed: (.029 + quality * .022 + random() * .008) * direction,
          strength: (index < 9 ? 1.12 : .68) + quality * .44 + random() * .12,
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
    return players.reduce((sum, player) => sum + player.roleRatings[role], 0) / players.length;
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
          const runnerQuality = teamRoleRating(agent.team, "Runner") / 85;
          const signalQuality = (teamRoleRating(agent.team, "Visual") + teamRoleRating(agent.team, "Musical")) / 180;
          nearby[agent.team] += agent.strength * state.effects[agent.team].capture * runnerQuality * signalQuality;
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
    const homeAttack = ((teamRoleRating("home", "Cannon") + teamRoleRating("home", "Bruiser")) / 200) * state.effects.home.combat / state.effects.away.defense;
    const awayAttack = ((teamRoleRating("away", "Cannon") + teamRoleRating("away", "Bruiser")) / 200) * state.effects.away.combat / state.effects.home.defense;
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
      state.homeScore += state.zones.filter((zone) => zone.owner === "home").length;
      state.awayScore += state.zones.filter((zone) => zone.owner === "away").length;
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
        home: state.players.home.map((player) => resultPlayerLine(player)),
        away: state.players.away.map((player) => resultPlayerLine(player))
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
      distanceCarried: player.role === "Runner" ? Math.round(state.elapsed / 60 * 42 * player.overall / 90) : 0,
      decoysSuccessful: artist ? Math.floor(state.elapsed / 280 * player.overall / 90) : 0,
      decoysDenied: artist ? Math.floor(state.elapsed / 340 * player.overall / 90) : 0,
      networkCoverage: artist ? Math.min(99, Math.round(68 + player.overall * .3)) : 0,
      survived: true,
      contribution: player.contribution
    };
  }

  function update(delta) {
    if (!state.running || state.finished) return;
    state.elapsed += delta;
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
    const boundary = [
      [.06, .26], [.14, .09], [.34, .035], [.66, .035], [.86, .09], [.94, .26],
      [.97, .5], [.94, .74], [.86, .91], [.66, .965], [.34, .965], [.14, .91], [.06, .74], [.03, .5]
    ];
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
    const terrain = [
      [.23, .48, .13, .055], [.77, .52, .13, .055],
      [.49, .18, .035, .15], [.51, .82, .035, .15]
    ];
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
    document.querySelector("#boxScoreBody").innerHTML = state.players[selectedBoxTeam].map((player) => {
      let contribution = player.contribution;
      if (player.role === "General") contribution = `${state[`${selectedBoxTeam}Units`]} units remaining`;
      if (player.role === "Visual") contribution = `${Math.round(72 + player.rating * 2)}% coverage`;
      if (player.role === "Musical") contribution = `${Math.round(77 + player.rating * 1.7)}% signal uptime`;
      return `<tr><td><strong>${player.name}</strong></td><td>${player.role}</td><td class="${player.rating >= 8 ? "rating-elite" : ""}">${player.rating.toFixed(1)}</td><td>${player.eliminations}</td><td>${player.assists}</td><td>${player.zoneCaptures}</td><td>${player.zoneDefenses}</td><td>${player.interceptions}</td><td>${player.distanceCarried}</td><td>${player.networkCoverage}%</td><td>${contribution}</td></tr>`;
    }).join("");
  }

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
      return state.players[team].map(({ id, name, primaryRole, role, overall, roleRatings }) => ({ id, name, primaryRole, role, overall, roleRatings }));
    },
    getReserves(team) { return reserves[team].map(({ id, name, primaryRole, overall }) => ({ id, name, primaryRole, role: primaryRole, overall })); },
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
      state.running = true;
      while (!state.finished) update(Math.min(2, duration - state.elapsed));
      draw();
      return getResult();
    }
  };
})();
