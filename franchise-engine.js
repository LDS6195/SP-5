(function exposeFranchiseEngine(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ProxyFranchise = api;
})(typeof globalThis !== "undefined" ? globalThis : this, () => {
  const ACHIEVEMENTS = [
    { id: "league-champion", tier: "trophy", title: "League Champion", description: "Win the Proxy League championship." },
    { id: "dynasty", tier: "trophy", title: "Dynasty", description: "Win three league championships." },
    { id: "perfect-season", tier: "trophy", title: "Perfect Campaign", description: "Complete a season without a loss." },
    { id: "player-of-year", tier: "trophy", title: "Player of the Year", description: "Roster the league's Player of the Year." },
    { id: "general-of-year", tier: "trophy", title: "General of the Year", description: "Roster the league's General of the Year." },
    { id: "playoffs-mvp", tier: "trophy", title: "Playoffs MVP", description: "Roster the most valuable field player of the playoffs." },
    { id: "conference-champion", tier: "banner", title: "Conference Champion", description: "Win a conference championship." },
    { id: "best-record", tier: "banner", title: "League Standard", description: "Finish with the league's best regular-season record." },
    { id: "all-league-first", tier: "banner", title: "First-Team Standard", description: "Roster a 1st Team All-EWSL player." },
    { id: "all-league-second", tier: "banner", title: "Second-Team Standard", description: "Roster a 2nd Team All-EWSL player." },
    { id: "season-elimination-leader", tier: "banner", title: "Elimination Crown", description: "Roster the season elimination leader." },
    { id: "season-capture-leader", tier: "banner", title: "Territory Crown", description: "Roster the season zone-capture leader." },
    { id: "first-win", tier: "badge", title: "First Signal", description: "Win the first game of a franchise." },
    { id: "ten-win-season", tier: "badge", title: "Contender", description: "Win 10 games in one regular season." },
    { id: "twelve-win-season", tier: "plaque", title: "Commanding Season", description: "Win 12 games in one regular season." },
    { id: "fourteen-win-season", tier: "plaque", title: "Near Perfection", description: "Win 14 games in one regular season." },
    { id: "player-50-wins", tier: "badge", title: "Veteran Victor", description: "A rostered player reaches 50 career wins." },
    { id: "player-100-wins", tier: "plaque", title: "Century of Victory", description: "A rostered player reaches 100 career wins." },
    { id: "player-100-eliminations", tier: "badge", title: "Century Mark", description: "A rostered player reaches 100 career eliminations." },
    { id: "player-250-eliminations", tier: "plaque", title: "Force Multiplier", description: "A rostered player reaches 250 career eliminations." },
    { id: "player-500-eliminations", tier: "trophy", title: "Living Weapon", description: "A rostered player reaches 500 career eliminations." },
    { id: "player-25-captures", tier: "badge", title: "Pathfinder", description: "A rostered player reaches 25 career zone captures." },
    { id: "player-50-captures", tier: "plaque", title: "Territory Maker", description: "A rostered player reaches 50 career zone captures." },
    { id: "player-100-captures", tier: "trophy", title: "Map Breaker", description: "A rostered player reaches 100 career zone captures." },
    { id: "ten-potm", tier: "plaque", title: "Center Stage", description: "A rostered player wins 10 Player of the Match awards." }
  ];
  const additionalAchievements = [
    ["five-win-season", "badge", "First Contender", "Win five regular-season games."],
    ["six-win-season", "badge", "Steady Signal", "Win six regular-season games."],
    ["seven-win-season", "badge", "Winning Shape", "Win seven regular-season games."],
    ["eight-win-season", "badge", "Even Terms", "Finish a regular season at .500 or better."],
    ["nine-win-season", "banner", "Above the Line", "Win nine regular-season games."],
    ["eleven-win-season", "banner", "Upper Division", "Win eleven regular-season games."],
    ["thirteen-win-season", "plaque", "Elite Campaign", "Win thirteen regular-season games."],
    ["fifteen-win-season", "trophy", "Dominant Campaign", "Win fifteen regular-season games."],
    ["positive-differential", "badge", "Force Advantage", "Finish a season with a positive unit differential."],
    ["top-three-seed", "banner", "Home Field Secured", "Earn a top-three conference seed."],
    ["control-specialist", "badge", "Territory Doctrine", "Win five control victories in one season."],
    ["elimination-specialist", "badge", "Break the Line", "Win three elimination victories in one season."],
    ["close-quarters", "badge", "Down to the Wire", "Win a game by fewer than ten control points."],
    ["blowout-win", "banner", "Overwhelming Force", "Win a game by more than 150 control points."],
    ["unit-shutout", "banner", "Clean Sweep", "Win an elimination victory without losing a unit."],
    ["comeback-win", "banner", "Reversal of Fortune", "Win after trailing at halftime."],
    ["five-zone-control", "plaque", "Total Map", "Control all five zones at once."],
    ["signal-survivor", "badge", "Network Intact", "Win with both Signalers surviving."],
    ["iron-wall", "plaque", "Iron Wall", "Win while losing fewer than ten units."],
    ["road-warrior", "banner", "Road Warrior", "Win five away games in one season."],
    ["home-stronghold", "banner", "Home Stronghold", "Win every home game in one season."],
    ["balanced-roster", "badge", "Balanced Formation", "Fill every roster role family."],
    ["full-chemistry", "banner", "Complete Signal", "Reach maximum roster chemistry."],
    ["deep-bench", "badge", "Depth on Call", "Finish a season with all three reserves active in a match."],
    ["role-flex", "badge", "Role Fluidity", "Start a player outside their primary position."],
    ["signal-pair", "badge", "Paired Signals", "Start both a Visual and Sonic Signaler in one match."],
    ["young-core", "badge", "New Guard", "Win with at least six first-season draftees."],
    ["veteran-core", "banner", "Old Hands", "Win with at least six returning players."],
    ["four-transactions", "badge", "Active Desk", "Complete four free-agent transactions in one season."],
    ["protected-core", "badge", "Core Protected", "Protect six players in the offseason."],
    ["first-pick", "badge", "First on the Board", "Make the first selection of a draft."],
    ["late-round-gem", "badge", "Late-Round Gem", "Draft a player who becomes an award winner."],
    ["draft-complete", "badge", "Roster Filed", "Complete a twelve-round draft."],
    ["draft-all-roles", "badge", "Complete Palette", "Draft at least one player from every role family."],
    ["draft-general", "badge", "Voice of Command", "Draft a General rated 90 or higher."],
    ["draft-cannon", "badge", "Long Range", "Draft a Cannon rated 90 or higher."],
    ["draft-runner", "badge", "Open Field", "Draft a Runner rated 90 or higher."],
    ["draft-bruiser", "badge", "Heavy Contact", "Draft a Bruiser rated 90 or higher."],
    ["draft-signaler", "badge", "Clear Channel", "Draft a Signaler rated 90 or higher."],
    ["draft-versatility", "banner", "Swiss Army Squad", "Draft five players with a secondary rating of 85 or higher."],
    ["draft-watchlist", "badge", "Scouting Department", "Watchlist ten prospects before drafting."],
    ["rating-nine", "badge", "Nine Point Form", "Roster a player with a 9.0 season rating."],
    ["rating-nine-five", "banner", "Exceptional Form", "Roster a player with a 9.5 season rating."],
    ["rating-ten", "trophy", "Perfect Rating", "Roster a player with a 10.0 season rating."],
    ["career-ten-wins", "badge", "First Decade", "A rostered player reaches ten career wins."],
    ["career-250-captures", "plaque", "Territory Veteran", "A rostered player reaches 250 career captures."],
    ["career-100-assists", "plaque", "Second Voice", "A rostered player reaches 100 career assists."],
    ["career-100-interceptions", "plaque", "Cut the Line", "A rostered player reaches 100 career interceptions."],
    ["career-1000-distance", "badge", "Miles Under Fire", "A rostered player carries 1,000 career distance units."],
    ["career-100-decoys", "plaque", "False Signal", "A rostered player completes 100 successful decoys."],
    ["career-100-coverage", "banner", "Always Connected", "A rostered player records 100 coverage appearances."],
    ["career-50-defense", "badge", "Hold the Line", "A rostered player reaches 50 career zone defenses."],
    ["career-50-potm", "trophy", "Match Authority", "A rostered player wins 50 Player of the Match awards."],
    ["career-ten-seasons", "plaque", "Long Service", "A player appears across ten seasons."],
    ["wild-card-win", "badge", "Survive and Advance", "Win a wild-card playoff game."],
    ["semifinal-win", "banner", "Last Four", "Win a conference semifinal."],
    ["conference-final-win", "banner", "Reach the Summit", "Win a conference championship game."],
    ["final-appearance", "banner", "Finalist", "Reach the league championship game."],
    ["playoff-sweep", "trophy", "Postseason Sweep", "Win every playoff game in a championship run."],
    ["playoff-comeback", "banner", "October Reversal", "Win a playoff game after trailing at halftime."],
    ["playoff-elimination", "banner", "Knockout Stage", "Win a playoff game by elimination."],
    ["mvp-roster", "trophy", "MVP Company", "Roster the Playoffs MVP and Player of the Year in one season."],
    ["award-triple", "trophy", "Three Crowns", "Roster three major award winners in one season."],
    ["repeat-champion", "trophy", "Repeat Signal", "Win championships in consecutive seasons."],
    ["three-playoff-appearances", "banner", "Postseason Regular", "Reach the playoffs three times."],
    ["five-playoff-appearances", "plaque", "October Institution", "Reach the playoffs five times."],
    ["ten-playoff-appearances", "trophy", "Permanent Contender", "Reach the playoffs ten times."],
    ["ten-season-franchise", "plaque", "Decade Franchise", "Complete ten seasons with one franchise."],
    ["twenty-season-franchise", "trophy", "Generational Franchise", "Complete twenty seasons with one franchise."],
    ["career-positive", "banner", "Winning Tradition", "Finish a player career with a winning record."],
    ["career-champion", "trophy", "Champion Personnel", "Roster a player with three championships."],
    ["record-book", "banner", "Into the Archive", "Set a season record in any tracked category."],
    ["all-league-pair", "banner", "First and Second", "Roster 1st Team and 2nd Team All-EWSL players."],
    ["all-league-nine", "trophy", "Complete First Team", "Roster all nine 1st Team All-EWSL positions."],
    ["stat-leader-pair", "banner", "Statistical Range", "Roster two different season statistical leaders."],
    ["trophy-room-ten", "plaque", "Ten Relics", "Unlock ten achievement types."],
    ["trophy-room-twenty-five", "trophy", "Quarter Century", "Unlock twenty-five achievement types."],
    ["trophy-room-fifty", "trophy", "Half Century", "Unlock fifty achievement types."],
    ["trophy-room-seventy-five", "trophy", "Three Quarters", "Unlock seventy-five achievement types."],
    ["trophy-room-complete", "trophy", "Complete Catalog", "Unlock every achievement type."]
  ].map(([id, tier, title, description]) => ({ id, tier, title, description }));
  const omittedAchievements = new Set(["career-positive", "career-champion", "record-book", "all-league-pair", "stat-leader-pair"]);
  ACHIEVEMENTS.push(...additionalAchievements.filter((achievement) => !omittedAchievements.has(achievement.id)));
  function createRandom(seed) {
    let value = seed;
    return () => {
      value += 0x6D2B79F5;
      let result = value;
      result = Math.imul(result ^ result >>> 15, result | 1);
      result ^= result + Math.imul(result ^ result >>> 7, result | 61);
      return ((result ^ result >>> 14) >>> 0) / 4294967296;
    };
  }

  function roundRobin(teamIds) {
    const rotation = [...teamIds, null];
    const rounds = [];
    for (let round = 0; round < teamIds.length; round += 1) {
      const games = [];
      let bye = null;
      for (let index = 0; index < rotation.length / 2; index += 1) {
        const first = rotation[index];
        const second = rotation[rotation.length - 1 - index];
        if (first === null || second === null) bye = first ?? second;
        else games.push(round % 2 ? [second, first] : [first, second]);
      }
      rounds.push({ games, bye });
      rotation.splice(1, 0, rotation.pop());
    }
    return rounds;
  }

  function balanceHomeAway(weeks, teamCount) {
    const games = weeks.flatMap((week) => week.games);
    const adjacency = Array.from({ length: teamCount }, () => []);
    games.forEach((game, edgeIndex) => {
      adjacency[game.homeTeamId].push({ edgeIndex, other: game.awayTeamId });
      adjacency[game.awayTeamId].push({ edgeIndex, other: game.homeTeamId });
    });
    const used = new Set();
    function orientFrom(teamId) {
      while (adjacency[teamId].length) {
        const edge = adjacency[teamId].pop();
        if (used.has(edge.edgeIndex)) continue;
        used.add(edge.edgeIndex);
        games[edge.edgeIndex].homeTeamId = teamId;
        games[edge.edgeIndex].awayTeamId = edge.other;
        orientFrom(edge.other);
      }
    }
    for (let teamId = 0; teamId < teamCount; teamId += 1) orientFrom(teamId);
  }

  function generateSchedule(teams, season = 8) {
    const conferences = [...new Set(teams.map((team) => team.conference))];
    if (conferences.length !== 2) throw new Error("Schedule requires exactly two conferences.");
    const first = roundRobin(teams.filter((team) => team.conference === conferences[0]).map((team) => team.id));
    const second = roundRobin(teams.filter((team) => team.conference === conferences[1]).map((team) => team.id));
    const weeks = first.map((round, index) => ({
      week: index + 1,
      games: [...round.games, ...second[index].games, index % 2 ? [second[index].bye, round.bye] : [round.bye, second[index].bye]].map(([homeTeamId, awayTeamId], gameIndex) => ({
        id: `s${season}-w${index + 1}-g${gameIndex + 1}`,
        week: index + 1,
        homeTeamId,
        awayTeamId,
        status: "upcoming",
        result: null
      }))
    }));
    const previousCrossPairs = new Set(weeks.flatMap((week) => week.games.filter((game) => teams[game.homeTeamId].conference !== teams[game.awayTeamId].conference).map((game) => [game.homeTeamId, game.awayTeamId].sort((a, b) => a - b).join("-"))));
    const firstIds = teams.filter((team) => team.conference === conferences[0]).map((team) => team.id);
    const secondIds = teams.filter((team) => team.conference === conferences[1]).map((team) => team.id);
    let finalPairs = [];
    for (let offset = 0; offset < secondIds.length; offset += 1) {
      const candidate = firstIds.map((teamId, index) => [teamId, secondIds[(index + offset) % secondIds.length]]);
      if (candidate.every((pair) => !previousCrossPairs.has([...pair].sort((a, b) => a - b).join("-")))) { finalPairs = candidate; break; }
    }
    if (!finalPairs.length) throw new Error("Unable to create unique cross-conference finale.");
    weeks.push({
      week: 16,
      games: finalPairs.map(([firstTeamId, secondTeamId], index) => ({
        id: `s${season}-w16-g${index + 1}`,
        week: 16,
        homeTeamId: index % 2 ? secondTeamId : firstTeamId,
        awayTeamId: index % 2 ? firstTeamId : secondTeamId,
        status: "upcoming",
        result: null
      }))
    });
    balanceHomeAway(weeks, teams.length);
    return weeks;
  }

  const FATIGUE_COST = { General: 1.2, Visual: 1.6, Musical: 1.6, Cannon: 2.6, Bruiser: 3.2, Runner: 3.4 };
  const fatiguePenalty = (player) => (player.fatigue || 0) * .2;

  function applyFatigue(state, game, result) {
    ["home", "away"].forEach((side) => {
      const team = state.teams[game[`${side}TeamId`]];
      const played = new Map((result.players?.[side] || []).map((line) => [line.id, line]));
      (team?.roster || []).forEach((player) => {
        const line = played.get(player.id);
        const share = line ? Math.min(1, (line.minutes ?? 30) / 30) : 0;
        const change = line ? (FATIGUE_COST[line.role] || FATIGUE_COST[player.primaryRole] || 2.5) * share : -6;
        player.fatigue = Math.round(Math.max(0, Math.min(35, (player.fatigue || 0) + change - .8)) * 10) / 10;
      });
    });
  }

  function roleStrength(team, role, fallback) {
    const ratings = (team.roster || []).map((player) => player.roleRatings?.[role] - fatiguePenalty(player)).filter(Number.isFinite).sort((a, b) => b - a);
    return ratings.length ? ratings.slice(0, role === "General" || role === "Visual" || role === "Musical" ? 1 : 2).reduce((sum, value) => sum + value, 0) / Math.min(ratings.length, role === "General" || role === "Visual" || role === "Musical" ? 1 : 2) : fallback;
  }

  function teamProfile(team) {
    const fallback = 76 + team.id % 7;
    const roleCoverage = new Set((team.roster || []).map((player) => player.primaryRole)).size;
    const chemistry = Math.min(1.08, .92 + Math.min((team.roster || []).length, 12) * .005 + roleCoverage * .01);
    return {
      general: roleStrength(team, "General", fallback), cannon: roleStrength(team, "Cannon", fallback),
      runner: roleStrength(team, "Runner", fallback), bruiser: roleStrength(team, "Bruiser", fallback),
      visual: roleStrength(team, "Visual", fallback), musical: roleStrength(team, "Musical", fallback), chemistry
    };
  }

  function playerBox(team, won, random) {
    const activeTargets = { General: 1, Cannon: 2, Runner: 2, Bruiser: 2, Visual: 1, Musical: 1 };
    const freshness = (player) => player.overall + (player.form || 0) - fatiguePenalty(player);
    const roster = Object.entries(activeTargets).flatMap(([role, count]) => (team.roster || []).filter((player) => player.primaryRole === role).sort((a, b) => freshness(b) - freshness(a)).slice(0, count));
    if (!roster.length) return [];
    return roster.map((player) => {
      const role = player.primaryRole;
      const quality = (freshness(player) - 65) / 30;
      const standout = random() < .06 + Math.max(0, quality) * .07 ? 1 + random() * .9 : 0;
      const rating = Math.max(4, Math.min(10, 5.4 + quality * 2.75 + (won ? .45 : -.1) + (random() - .5) * 1.6 + standout));
      const output = .55 + (rating - 5) * .18;
      const scaled = (max) => Math.floor(random() * max * output);
      const eliminations = ["Cannon", "Bruiser"].includes(role) ? scaled(8) : role === "Runner" ? (random() < .12 * output ? 1 : 0) : 0;
      const isArtist = role === "Visual" || role === "Musical";
      return {
        id: player.id,
        name: player.name,
        role,
        rating: Number(rating.toFixed(1)),
        eliminations,
        assists: role === "Cannon" ? scaled(4) : 0,
        zoneCaptures: role === "Runner" ? scaled(5) : 0,
        zoneDefenses: role === "Bruiser" ? scaled(5) : 0,
        interceptions: role === "Runner" ? scaled(3) : 0,
        distanceCarried: role === "Runner" ? Math.round((180 + random() * 940) * output) : 0,
        decoysSuccessful: isArtist ? scaled(7) : 0,
        decoysDenied: isArtist ? scaled(6) : 0,
        networkCoverage: isArtist ? 72 + Math.floor(random() * 27) : 0,
        survived: random() < .58,
        contribution: `${player.overall} role rating`
      };
    });
  }

  function simulateGame(state, game) {
    const home = state.teams[game.homeTeamId];
    const away = state.teams[game.awayTeamId];
    const random = createRandom(state.seed + game.week * 101 + game.homeTeamId * 17 + game.awayTeamId * 31);
    const homeProfile = teamProfile(home);
    const awayProfile = teamProfile(away);
    const homeControl = (homeProfile.runner * .34 + homeProfile.general * .22 + homeProfile.bruiser * .16 + (homeProfile.visual + homeProfile.musical) * .14 + 1.5) * homeProfile.chemistry;
    const awayControl = (awayProfile.runner * .34 + awayProfile.general * .22 + awayProfile.bruiser * .16 + (awayProfile.visual + awayProfile.musical) * .14) * awayProfile.chemistry;
    const homeCombat = (homeProfile.cannon * .38 + homeProfile.bruiser * .37 + homeProfile.general * .15 + homeProfile.runner * .1) * homeProfile.chemistry;
    const awayCombat = (awayProfile.cannon * .38 + awayProfile.bruiser * .37 + awayProfile.general * .15 + awayProfile.runner * .1) * awayProfile.chemistry;
    const edge = (homeControl + homeCombat - awayControl - awayCombat) / 2;
    const homeWinProbability = 1 / (1 + Math.exp(-edge / 6));
    const homeWon = random() < homeWinProbability;
    const winnerControl = homeWon ? homeControl : awayControl;
    const winnerCombat = homeWon ? homeCombat : awayCombat;
    const eliminationChance = Math.max(.18, Math.min(.60, .22 + (winnerCombat - winnerControl) / 72));
    const victoryRoll = random();
    const victoryType = victoryRoll < eliminationChance ? "Elimination" : victoryRoll < eliminationChance + .13 ? "Time Limit" : "Control";
    const margin = 18 + Math.floor(random() * 118);
    const winnerScore = victoryType === "Control" ? 500 : victoryType === "Time Limit" ? 380 + Math.floor(random() * 115) : 310 + Math.floor(random() * 170);
    const loserScore = Math.max(140, winnerScore - margin);
    const winnerUnits = 34 + Math.floor(random() * 43);
    const loserUnits = victoryType === "Elimination" ? 0 : 17 + Math.floor(random() * 36);
    const result = {
      winner: homeWon ? "home" : "away",
      victoryType,
      homeScore: homeWon ? winnerScore : loserScore,
      awayScore: homeWon ? loserScore : winnerScore,
      homeUnits: homeWon ? winnerUnits : loserUnits,
      awayUnits: homeWon ? loserUnits : winnerUnits,
      duration: victoryType === "Elimination" ? 1050 + Math.floor(random() * 700) : victoryType === "Time Limit" ? 1800 : 1400 + Math.floor(random() * 400),
      homeZonesCaptured: 7 + Math.floor(random() * 12),
      awayZonesCaptured: 7 + Math.floor(random() * 12),
      homeZoneHoldTime: 0,
      awayZoneHoldTime: 0
    };
    result.homeZoneHoldTime = result.homeScore * 10;
    result.awayZoneHoldTime = result.awayScore * 10;
    result.players = { home: playerBox(home, homeWon, random), away: playerBox(away, !homeWon, random) };
    return result;
  }

  function createStandings(teams) {
    return teams.map((team) => ({ teamId: team.id, wins: 0, losses: 0, conferenceWins: 0, conferenceLosses: 0, zoneWins: 0, eliminationWins: 0, pointsFor: 0, pointsAgainst: 0, unitsFor: 0, unitsAgainst: 0 }));
  }

  function emptyPlayerTotals() {
    return { appearances: 0, wins: 0, losses: 0, ratingTotal: 0, eliminations: 0, assists: 0, zoneCaptures: 0, zoneDefenses: 0, interceptions: 0, distanceCarried: 0, decoysSuccessful: 0, decoysDenied: 0, coverageTotal: 0, coverageAppearances: 0, survived: 0, playerOfMatch: 0, playoffWins: 0, playoffLosses: 0, championships: 0 };
  }

  function emptyGeneralTotals() {
    return { starts: 0, wins: 0, losses: 0, ratingTotal: 0, teamEliminations: 0, survivalTotal: 0, zonesCaptured: 0, zoneHoldTime: 0, playoffWins: 0, playoffLosses: 0, championships: 0, zoneWins: 0, eliminationWins: 0 };
  }

  function getPlayerRecord(state, team, line) {
    const rosterPlayer = team.roster?.find((player) => player.id === line.id || player.name === line.name);
    const id = line.id || rosterPlayer?.id || line.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (!state.playerRecords[id]) {
      state.playerRecords[id] = { id, name: line.name, primaryRole: rosterPlayer?.primaryRole || line.role, career: emptyPlayerTotals(), generalCareer: emptyGeneralTotals(), seasons: {}, awards: [] };
    }
    const record = state.playerRecords[id];
    if (!record.awards) record.awards = [];
    if (!record.seasons[state.season]) record.seasons[state.season] = { season: state.season, totals: emptyPlayerTotals(), general: emptyGeneralTotals(), teams: {} };
    const season = record.seasons[state.season];
    if (!season.teams[team.id]) season.teams[team.id] = { teamId: team.id, teamName: team.name, appearances: 0, wins: 0, losses: 0 };
    return { record, season, teamHistory: season.teams[team.id] };
  }

  function addPlayerTotals(target, line, won, playoff) {
    target.appearances += 1;
    target[won ? "wins" : "losses"] += 1;
    target.ratingTotal += Number(line.rating) || 0;
    ["eliminations", "assists", "zoneCaptures", "zoneDefenses", "interceptions", "distanceCarried", "decoysSuccessful", "decoysDenied"].forEach((stat) => { target[stat] += Number(line[stat]) || 0; });
    if (Number(line.networkCoverage) > 0) { target.coverageTotal += line.networkCoverage; target.coverageAppearances += 1; }
    if (line.survived) target.survived += 1;
    if (playoff) target[won ? "playoffWins" : "playoffLosses"] += 1;
  }

  function addGeneralTotals(target, line, result, side, won, playoff) {
    target.starts += 1;
    target[won ? "wins" : "losses"] += 1;
    target.ratingTotal += Number(line.rating) || 0;
    target.teamEliminations += 100 - result[side === "home" ? "awayUnits" : "homeUnits"];
    target.survivalTotal += result[side === "home" ? "homeUnits" : "awayUnits"];
    target.zonesCaptured += result[`${side}ZonesCaptured`] || 0;
    target.zoneHoldTime += result[`${side}ZoneHoldTime`] || 0;
    if (won) target[result.victoryType === "Elimination" ? "eliminationWins" : "zoneWins"] += 1;
    if (playoff) target[won ? "playoffWins" : "playoffLosses"] += 1;
  }

  function aggregatePlayers(state, game, result) {
    ["home", "away"].forEach((side) => {
      const team = state.teams[game[`${side}TeamId`]];
      const won = result.winner === side;
      const playoff = game.stage === "playoff";
      (result.players?.[side] || []).forEach((line) => {
        const { record, season, teamHistory } = getPlayerRecord(state, team, line);
        addPlayerTotals(record.career, line, won, playoff);
        addPlayerTotals(season.totals, line, won, playoff);
        teamHistory.appearances += 1;
        teamHistory[won ? "wins" : "losses"] += 1;
        if (line.role === "General") {
          addGeneralTotals(record.generalCareer, line, result, side, won, playoff);
          addGeneralTotals(season.general, line, result, side, won, playoff);
        }
      });
      const eligible = (result.players?.[side] || []).slice().sort((a, b) => b.rating - a.rating)[0];
      if (eligible) {
        const { record, season } = getPlayerRecord(state, team, eligible);
        record.career.playerOfMatch += won ? 1 : 0;
        season.totals.playerOfMatch += won ? 1 : 0;
      }
    });
  }

  const GAME_RECORD_STATS = ["eliminations", "assists", "zoneCaptures", "zoneDefenses", "interceptions", "distanceCarried", "decoysSuccessful"];

  function trackGameRecords(state, game, result) {
    ensureGameRecords(state);
    ["home", "away"].forEach((side) => {
      const team = state.teams[game[`${side}TeamId`]];
      (result.players?.[side] || []).forEach((line) => GAME_RECORD_STATS.forEach((stat) => {
        const value = line[stat] || 0;
        const list = (state.gameRecords[stat] ||= []);
        if (!value || (list.length >= 5 && value <= list[4].value)) return;
        list.push({ value, playerId: line.id, name: line.name, teamName: team?.name, season: state.season, week: game.week, round: game.stage === "playoff" ? game.round : null });
        list.sort((first, second) => second.value - first.value);
        list.length = Math.min(list.length, 5);
      }));
    });
  }

  function ensureGameRecords(state) {
    if (state.gameRecords) return state.gameRecords;
    state.gameRecords = {};
    [...state.schedule.flatMap((week) => week.games), ...(state.playoffs?.games || [])].filter((game) => game.result).forEach((game) => trackGameRecords(state, game, game.result));
    return state.gameRecords;
  }

  function recordResult(state, game, result) {
    ensureGameRecords(state);
    game.result = result;
    game.status = "completed";
    trackGameRecords(state, game, result);
    applyFatigue(state, game, result);
    if (game.stage === "playoff") {
      aggregatePlayers(state, game, result);
      return;
    }
    const homeRecord = state.standings[game.homeTeamId];
    const awayRecord = state.standings[game.awayTeamId];
    const homeWon = result.winner === "home";
    homeRecord[homeWon ? "wins" : "losses"] += 1;
    awayRecord[homeWon ? "losses" : "wins"] += 1;
    if (state.teams[game.homeTeamId].conference === state.teams[game.awayTeamId].conference) {
      homeRecord[homeWon ? "conferenceWins" : "conferenceLosses"] += 1;
      awayRecord[homeWon ? "conferenceLosses" : "conferenceWins"] += 1;
    }
    const winnerRecord = homeWon ? homeRecord : awayRecord;
    winnerRecord[result.victoryType === "Elimination" ? "eliminationWins" : "zoneWins"] += 1;
    homeRecord.pointsFor += result.homeScore; homeRecord.pointsAgainst += result.awayScore;
    awayRecord.pointsFor += result.awayScore; awayRecord.pointsAgainst += result.homeScore;
    homeRecord.unitsFor += result.homeUnits; homeRecord.unitsAgainst += result.awayUnits;
    awayRecord.unitsFor += result.awayUnits; awayRecord.unitsAgainst += result.homeUnits;
    aggregatePlayers(state, game, result);
  }

  function normalizeUserResult(state, game, result) {
    if (game.homeTeamId === state.userTeamId) return result;
    return {
      ...result,
      winner: result.winner === "home" ? "away" : "home",
      homeScore: result.awayScore, awayScore: result.homeScore,
      homeUnits: result.awayUnits, awayUnits: result.homeUnits,
      players: { home: result.players?.away || [], away: result.players?.home || [] }
    };
  }

  function standingsFor(state, conference) {
    return state.standings.filter((record) => state.teams[record.teamId].conference === conference).sort((first, second) => {
      const firstGames = first.wins + first.losses || 1;
      const secondGames = second.wins + second.losses || 1;
      const winDifference = second.wins / secondGames - first.wins / firstGames;
      if (winDifference) return winDifference;
      const conferenceDifference = second.conferenceWins - first.conferenceWins;
      if (conferenceDifference) return conferenceDifference;
      const unitDifference = (second.unitsFor - second.unitsAgainst) - (first.unitsFor - first.unitsAgainst);
      if (unitDifference) return unitDifference;
      return (second.pointsFor - second.pointsAgainst) - (first.pointsFor - first.pointsAgainst);
    });
  }

  function summarizePlayerTotals(totals) {
    return {
      ...totals,
      averageRating: totals.appearances ? Number((totals.ratingTotal / totals.appearances).toFixed(1)) : 0,
      winPercentage: totals.appearances ? Number((totals.wins / totals.appearances * 100).toFixed(1)) : 0,
      survivalRate: totals.appearances ? Number((totals.survived / totals.appearances * 100).toFixed(1)) : 0,
      networkCoverage: totals.coverageAppearances ? Number((totals.coverageTotal / totals.coverageAppearances).toFixed(1)) : 0
    };
  }

  function summarizeGeneralTotals(totals) {
    return {
      ...totals,
      averageRating: totals.starts ? Number((totals.ratingTotal / totals.starts).toFixed(1)) : 0,
      winPercentage: totals.starts ? Number((totals.wins / totals.starts * 100).toFixed(1)) : 0,
      survivalRate: totals.starts ? Number((totals.survivalTotal / totals.starts).toFixed(1)) : 0
    };
  }

  function playerLeaderboard(state, options = {}) {
    const scope = options.scope || "season";
    const seasonNumber = options.season ?? state.season;
    const stat = options.stat || "averageRating";
    return Object.values(state.playerRecords).map((record) => {
      const source = scope === "career" ? record.career : record.seasons[seasonNumber]?.totals;
      if (!source?.appearances) return null;
      const totals = summarizePlayerTotals(source);
      return { id: record.id, name: record.name, primaryRole: record.primaryRole, teams: scope === "career" ? Object.values(record.seasons).flatMap((season) => Object.values(season.teams)) : Object.values(record.seasons[seasonNumber]?.teams || {}), ...totals };
    }).filter(Boolean).sort((first, second) => (second[stat] || 0) - (first[stat] || 0) || second.appearances - first.appearances);
  }

  function generalLeaderboard(state, options = {}) {
    const scope = options.scope || "season";
    const seasonNumber = options.season ?? state.season;
    const stat = options.stat || "wins";
    return Object.values(state.playerRecords).map((record) => {
      const source = scope === "career" ? record.generalCareer : record.seasons[seasonNumber]?.general;
      if (!source?.starts) return null;
      const totals = summarizeGeneralTotals(source);
      return { id: record.id, name: record.name, primaryRole: record.primaryRole, ...totals };
    }).filter(Boolean).sort((first, second) => (second[stat] || 0) - (first[stat] || 0) || second.starts - first.starts);
  }

  function recordHolders(state, scope = "career") {
    const stats = scope === "career"
      ? ["wins", "eliminations", "assists", "zoneCaptures", "zoneDefenses", "interceptions", "distanceCarried", "playerOfMatch", "championships"]
      : ["eliminations", "assists", "zoneCaptures", "zoneDefenses", "interceptions", "distanceCarried", "playerOfMatch"];
    return stats.map((stat) => {
      let best = null;
      Object.values(state.playerRecords).forEach((record) => {
        const entries = scope === "career" ? [{ season: null, totals: record.career }] : Object.values(record.seasons);
        entries.forEach((entry) => {
          const value = entry.totals[stat] || 0;
          if (!best || value > best.value) best = { stat, value, playerId: record.id, playerName: record.name, season: entry.season };
        });
      });
      return best;
    }).filter(Boolean);
  }

  function grantAward(state, award) {
    const record = state.playerRecords[award.playerId];
    if (!record) return;
    const duplicate = record.awards.some((existing) => existing.season === award.season && existing.type === award.type && existing.title === award.title);
    if (!duplicate) record.awards.push(award);
  }

  function calculateSeasonAwards(state) {
    const awards = [];
    const generals = generalLeaderboard(state, { scope: "season", stat: "averageRating" }).filter((record) => record.starts >= 8)
      .sort((first, second) => (second.averageRating * .7 + second.winPercentage * .03) - (first.averageRating * .7 + first.winPercentage * .03));
    const players = playerLeaderboard(state, { scope: "season", stat: "averageRating" }).filter((record) => record.primaryRole !== "General" && record.appearances >= 8)
      .sort((first, second) => (second.averageRating * .75 + second.winPercentage * .025) - (first.averageRating * .75 + first.winPercentage * .025));
    if (generals[0]) awards.push({ season: state.season, type: "general-of-year", title: "General of the Year", playerId: generals[0].id, playerName: generals[0].name });
    if (players[0]) awards.push({ season: state.season, type: "player-of-year", title: "Player of the Year", playerId: players[0].id, playerName: players[0].name });

    const allLeagueCounts = { General: 1, Cannon: 2, Runner: 2, Bruiser: 2, Visual: 1, Musical: 1 };
    Object.entries(allLeagueCounts).forEach(([role, count]) => {
      const rolePlayers = playerLeaderboard(state, { scope: "season", stat: "averageRating" }).filter((record) => record.primaryRole === role);
      rolePlayers.slice(0, count).forEach((record) => awards.push({ season: state.season, type: "all-league-first", title: "1st Team All-EWSL", role, playerId: record.id, playerName: record.name }));
      rolePlayers.slice(count, count * 2).forEach((record) => awards.push({ season: state.season, type: "all-league-second", title: "2nd Team All-EWSL", role, playerId: record.id, playerName: record.name }));
    });

    const previousSeason = state.season - 1;
    const improved = Object.values(state.playerRecords).map((record) => {
      const current = record.seasons[state.season]?.totals;
      const previous = record.seasons[previousSeason]?.totals;
      if (!current || !previous || current.appearances < 8 || previous.appearances < 8) return null;
      return { record, improvement: summarizePlayerTotals(current).averageRating - summarizePlayerTotals(previous).averageRating };
    }).filter(Boolean).sort((first, second) => second.improvement - first.improvement)[0];
    if (improved?.improvement > 0) awards.push({ season: state.season, type: "most-improved", title: "Most Improved Player", playerId: improved.record.id, playerName: improved.record.name });

    const statisticalAwards = { eliminations: "Elimination Leader", assists: "Assist Leader", zoneCaptures: "Zone Capture Leader", zoneDefenses: "Zone Defense Leader", interceptions: "Interception Leader", distanceCarried: "Distance Leader" };
    Object.entries(statisticalAwards).forEach(([stat, title]) => {
      const leader = playerLeaderboard(state, { scope: "season", stat })[0];
      if (leader && leader[stat] > 0) awards.push({ season: state.season, type: `season-${stat}`, title, stat, value: leader[stat], playerId: leader.id, playerName: leader.name });
    });
    awards.forEach((award) => grantAward(state, award));
    return awards;
  }

  function unlockAchievement(state, id, subject = null) {
    const definition = ACHIEVEMENTS.find((achievement) => achievement.id === id);
    if (!definition) return;
    const key = subject ? `${id}:${subject.id}` : id;
    if (state.achievements.unlocked.some((achievement) => achievement.key === key)) return;
    state.achievements.unlocked.push({ ...definition, key, season: state.season, subjectId: subject?.id || null, subjectName: subject?.name || null });
  }

  function evaluateAchievements(state, context = {}) {
    const userTeam = state.teams[state.userTeamId];
    const userRecord = state.standings[state.userTeamId];
    if (userRecord.wins >= 1) unlockAchievement(state, "first-win");
    if (userRecord.wins >= 10) unlockAchievement(state, "ten-win-season");
    if (userRecord.wins >= 12) unlockAchievement(state, "twelve-win-season");
    if (userRecord.wins >= 14) unlockAchievement(state, "fourteen-win-season");
    if (userRecord.wins === 16) unlockAchievement(state, "perfect-season");
    const userPlayerIds = new Set((userTeam.roster || []).map((player) => player.id));
    Object.values(state.playerRecords).filter((record) => userPlayerIds.has(record.id)).forEach((record) => {
      if (record.career.wins >= 50) unlockAchievement(state, "player-50-wins", record);
      if (record.career.wins >= 100) unlockAchievement(state, "player-100-wins", record);
      if (record.career.eliminations >= 100) unlockAchievement(state, "player-100-eliminations", record);
      if (record.career.eliminations >= 250) unlockAchievement(state, "player-250-eliminations", record);
      if (record.career.eliminations >= 500) unlockAchievement(state, "player-500-eliminations", record);
      if (record.career.zoneCaptures >= 25) unlockAchievement(state, "player-25-captures", record);
      if (record.career.zoneCaptures >= 50) unlockAchievement(state, "player-50-captures", record);
      if (record.career.zoneCaptures >= 100) unlockAchievement(state, "player-100-captures", record);
      if (record.career.playerOfMatch >= 10) unlockAchievement(state, "ten-potm", record);
      record.awards.forEach((award) => {
        if (["player-of-year", "general-of-year", "all-league-first", "all-league-second", "playoffs-mvp"].includes(award.type)) unlockAchievement(state, award.type, record);
        if (award.type === "season-eliminations") unlockAchievement(state, "season-elimination-leader", record);
        if (award.type === "season-zoneCaptures") unlockAchievement(state, "season-capture-leader", record);
      });
    });
    if (context.bestRecordTeamId === state.userTeamId) unlockAchievement(state, "best-record");
    if (context.conferenceChampionTeamId === state.userTeamId || context.conferenceChampionTeamIds?.includes(state.userTeamId)) unlockAchievement(state, "conference-champion");
    if (context.championTeamId === state.userTeamId) unlockAchievement(state, "league-champion");
    if (state.leagueHistory.filter((season) => season.championTeamId === state.userTeamId).length >= 3) unlockAchievement(state, "dynasty");
    return state.achievements;
  }

  function archiveSeason(state, details = {}) {
    const ranked = state.standings.slice().sort((first, second) => second.wins - first.wins || (second.unitsFor - second.unitsAgainst) - (first.unitsFor - first.unitsAgainst));
    const championTeamId = details.championTeamId ?? ranked[0]?.teamId;
    const runnerUpTeamId = details.runnerUpTeamId ?? ranked[1]?.teamId;
    const champion = state.teams[championTeamId];
    const seasonAwards = details.awards || calculateSeasonAwards(state);
    seasonAwards.forEach((award) => grantAward(state, award));
    (champion?.roster || []).forEach((player) => {
      const line = { id: player.id, name: player.name, role: player.primaryRole };
      const { record, season } = getPlayerRecord(state, champion, line);
      record.career.championships += 1;
      season.totals.championships += 1;
      grantAward(state, { season: state.season, type: "league-champion", title: "League Champion", playerId: record.id, playerName: record.name });
      if (player.primaryRole === "General") { record.generalCareer.championships += 1; season.general.championships += 1; }
    });
    const entry = {
      season: state.season,
      championTeamId,
      championName: champion?.name,
      runnerUpTeamId,
      runnerUpName: state.teams[runnerUpTeamId]?.name,
      awards: seasonAwards,
      standings: state.standings.map((record) => ({ ...record })),
      seasonRecords: recordHolders(state, "season")
    };
    state.leagueHistory.push(entry);
    const bestRecordTeamId = ranked[0]?.teamId;
    evaluateAchievements(state, { championTeamId, runnerUpTeamId, bestRecordTeamId, conferenceChampionTeamId: details.conferenceChampionTeamId });
    return entry;
  }

  function createLeague(teams, userTeamId, options = {}) {
    const season = options.season ?? 1;
    return { teams, userTeamId, seed: options.seed ?? 3000, season, currentWeek: 1, schedule: generateSchedule(teams, season), standings: createStandings(teams), playerRecords: options.playerRecords || {}, leagueHistory: options.leagueHistory || [], achievements: options.achievements || { unlocked: [] }, freeAgents: options.freeAgents || [], transactions: options.transactions || [], playoffs: null, offseason: null, complete: false };
  }

  function swapFreeAgent(state, teamId, releasePlayerId, signPlayerId) {
    if (state.complete || state.playoffs) return { ok: false, error: "Transactions are locked after the regular season." };
    state.transactions ||= [];
    const seasonTransactions = state.transactions.filter((transaction) => transaction.season === state.season && transaction.teamId === teamId);
    if (seasonTransactions.length >= 4) return { ok: false, error: "Season transaction limit reached." };
    const team = state.teams[teamId];
    const releaseIndex = team.roster.findIndex((player) => player.id === releasePlayerId);
    const signIndex = state.freeAgents.findIndex((player) => player.id === signPlayerId);
    if (releaseIndex < 0 || signIndex < 0) return { ok: false, error: "Selected players are no longer available." };
    const released = team.roster[releaseIndex];
    const signed = state.freeAgents[signIndex];
    team.roster.splice(releaseIndex, 1, signed);
    state.freeAgents.splice(signIndex, 1, released);
    const transaction = { season: state.season, week: state.currentWeek, teamId, teamName: team.name, signedId: signed.id, signedName: signed.name, releasedId: released.id, releasedName: released.name };
    state.transactions.push(transaction);
    return { ok: true, transaction };
  }

  function userGameForWeek(state, week = state.currentWeek) {
    return state.schedule[week - 1]?.games.find((game) => game.homeTeamId === state.userTeamId || game.awayTeamId === state.userTeamId) || null;
  }

  function playWeek(state, userResult = null) {
    if (state.complete) return [];
    const week = state.schedule[state.currentWeek - 1];
    week.games.forEach((game) => {
      const includesUser = game.homeTeamId === state.userTeamId || game.awayTeamId === state.userTeamId;
      const result = includesUser && userResult ? normalizeUserResult(state, game, userResult) : simulateGame(state, game);
      recordResult(state, game, result);
    });
    const completedGames = week.games.slice();
    state.currentWeek += 1;
    state.complete = state.currentWeek > state.schedule.length;
    evaluateAchievements(state);
    return completedGames;
  }

  function playUntilWeek(state, targetWeek, userResult = null) {
    const completed = [];
    while (!state.complete && state.currentWeek <= targetWeek) {
      const result = state.currentWeek === targetWeek ? userResult : null;
      completed.push(...playWeek(state, result));
    }
    return completed;
  }

  function playoffGame(state, homeTeamId, awayTeamId, round, conference = null) {
    return { id: `s${state.season}-p${state.playoffs.games.length + state.playoffs.pendingGames.length + 1}`, week: 17 + state.playoffs.roundIndex, homeTeamId, awayTeamId, stage: "playoff", round, conference, status: "upcoming", result: null };
  }

  function startPlayoffs(state) {
    if (!state.complete) throw new Error("Regular season must be complete before playoffs.");
    if (state.playoffs) return state.playoffs;
    const seedsByConference = {};
    ["Americas", "Eurasia-Africa"].forEach((conference) => {
      seedsByConference[conference] = standingsFor(state, conference).slice(0, 6).map((record, index) => ({ teamId: record.teamId, seed: index + 1 }));
    });
    state.playoffs = { complete: false, roundIndex: 0, round: "Wild Card", seedsByConference, games: [], pendingGames: [], conferenceChampions: [], regularSeasonAwards: calculateSeasonAwards(state), awards: [] };
    ["Americas", "Eurasia-Africa"].forEach((conference) => {
      const seeds = seedsByConference[conference];
      state.playoffs.pendingGames.push(playoffGame(state, seeds[2].teamId, seeds[5].teamId, "Wild Card", conference));
      state.playoffs.pendingGames.push(playoffGame(state, seeds[3].teamId, seeds[4].teamId, "Wild Card", conference));
    });
    return state.playoffs;
  }

  function playoffWinner(game) {
    return game.result.winner === "home" ? game.homeTeamId : game.awayTeamId;
  }

  function finalizePlayoffs(state, championTeamId, runnerUpTeamId) {
    const playoffPerformances = new Map();
    state.playoffs.games.forEach((game) => ["home", "away"].forEach((side) => {
      const teamId = game[`${side}TeamId`];
      (game.result.players?.[side] || []).filter((line) => line.role !== "General").forEach((line) => {
        const current = playoffPerformances.get(line.id) || { id: line.id, name: line.name, teamId, ratingTotal: 0, games: 0 };
        current.ratingTotal += line.rating;
        current.games += 1;
        playoffPerformances.set(line.id, current);
      });
    }));
    const rankedPlayers = [...playoffPerformances.values()].map((entry) => ({ ...entry, average: entry.ratingTotal / entry.games })).sort((first, second) => second.average - first.average);
    const bestChampion = rankedPlayers.find((player) => player.teamId === championTeamId);
    const bestFinalLoser = rankedPlayers.find((player) => player.teamId === runnerUpTeamId);
    const mvp = bestFinalLoser && bestChampion && bestFinalLoser.average >= bestChampion.average * 1.1 ? bestFinalLoser : bestChampion || rankedPlayers[0];
    const playoffsMvp = mvp ? { season: state.season, type: "playoffs-mvp", title: "Playoffs MVP", playerId: mvp.id, playerName: mvp.name, teamId: mvp.teamId } : null;
    if (playoffsMvp) grantAward(state, playoffsMvp);
    state.playoffs.awards = playoffsMvp ? [...state.playoffs.regularSeasonAwards, playoffsMvp] : state.playoffs.regularSeasonAwards;
    state.playoffs.championTeamId = championTeamId;
    state.playoffs.runnerUpTeamId = runnerUpTeamId;
    state.playoffs.complete = true;
    state.playoffs.round = "Complete";
    state.playoffs.archive = archiveSeason(state, { championTeamId, runnerUpTeamId, conferenceChampionTeamIds: state.playoffs.conferenceChampions, awards: state.playoffs.awards });
    evaluateAchievements(state, { championTeamId, runnerUpTeamId, conferenceChampionTeamIds: state.playoffs.conferenceChampions, bestRecordTeamId: state.standings.slice().sort((a, b) => b.wins - a.wins)[0].teamId });
    return state.playoffs;
  }

  function playPlayoffRound(state, userResult = null) {
    const playoffs = startPlayoffs(state);
    if (playoffs.complete) return playoffs;
    playoffs.pendingGames.forEach((game) => {
      const includesUser = game.homeTeamId === state.userTeamId || game.awayTeamId === state.userTeamId;
      const result = includesUser && userResult ? normalizeUserResult(state, game, userResult) : simulateGame(state, game);
      recordResult(state, game, result);
      playoffs.games.push(game);
    });
    const completedRound = playoffs.pendingGames.slice();
    playoffs.pendingGames = [];

    if (playoffs.round === "Wild Card") {
      ["Americas", "Eurasia-Africa"].forEach((conference) => {
        const seeds = playoffs.seedsByConference[conference];
        const seedOf = (teamId) => seeds.find((entry) => entry.teamId === teamId).seed;
        const winners = completedRound.filter((game) => game.conference === conference).map(playoffWinner).sort((first, second) => seedOf(second) - seedOf(first));
        playoffs.pendingGames.push(playoffGame(state, seeds[0].teamId, winners[0], "Conference Semifinal", conference));
        playoffs.pendingGames.push(playoffGame(state, seeds[1].teamId, winners[1], "Conference Semifinal", conference));
      });
      playoffs.round = "Conference Semifinal";
    } else if (playoffs.round === "Conference Semifinal") {
      ["Americas", "Eurasia-Africa"].forEach((conference) => {
        const seeds = playoffs.seedsByConference[conference];
        const seedOf = (teamId) => seeds.find((entry) => entry.teamId === teamId).seed;
        const winners = completedRound.filter((game) => game.conference === conference).map(playoffWinner).sort((first, second) => seedOf(first) - seedOf(second));
        playoffs.pendingGames.push(playoffGame(state, winners[0], winners[1], "Conference Championship", conference));
      });
      playoffs.round = "Conference Championship";
    } else if (playoffs.round === "Conference Championship") {
      playoffs.conferenceChampions = completedRound.map(playoffWinner);
      const [first, second] = playoffs.conferenceChampions;
      const firstRecord = state.standings[first];
      const secondRecord = state.standings[second];
      playoffs.pendingGames.push(playoffGame(state, firstRecord.wins >= secondRecord.wins ? first : second, firstRecord.wins >= secondRecord.wins ? second : first, "League Championship"));
      playoffs.round = "League Championship";
    } else {
      const final = completedRound[0];
      return finalizePlayoffs(state, playoffWinner(final), playoffWinner(final) === final.homeTeamId ? final.awayTeamId : final.homeTeamId);
    }
    playoffs.roundIndex += 1;
    return playoffs;
  }

  function playoffGameForUser(state) {
    return state.playoffs?.pendingGames.find((game) => game.homeTeamId === state.userTeamId || game.awayTeamId === state.userTeamId) || null;
  }

  function runPlayoffs(state) {
    startPlayoffs(state);
    while (!state.playoffs.complete) playPlayoffRound(state);
    return state.playoffs;
  }

  function applyOffseasonForm(state) {
    const changes = [];
    state.teams.forEach((team) => (team.roster || []).forEach((player) => {
      const seasonTotals = state.playerRecords[player.id]?.seasons[state.season]?.totals;
      const previous = player.form || 0;
      const expectation = 5.75 + (player.overall + previous - 65) / 30 * 2.75;
      const performance = seasonTotals?.appearances ? seasonTotals.ratingTotal / seasonTotals.appearances : expectation;
      const idHash = [...player.id].reduce((hash, character) => Math.imul(hash ^ character.charCodeAt(0), 16777619), 2166136261) >>> 0;
      const random = createRandom(state.seed + state.season * 97 + idHash);
      const noise = (random() + random() + random() - 1.5) * 3;
      const change = Math.max(-4, Math.min(4, Math.round((performance - expectation) * 1.6 + noise)));
      player.form = Math.max(-8, Math.min(8, previous + change));
      changes.push({ playerId: player.id, playerName: player.name, previous, current: player.form, change: player.form - previous });
    }));
    return changes;
  }

  const renewalTargets = { General: 1, Cannon: 3, Runner: 3, Bruiser: 3, Visual: 1, Musical: 1 };

  function recommendedProtections(team) {
    const candidates = team.roster.slice().sort((first, second) => (second.overall + (second.form || 0)) - (first.overall + (first.form || 0)));
    const protectedPlayers = [];
    candidates.forEach((player) => {
      if (protectedPlayers.length >= 6) return;
      const roleCount = protectedPlayers.filter((protectedPlayer) => protectedPlayer.primaryRole === player.primaryRole).length;
      if (roleCount < renewalTargets[player.primaryRole]) protectedPlayers.push(player);
    });
    return protectedPlayers;
  }

  function validProtections(team, playerIds) {
    if (playerIds.length !== 6 || new Set(playerIds).size !== 6 || playerIds.some((id) => !team.roster.some((player) => player.id === id))) return false;
    const selected = team.roster.filter((player) => playerIds.includes(player.id));
    return Object.entries(renewalTargets).every(([role, target]) => selected.filter((player) => player.primaryRole === role).length <= target);
  }

  function startOffseason(state) {
    if (!state.playoffs?.complete) throw new Error("Playoffs must be complete before roster renewal.");
    if (state.offseason) return state.offseason;
    const formChanges = applyOffseasonForm(state);
    const protections = {};
    state.teams.forEach((team) => {
      if (team.id !== state.userTeamId) protections[team.id] = recommendedProtections(team).map((player) => player.id);
    });
    state.offseason = { stage: "protection", formChanges, protections, pool: [], availableIds: [], order: [], pickIndex: 0, picks: [] };
    return state.offseason;
  }

  function initializeRenewal(state) {
    const champion = state.playoffs.championTeamId;
    const runnerUp = state.playoffs.runnerUpTeamId;
    const standingsOrder = state.standings.slice().sort((first, second) => second.wins - first.wins || (second.unitsFor - second.unitsAgainst) - (first.unitsFor - first.unitsAgainst)).map((record) => record.teamId).filter((teamId) => teamId !== champion && teamId !== runnerUp);
    const draftOrder = [champion, runnerUp, ...standingsOrder];
    const released = [];
    state.teams.forEach((team) => {
      const protectedIds = new Set(state.offseason.protections[team.id]);
      team.roster.filter((player) => !protectedIds.has(player.id)).forEach((player) => released.push(player));
      team.roster = team.roster.filter((player) => protectedIds.has(player.id));
    });
    const poolIds = new Set();
    state.offseason.pool = [...state.freeAgents, ...released].filter((player) => {
      if (poolIds.has(player.id)) return false;
      poolIds.add(player.id);
      return true;
    });
    state.freeAgents = [];
    state.offseason.availableIds = state.offseason.pool.map((player) => player.id);
    for (let round = 0; round < 6; round += 1) {
      const order = round % 2 ? draftOrder.slice().reverse() : draftOrder;
      order.forEach((teamId) => state.offseason.order.push({ round: round + 1, teamId }));
    }
    state.offseason.stage = "renewal";
    return state.offseason;
  }

  function submitProtections(state, playerIds) {
    const offseason = startOffseason(state);
    const team = state.teams[state.userTeamId];
    if (!validProtections(team, playerIds)) return false;
    offseason.protections[state.userTeamId] = playerIds.slice();
    initializeRenewal(state);
    return true;
  }

  function renewalCurrentPick(state) {
    return state.offseason?.order[state.offseason.pickIndex] || null;
  }

  function renewalAvailable(state) {
    const ids = new Set(state.offseason?.availableIds || []);
    return (state.offseason?.pool || []).filter((player) => ids.has(player.id));
  }

  function renewalChoice(state, team) {
    const counts = team.roster.reduce((result, player) => { result[player.primaryRole] = (result[player.primaryRole] || 0) + 1; return result; }, {});
    const neededRoles = Object.keys(renewalTargets).filter((role) => (counts[role] || 0) < renewalTargets[role]);
    return renewalAvailable(state).filter((player) => neededRoles.includes(player.primaryRole)).sort((first, second) => (second.overall + (second.form || 0)) - (first.overall + (first.form || 0)))[0];
  }

  function commitRenewalPick(state, playerId) {
    const pick = renewalCurrentPick(state);
    if (!pick || !state.offseason.availableIds.includes(playerId)) return false;
    const player = state.offseason.pool.find((candidate) => candidate.id === playerId);
    const team = state.teams[pick.teamId];
    const counts = team.roster.reduce((result, member) => { result[member.primaryRole] = (result[member.primaryRole] || 0) + 1; return result; }, {});
    if ((counts[player.primaryRole] || 0) >= renewalTargets[player.primaryRole]) return false;
    team.roster.push(player);
    state.offseason.availableIds = state.offseason.availableIds.filter((id) => id !== playerId);
    state.offseason.picks.push({ overall: state.offseason.pickIndex + 1, round: pick.round, teamId: pick.teamId, playerId });
    state.offseason.pickIndex += 1;
    if (state.offseason.pickIndex >= state.offseason.order.length) {
      state.offseason.stage = "complete";
      state.freeAgents = renewalAvailable(state);
    }
    return true;
  }

  function advanceRenewalCpu(state) {
    while (state.offseason?.stage === "renewal" && renewalCurrentPick(state)?.teamId !== state.userTeamId) {
      const team = state.teams[renewalCurrentPick(state).teamId];
      const player = renewalChoice(state, team);
      if (!player) throw new Error(`No renewal candidate available for ${team.name}.`);
      commitRenewalPick(state, player.id);
    }
    return state.offseason;
  }

  function renewalUserPick(state, playerId) {
    if (state.offseason?.stage !== "renewal" || renewalCurrentPick(state)?.teamId !== state.userTeamId) return false;
    return commitRenewalPick(state, playerId);
  }

  function renewalCpuStep(state) {
    const pick = renewalCurrentPick(state);
    if (state.offseason?.stage !== "renewal" || !pick || pick.teamId === state.userTeamId) return false;
    const team = state.teams[pick.teamId];
    const player = renewalChoice(state, team);
    if (!player) throw new Error(`No renewal candidate available for ${team.name}.`);
    return commitRenewalPick(state, player.id);
  }

  function renewalAutoPick(state) {
    const pick = renewalCurrentPick(state);
    if (state.offseason?.stage !== "renewal" || !pick) return false;
    const player = renewalChoice(state, state.teams[pick.teamId]);
    return player ? commitRenewalPick(state, player.id) : false;
  }

  function simulateRenewal(state, { stopAtUser = true } = {}) {
    while (state.offseason?.stage === "renewal") {
      if (renewalCurrentPick(state).teamId === state.userTeamId) {
        if (stopAtUser) break;
        renewalAutoPick(state);
      } else renewalCpuStep(state);
    }
    return state.offseason;
  }

  function runRenewalDraft(state) {
    const offseason = startOffseason(state);
    if (offseason.stage === "protection") submitProtections(state, recommendedProtections(state.teams[state.userTeamId]).map((player) => player.id));
    while (state.offseason.stage === "renewal") {
      const player = renewalChoice(state, state.teams[renewalCurrentPick(state).teamId]);
      commitRenewalPick(state, player.id);
      advanceRenewalCpu(state);
    }
    return { protections: state.offseason.protections, picks: state.offseason.picks, freeAgents: state.freeAgents.length };
  }

  function beginNextSeason(state) {
    if (state.offseason?.stage !== "complete") throw new Error("Renewal draft must be complete before the next season.");
    state.season += 1;
    state.seed += 1;
    state.currentWeek = 1;
    [...state.teams.flatMap((team) => team.roster || []), ...(state.freeAgents || [])].forEach((player) => { player.fatigue = 0; });
    state.schedule = generateSchedule(state.teams, state.season);
    state.standings = createStandings(state.teams);
    state.complete = false;
    state.playoffs = null;
    const summary = { season: state.season, formChanges: state.offseason.formChanges, renewal: { protections: state.offseason.protections, picks: state.offseason.picks, freeAgents: state.freeAgents.length } };
    state.offseason = null;
    return summary;
  }

  function advanceSeason(state) {
    const renewal = runRenewalDraft(state);
    const result = beginNextSeason(state);
    return { ...result, renewal };
  }

  return { createLeague, generateSchedule, simulateGame, playWeek, playUntilWeek, userGameForWeek, standingsFor, playerLeaderboard, generalLeaderboard, recordHolders, calculateSeasonAwards, archiveSeason, evaluateAchievements, startPlayoffs, playPlayoffRound, playoffGameForUser, runPlayoffs, ensureGameRecords, startOffseason, recommendedProtections, validProtections, submitProtections, renewalCurrentPick, renewalAvailable, renewalUserPick, renewalCpuStep, renewalAutoPick, simulateRenewal, runRenewalDraft, beginNextSeason, advanceSeason, swapFreeAgent, ACHIEVEMENTS };
});