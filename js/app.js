/* 82-0 — NBA draft game logic */

const LINEUPS = {
  traditional: ["PG", "SG", "SF", "PF", "C"],
  smallball: ["PG", "SG", "SG", "SF", "PF"],
  twintowers: ["PG", "SG", "SF", "C", "C"]
};

const POS_INDEX = { PG: 0, SG: 1, SF: 2, PF: 3, C: 4 };

const TEAM_COLORS = {
  ATL: "#E03A3E", BOS: "#007A33", BKN: "#000000", NJN: "#000000",
  CHA: "#1D1160", CHI: "#CE1141", CLE: "#860038", DAL: "#00538C",
  DEN: "#0E2240", DET: "#C8102E", GSW: "#1D428A", HOU: "#CE1141",
  IND: "#002D62", LAC: "#C8102E", LAL: "#552583", MEM: "#5D76A9",
  MIA: "#98002E", MIL: "#00471B", MIN: "#0C2340", NOP: "#0C2340",
  NYK: "#006BB6", OKC: "#007AC1", SEA: "#00653A", ORL: "#0077C0",
  PHI: "#006BB6", PHX: "#1D1160", POR: "#E03A3E", SAC: "#5A2D81",
  SAS: "#C4CED4", TOR: "#CE1141", UTA: "#002B5C", WAS: "#002B5C"
};

const RESPIN_PER_ROUND = 1;
const AUTO_RESPIN_DELAY = 1400;

const state = {
  mode: "classic",
  lineup: "traditional",
  slots: [],
  round: 0,
  currentTeam: null,
  usedTeams: new Set(),
  respinsLeft: RESPIN_PER_ROUND,
  spinInterval: null
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function showScreen(id) {
  $$(".screen").forEach((s) => s.classList.remove("active"));
  $("#" + id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
  updateSteps(id);
}

function updateSteps(id) {
  const map = { setup: ["mode", "lineup"], draft: ["draft"], result: ["result"] };
  $$(".step").forEach((s) => s.classList.remove("on"));
  (map[id] || []).forEach((k) => {
    const el = document.querySelector(`.step[data-step="${k}"]`);
    if (el) el.classList.add("on");
  });
}

function toast(msg) {
  let t = $(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2200);
}

function announceSpin(text) {
  const live = $("#spin-live");
  if (live) live.textContent = text;
}

function teamColor(abbr) {
  return TEAM_COLORS[abbr] || "#4d8bff";
}

function applyTeamBadge(badgeEl, team) {
  if (!badgeEl || !team) return;
  badgeEl.hidden = false;
  badgeEl.textContent = team.abbr;
  badgeEl.style.setProperty("--team-color", teamColor(team.abbr));
  badgeEl.style.background = teamColor(team.abbr);
}

function clearTeamBadge(badgeEl) {
  if (!badgeEl) return;
  badgeEl.hidden = true;
  badgeEl.textContent = "";
}

function applyReelTeam(team) {
  const reel = $("#reel");
  if (team) {
    reel.classList.add("has-team");
    reel.style.setProperty("--team-color", teamColor(team.abbr));
    applyTeamBadge($("#reel-badge"), team);
    $("#reel-team").textContent = team.team;
    $("#reel-year").textContent = team.year;
  } else {
    reel.classList.remove("has-team");
    reel.style.removeProperty("--team-color");
    clearTeamBadge($("#reel-badge"));
    $("#reel-team").textContent = "???";
    $("#reel-year").textContent = "····";
  }
}

function slotLabel(index, pos) {
  const dupes = state.slots.filter((s) => s.pos === pos).length;
  if (dupes <= 1) return pos;
  const num = state.slots.slice(0, index + 1).filter((s) => s.pos === pos).length;
  return `${pos} (${num})`;
}

function positionFit(player, slotPos) {
  const target = POS_INDEX[slotPos];
  let best = Infinity;
  player.pos.forEach((p) => {
    best = Math.min(best, Math.abs(POS_INDEX[p] - target));
  });
  if (best === 0) return 1.0;
  if (best === 1) return 0.9;
  if (best === 2) return 0.76;
  if (best === 3) return 0.6;
  return 0.45;
}

function fitLabel(fit) {
  if (fit >= 1) return "Perfekt fit";
  return `${Math.round(fit * 100)}% fit`;
}

function playerStatsHtml(p, compact) {
  const stats = compact
    ? `INS ${p.ins} · OUT ${p.out} · PLY ${p.ply} · REB ${p.reb} · DEF ${p.def} · ATH ${p.ath}`
    : `<span>INS <b>${p.ins}</b></span><span>OUT <b>${p.out}</b></span><span>PLY <b>${p.ply}</b></span><span>REB <b>${p.reb}</b></span><span>DEF <b>${p.def}</b></span><span>ATH <b>${p.ath}</b></span>`;
  return compact
    ? `<div class="ff-stats">${stats} · <b>OVR ${p.ovr}</b></div>`
    : `<div class="player-stats">${stats}</div>`;
}

function updateRespinUI() {
  const btn = $("#respin-btn");
  const count = $("#respin-count");
  if (!btn || !count) return;
  if (state.respinsLeft > 0) {
    btn.disabled = false;
    count.textContent = `(${state.respinsLeft} igjen)`;
  } else {
    btn.disabled = true;
    count.textContent = "(brukt opp)";
  }
}

function initSetup() {
  $$("#mode-cards .choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$("#mode-cards .choice").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.mode = btn.dataset.mode;
    });
  });
  $$("#lineup-cards .choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$("#lineup-cards .choice").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.lineup = btn.dataset.lineup;
    });
  });
  $("#start-btn").addEventListener("click", startDraft);
}

