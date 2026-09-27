(function exposeDraftEngine(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ProxyDraft = api;
})(typeof globalThis !== "undefined" ? globalThis : this, () => {
  const TEAM_DEFINITIONS = [
    ["New York Knights", "Americas", "Madison Square Garden"], ["Los Angeles Stars", "Americas", "Rose Bowl"], ["Mexico City Aguilas", "Americas", "High Plateau"],
    ["Toronto Huskies", "Americas", "Frozen Terminal"], ["Sao Paulo Pulse", "Americas", "Canopy Grid"], ["Buenos Aires Gauchos", "Americas", "River Exchange"],
    ["Costa Rica Ticos", "Americas", "Castle of Oz"], ["Chicago Wind", "Americas", "Civic Rotunda"], ["Louisville Sluggers", "Americas", "Churchill Downs"],
    ["Austin Outlaws", "Americas", "Hill Country"], ["Seattle Rainiers", "Americas", "Rainworks"], ["Miami Vice", "Americas", "Biscayne Causeway"],
    ["New Orleans Voodoo", "Americas", "Bayou Crossroads"], ["Denver High", "Americas", "Mile High Switchbacks"], ["Vancouver Voyageurs", "Americas", "The Orpheum"],
    ["London Crown", "Eurasia-Africa", "Flooded Borough"], ["Berlin Union", "Eurasia-Africa", "Iron Ring"], ["Paris Catacombs", "Eurasia-Africa", "Grand Arcade"],
    ["Rome Legion", "Eurasia-Africa", "Marble Basin"], ["Madrid Royal", "Eurasia-Africa", "Sun Court"], ["Dublin Harps", "Eurasia-Africa", "Green Bastion"],
    ["Stockholm Isles", "Eurasia-Africa", "Archipelago Yard"], ["Istanbul Janissaries", "Eurasia-Africa", "Bosporus Crossing"], ["Tokyo Ronin", "Eurasia-Africa", "Neon Canals"],
    ["Seoul Arrows", "Eurasia-Africa", "Glass Gardens"], ["Mumbai Monsoon", "Eurasia-Africa", "Rain District"], ["Singapore Orchids", "Eurasia-Africa", "Harbor Stack"],
    ["Moscow Cosmonauts", "Eurasia-Africa", "Winter Complex"], ["Cairo Scarabs", "Eurasia-Africa", "Desert Causeway"], ["Lagos Cowries", "Eurasia-Africa", "Lagoon Exchange"]
  ];
  const TEAM_NAMES = TEAM_DEFINITIONS.map(([name]) => name);
  const ROSTER_TARGETS = { General: 1, Cannon: 3, Runner: 3, Bruiser: 3, Visual: 1, Musical: 1 };
  const ACTIVE_SLOTS = ["General", "Bruiser", "Bruiser", "Runner", "Runner", "Cannon", "Cannon", "Visual", "Musical"];
  const STRATEGIES = ["balanced", "pressure", "fortress", "longRange", "wide", "overload", "escort", "counter"];

  function createRandom(seed) {
    let value = seed;
    const random = () => {
      value += 0x6D2B79F5;
      let result = value;
      result = Math.imul(result ^ result >>> 15, result | 1);
      result ^= result + Math.imul(result ^ result >>> 7, result | 61);
      return ((result ^ result >>> 14) >>> 0) / 4294967296;
    };
    random.getState = () => value;
    return random;
  }

  function createOrder(teamOrder, rounds) {
    const order = [];
    for (let round = 0; round < rounds; round += 1) {
      const teams = teamOrder.slice();
      if (round % 2) teams.reverse();
      teams.forEach((teamIndex) => order.push({ round: round + 1, teamIndex }));
    }
    return order;
  }

  function createDraft(players, options = {}) {
    const userTeamIndex = options.userTeamIndex ?? 7;
    const rounds = options.rounds ?? 12;
    const random = createRandom(options.snapshot?.randomState ?? options.seed ?? 3000);
    const teams = TEAM_DEFINITIONS.map(([name, conference, homeField], index) => ({
      id: index,
      name,
      conference,
      homeField,
      strategy: STRATEGIES[index % STRATEGIES.length],
      roster: []
    }));
    const teamOrder = options.snapshot?.draftOrder || Array.from({ length: teams.length }, (_, index) => index);
    if (!options.snapshot && options.randomizeDraftOrder) {
      for (let index = teamOrder.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1));
        [teamOrder[index], teamOrder[swapIndex]] = [teamOrder[swapIndex], teamOrder[index]];
      }
    }
    const state = {
      teams,
      players,
      availableIds: new Set(players.map((player) => player.id)),
      order: createOrder(teamOrder, rounds),
      pickIndex: 0,
      history: [],
      userTeamIndex,
      complete: false
    };

    if (options.snapshot) {
      const snapshot = options.snapshot;
      const playersById = new Map(players.map((player) => [player.id, player]));
      state.pickIndex = snapshot.pickIndex;
      state.history = snapshot.history.slice();
      state.complete = snapshot.complete;
      state.order = createOrder(snapshot.draftOrder || teamOrder, rounds);
      state.availableIds = new Set(snapshot.availableIds);
      state.teams.forEach((team) => { team.roster = (snapshot.rosters[team.id] || []).map((id) => playersById.get(id)).filter(Boolean); });
    }

    function currentPick() {
      return state.order[state.pickIndex] || null;
    }

    function availablePlayers() {
      return state.players.filter((player) => state.availableIds.has(player.id));
    }

    function roleCounts(team) {
      return team.roster.reduce((counts, player) => {
        counts[player.primaryRole] = (counts[player.primaryRole] || 0) + 1;
        return counts;
      }, {});
    }

    function playerValue(player, team) {
      const counts = roleCounts(team);
      const need = Math.max(0, ROSTER_TARGETS[player.primaryRole] - (counts[player.primaryRole] || 0));
      const roundsLeft = rounds - team.roster.length;
      const totalHoles = Object.entries(ROSTER_TARGETS).reduce((sum, [role, target]) => sum + Math.max(0, target - (counts[role] || 0)), 0);
      const roleRatings = Object.values(player.roleRatings).sort((a, b) => b - a);
      const versatility = ((roleRatings[1] || 0) + (roleRatings[2] || 0)) / 2;
      const strategyBonus = {
        pressure: { Runner: 5, Bruiser: 3 }, fortress: { Bruiser: 5, General: 2 }, longRange: { Cannon: 6 },
        wide: { Runner: 5, Visual: 2 }, overload: { Bruiser: 4, Cannon: 3 }, escort: { Runner: 3, Bruiser: 4 },
        counter: { General: 3, Cannon: 3 }, balanced: {}
      }[team.strategy][player.primaryRole] || 0;
      const urgency = need && totalHoles >= roundsLeft ? 25 : need ? 10 : -9;
      return player.overall * .7 + versatility * .12 + urgency + strategyBonus + (random() - .5) * 5;
    }

    function canPick(team, player) {
      if (!player || !state.availableIds.has(player.id)) return false;
      const counts = roleCounts(team);
      counts[player.primaryRole] = (counts[player.primaryRole] || 0) + 1;
      const holesAfterPick = Object.entries(ROSTER_TARGETS).reduce((sum, [role, target]) => sum + Math.max(0, target - (counts[role] || 0)), 0);
      const rosterSlotsAfterPick = rounds - team.roster.length - 1;
      return holesAfterPick <= rosterSlotsAfterPick;
    }

    function selectCpuPlayer(team) {
      const available = availablePlayers();
      const eliteFloor = available.slice().sort((a, b) => b.overall - a.overall).slice(0, 18);
      const counts = roleCounts(team);
      const needed = Object.keys(ROSTER_TARGETS).flatMap((role) => {
        if ((counts[role] || 0) >= ROSTER_TARGETS[role]) return [];
        return available.filter((player) => player.primaryRole === role).sort((a, b) => b.overall - a.overall).slice(0, 16);
      });
      const candidates = [...new Map([...eliteFloor, ...needed].map((player) => [player.id, player])).values()].filter((player) => canPick(team, player));
      return candidates.map((player) => ({ player, value: playerValue(player, team) })).reduce((best, entry) => entry.value > best.value ? entry : best).player;
    }

    function commitPick(playerId) {
      const pick = currentPick();
      if (!pick || !state.availableIds.has(playerId)) return false;
      const player = state.players.find((candidate) => candidate.id === playerId);
      const team = state.teams[pick.teamIndex];
      team.roster.push(player);
      state.availableIds.delete(playerId);
      state.history.push({ overall: state.pickIndex + 1, round: pick.round, teamIndex: pick.teamIndex, playerId });
      state.pickIndex += 1;
      state.complete = state.pickIndex >= state.order.length;
      return true;
    }

    function advanceToUser() {
      while (!state.complete && currentPick().teamIndex !== userTeamIndex) {
        const team = state.teams[currentPick().teamIndex];
        commitPick(selectCpuPlayer(team).id);
      }
      return state;
    }

    function commitCpuPick() {
      if (state.complete || currentPick()?.teamIndex === userTeamIndex) return null;
      const team = state.teams[currentPick().teamIndex];
      const player = selectCpuPlayer(team);
      commitPick(player.id);
      return { team, player, pick: state.history.at(-1) };
    }

    function userPick(playerId, options = {}) {
      if (state.complete || currentPick()?.teamIndex !== userTeamIndex) return false;
      const player = state.players.find((candidate) => candidate.id === playerId);
      if (!canPick(state.teams[userTeamIndex], player)) return false;
      if (!commitPick(playerId)) return false;
      if (options.advance !== false) advanceToUser();
      return true;
    }

    function autoDraftAll() {
      while (!state.complete) {
        const team = state.teams[currentPick().teamIndex];
        commitPick(selectCpuPlayer(team).id);
      }
      return state;
    }

    function snapshot() {
      return {
        userTeamIndex: state.userTeamIndex,
        pickIndex: state.pickIndex,
        history: state.history.slice(),
        availableIds: [...state.availableIds],
        rosters: Object.fromEntries(state.teams.map((team) => [team.id, team.roster.map((player) => player.id)])),
        complete: state.complete,
        draftOrder: state.order.slice(0, teams.length).map(({ teamIndex }) => teamIndex),
        randomState: random.getState()
      };
    }

    function buildActiveLineup(team) {
      const memo = new Map();
      function assign(slotIndex, usedMask) {
        if (slotIndex === ACTIVE_SLOTS.length) return { score: 0, lineup: [] };
        const key = `${slotIndex}:${usedMask}`;
        if (memo.has(key)) return memo.get(key);
        const role = ACTIVE_SLOTS[slotIndex];
        let best = { score: -Infinity, lineup: [] };
        team.roster.forEach((player, playerIndex) => {
          if (usedMask & (1 << playerIndex)) return;
          const next = assign(slotIndex + 1, usedMask | (1 << playerIndex));
          const score = (player.roleRatings[role] || 0) + next.score;
          if (score > best.score) best = { score, lineup: [{ player, role }, ...next.lineup] };
        });
        memo.set(key, best);
        return best;
      }
      const result = assign(0, 0);
      const activeIds = new Set(result.lineup.map((entry) => entry.player.id));
      return { ...result, reserves: team.roster.filter((player) => !activeIds.has(player.id)) };
    }

    if (!options.snapshot && !options.deferCpu) advanceToUser();
    return { state, currentPick, availablePlayers, roleCounts, canPick: (player) => canPick(state.teams[userTeamIndex], player), userPick, commitCpuPick, advanceToUser, autoDraftAll, buildActiveLineup, snapshot };
  }

  function restoreDraft(players, snapshot) {
    return createDraft(players, { userTeamIndex: snapshot.userTeamIndex, snapshot });
  }

  return { createDraft, restoreDraft, TEAM_NAMES, TEAM_DEFINITIONS, ROSTER_TARGETS, ACTIVE_SLOTS };
});