function startDraft() {
  clearSpinInterval();
  state.slots = LINEUPS[state.lineup].map((pos) => ({ pos, player: null, fit: 0 }));
  state.round = 0;
  state.currentTeam = null;
  state.usedTeams = new Set();
  state.respinsLeft = RESPIN_PER_ROUND;

  $("#mode-pill").textContent = state.mode === "classic" ? "Classic" : "Expert";
  renderCourt();
  resetSpinner();
  showScreen("draft");
  $("#finish-btn").disabled = true;
  updateRoundLabel();
}

function updateRoundLabel() {
  $("#round-label").textContent = `Runde ${Math.min(state.round + 1, 5)} / 5`;
}

function clearSpinInterval() {
  if (state.spinInterval) {
    clearInterval(state.spinInterval);
    state.spinInterval = null;
  }
}

function resetSpinner() {
  clearSpinInterval();
  $("#spinner").hidden = false;
  $("#pool").hidden = true;
  applyReelTeam(null);
  $("#spin-btn").disabled = false;
  state.respinsLeft = RESPIN_PER_ROUND;
  updateRespinUI();
}

function randomTeam() {
  const fresh = TEAMS.filter((t) => !state.usedTeams.has(t.team + t.year));
  const pool = fresh.length ? fresh : TEAMS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function spin() {
  if (state.spinInterval) return;

  const reel = $("#reel");
  const btn = $("#spin-btn");
  btn.disabled = true;
  reel.classList.add("spinning");

  let ticks = 0;
  const total = 16 + Math.floor(Math.random() * 8);
  state.spinInterval = setInterval(() => {
    const t = TEAMS[Math.floor(Math.random() * TEAMS.length)];
    applyReelTeam(t);
    ticks++;
    if (ticks >= total) {
      clearSpinInterval();
      reel.classList.remove("spinning");
      const team = randomTeam();
      state.currentTeam = team;
      applyReelTeam(team);
      announceSpin(`Trukket ${team.team} ${team.year}`);
      showPool(team);
    }
  }, 90);
}

function openSlotsFor(player) {
  return state.slots
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => !s.player && positionFit(player, s.pos) >= 0.45);
}

function showPool(team, isAutoRespin) {
  $("#spin-btn").disabled = true;
  $("#pool").hidden = false;
  applyTeamBadge($("#pool-badge"), team);
  $("#pool-team").textContent = `${team.team} · ${team.year}`;
  $("#spin-hint").textContent = "Velg én spiller fra denne troppen.";

  const list = $("#pool-list");
  list.innerHTML = "";

  team.players.forEach((player) => {
    const openSlots = openSlotsFor(player);
    const canDraft = openSlots.length > 0;

    const btn = document.createElement("button");
    btn.className = "player";
    btn.disabled = !canDraft;

    const posTags = player.pos.map((p) => `<span class="pos-tag">${p}</span>`).join("");
    const showStats = state.mode === "classic";

    const statsHtml = showStats
      ? playerStatsHtml(player, false)
      : `<div class="player-stats"><span>Stats skjult i Expert-modus</span></div>`;

    const ovrHtml = showStats
      ? `<span class="ovr-badge">${player.ovr}</span>`
      : `<span class="ovr-badge hidden-rating">?</span>`;

    btn.innerHTML = `
      <div class="player-main">
        <span class="player-name">${player.name}</span>
        <span class="player-pos">${posTags}</span>
        ${statsHtml}
      </div>
      ${ovrHtml}`;

    if (canDraft) {
      btn.addEventListener("click", () => draftPlayer(player, openSlots));
    } else {
      btn.title = "Ingen ledig posisjon passer denne spilleren";
    }
    list.appendChild(btn);
  });

  const anyDraftable = team.players.some((p) => openSlotsFor(p).length > 0);
  if (!anyDraftable) {
    $("#spin-hint").textContent = "Ingen i denne troppen passer — spiller automatisk på nytt…";
    toast("Ingen passende spillere — spiller automatisk på nytt");
    setTimeout(() => handleDeadSpin(isAutoRespin), AUTO_RESPIN_DELAY);
  }
}

function handleDeadSpin(wasAuto) {
  if (state.slots.every((s) => s.player)) return;
  doRespin(true);
}

function doRespin(isFree) {
  if (!isFree && state.respinsLeft <= 0) {
    toast("Du har brukt opp respin denne runden");
    return;
  }
  if (!isFree) {
    state.respinsLeft--;
    updateRespinUI();
  }
  state.currentTeam = null;
  $("#pool").hidden = true;
  clearTeamBadge($("#pool-badge"));
  spin();
}

function pickSlotModal(player, tied) {
  return new Promise((resolve) => {
    const modal = $("#slot-modal");
    const choices = $("#slot-modal-choices");
    $("#slot-modal-title").textContent = "Velg posisjon";
    $("#slot-modal-desc").textContent = `${player.name} passer flere ledige plasser. Hvor vil du sette spilleren?`;
    choices.innerHTML = "";

    const close = (result) => {
      modal.hidden = true;
      resolve(result);
    };

    tied.forEach(({ s, i }) => {
      const fit = positionFit(player, s.pos);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "modal-choice";
      btn.innerHTML = `
        <span class="modal-choice-pos">${slotLabel(i, s.pos)}</span>
        <span class="modal-choice-fit">${fitLabel(fit)}</span>`;
      btn.addEventListener("click", () => close({ s, i }));
      choices.appendChild(btn);
    });

    $("#slot-modal-cancel").onclick = () => close(null);
    $("#slot-modal-backdrop").onclick = () => close(null);
    modal.hidden = false;
  });
}

async function draftPlayer(player, openSlots) {
  let target;
  if (openSlots.length === 1) {
    target = openSlots[0];
  } else {
    target = openSlots.reduce((best, cur) => {
      const f = positionFit(player, cur.s.pos);
      const bf = positionFit(player, best.s.pos);
      return f > bf ? cur : best;
    });
    const topFit = positionFit(player, target.s.pos);
    const tied = openSlots.filter(({ s, i }) => positionFit(player, s.pos) === topFit);
    const uniqueIndices = new Set(tied.map((t) => t.i));
    if (uniqueIndices.size > 1 || tied.length > 1) {
      const picked = await pickSlotModal(player, tied);
      if (picked) target = picked;
    }
  }

  const slot = state.slots[target.i];
  slot.player = {
    ...player,
    fromTeam: `${state.currentTeam.team} ${state.currentTeam.year}`,
    fromAbbr: state.currentTeam.abbr
  };
  slot.fit = positionFit(player, slot.pos);

  state.usedTeams.add(state.currentTeam.team + state.currentTeam.year);
  state.round++;
  renderCourt();
  updateRoundLabel();

  if (state.slots.every((s) => s.player)) {
    clearSpinInterval();
    $("#spinner").hidden = true;
    $("#pool").hidden = true;
    $("#finish-btn").disabled = false;
    toast("Femmeren er komplett! Se resultatet.");
  } else {
    resetSpinner();
  }
}

function renderCourt() {
  const court = $("#court");
  court.innerHTML = "";
  const nextEmpty = state.slots.findIndex((s) => !s.player);

  state.slots.forEach((slot, i) => {
    const div = document.createElement("div");
    div.className = "slot" + (slot.player ? " filled" : "") + (i === nextEmpty ? " target" : "");
    const label = slotLabel(i, slot.pos);

    let body;
    if (slot.player) {
      const fitPct = Math.round(slot.fit * 100);
      const fitClass = slot.fit >= 1 ? "fit-ok" : "fit-off";
      const fitText = slot.fit >= 1 ? "passer" : `${fitPct}% fit`;
      const showOvr = state.mode === "classic";
      body = `
        <div class="slot-body">
          <div class="slot-name">${slot.player.name}
            <span class="slot-fit ${fitClass}">${fitText}</span>
          </div>
          <div class="slot-meta">${slot.player.fromTeam}${showOvr ? " · OVR " + slot.player.ovr : ""}</div>
        </div>`;
    } else {
      body = `<div class="slot-body"><span class="slot-empty">Ledig — draft en ${label}</span></div>`;
    }

    div.innerHTML = `<div class="slot-pos" title="${label}">${slot.pos}</div>${body}`;
    court.appendChild(div);
  });
}

function projectRecord() {
  let weighted = 0;
  state.slots.forEach((s) => {
    weighted += s.player.ovr * s.fit;
  });
  const teamRating = weighted / state.slots.length;

  let wins = 82 / (1 + Math.exp(-(teamRating - 78) / 5));
  wins = Math.round(wins);

  const allElite = state.slots.every((s) => s.player.ovr >= 96 && s.fit >= 0.999);
  if (wins >= 82 && !allElite) wins = 81;
  wins = Math.max(8, Math.min(82, wins));

  return { wins, losses: 82 - wins, teamRating };
}

function tierFor(wins) {
  if (wins >= 82) return { label: "82-0 · UDØDELIG", perfect: true };
  if (wins >= 73) return { label: "Tidenes lag" };
  if (wins >= 67) return { label: "Klar gullfavoritt" };
  if (wins >= 60) return { label: "Mesterskapsutfordrer" };
  if (wins >= 50) return { label: "Solid sluttspillag" };
  if (wins >= 41) return { label: "Play-in-håp" };
  if (wins >= 30) return { label: "Lottery bound" };
  return { label: "Tankekommandør" };
}

function showResult() {
  const { wins, losses, teamRating } = projectRecord();
  const tier = tierFor(wins);
  const isExpert = state.mode === "expert";

  $("#record").textContent = `${wins} – ${losses}`;
  $("#record-sub").textContent = `${wins} seire · ${losses} tap over 82 kamper · ${wins * 2} poeng`;

  const tierEl = $("#tier");
  tierEl.textContent = tier.label;
  tierEl.classList.toggle("perfect", !!tier.perfect);

  $("#team-rating").textContent = teamRating.toFixed(1);

  const players = state.slots.map((s) => ({ ...s.player, fit: s.fit, slot: s.pos }));
  const mvp = players.reduce((a, b) => (b.ovr * b.fit > a.ovr * a.fit ? b : a));
  $("#mvp").textContent = mvp.name;

  const scorer = players.reduce((a, b) => (b.ins + b.out > a.ins + a.out ? b : a));
  $("#scorer").textContent = scorer.name;

  const banner = $("#expert-reveal-banner");
  banner.hidden = !isExpert;

  const ff = $("#final-five");
  ff.innerHTML = "";
  state.slots.forEach((s, i) => {
    const row = document.createElement("div");
    row.className = "ff-row" + (isExpert ? " ff-reveal" : "");
    const eff = Math.round(s.player.ovr * s.fit);
    const label = slotLabel(i, s.pos);

    if (isExpert) {
      row.innerHTML = `
        <span class="ff-pos">${label}</span>
        <span>
          <span class="ff-name">${s.player.name}</span>
          <span class="ff-meta">${s.player.fromTeam}</span>
          ${playerStatsHtml(s.player, true)}
        </span>
        <span class="ff-ovr">${eff}<small>eff. rating</small></span>`;
    } else {
      row.innerHTML = `
        <span class="ff-pos">${label}</span>
        <span><span class="ff-name">${s.player.name}</span><br><span class="ff-meta">${s.player.fromTeam}</span></span>
        <span class="ff-ovr">${eff}</span>`;
    }
    ff.appendChild(row);
  });

  state._lastResult = { wins, losses, tier: tier.label, players: state.slots };
  showScreen("result");
}

function shareResult() {
  const r = state._lastResult;
  if (!r) return;
  const url = window.location.href.split("?")[0];
  const lines = r.players.map((s, i) => `${slotLabel(i, s.pos)}: ${s.player.name}`).join("\n");
  const text = `Min 82-0 NBA-femmer gikk ${r.wins}-${r.losses} (${r.tier})!\n\n${lines}\n\nBygg din egen: ${url}`;

  if (navigator.share) {
    navigator.share({ title: "82-0 · NBA", text, url }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => toast("Resultat kopiert til utklippstavlen!"));
  } else {
    toast("Deling støttes ikke i denne nettleseren.");
  }
}

function setOgUrl() {
  const url = window.location.href.split("?")[0];
  let tag = document.querySelector('meta[property="og:url"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", "og:url");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", url);
}

function init() {
  setOgUrl();
  initSetup();
  $("#spin-btn").addEventListener("click", spin);
  $("#respin-btn").addEventListener("click", () => doRespin(false));
  $("#finish-btn").addEventListener("click", showResult);
  $("#share-btn").addEventListener("click", shareResult);
  $("#again-btn").addEventListener("click", () => showScreen("setup"));
  showScreen("setup");
}

document.addEventListener("DOMContentLoaded", init);
