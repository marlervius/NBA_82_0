/* 82-0 — NBA draft game logic */

const LINEUPS = {
  traditional: ["PG", "SG", "SF", "PF", "C"],
  smallball: ["PG", "SG", "SG", "SF", "PF"],
  twintowers: ["PG", "SG", "SF", "C", "C"]
};

// Position adjacency on the PG-SG-SF-PF-C line, used for "fit" penalties.
const POS_INDEX = { PG: 0, SG: 1, SF: 2, PF: 3, C: 4 };

const state = {
  mode: "classic",
  lineup: "traditional",
  slots: [],          // [{ pos, player, fit }]
  round: 0,
  currentTeam: null,  // currently spun team
  usedTeams: new Set()
};

/* ---------------- helpers ---------------- */
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

/* ---------------- position fit ---------------- */
// Returns 1.0 for a perfect fit, scaling down with distance from nearest natural position.
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

/* ---------------- setup screen ---------------- */
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

/* ---------------- draft ---------------- */
function startDraft() {
  state.slots = LINEUPS[state.lineup].map((pos) => ({ pos, player: null, fit: 0 }));
  state.round = 0;
  state.currentTeam = null;
  state.usedTeams = new Set();

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

function resetSpinner() {
  $("#spinner").hidden = false;
  $("#pool").hidden = true;
  $("#reel-team").textContent = "???";
  $("#reel-year").textContent = "····";
  $("#spin-btn").disabled = false;
}

function randomTeam() {
  // Prefer teams not yet used this game for variety; fall back to any.
  const fresh = TEAMS.filter((t) => !state.usedTeams.has(t.team + t.year));
  const pool = fresh.length ? fresh : TEAMS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function spin() {
  const reel = $(".reel");
  const btn = $("#spin-btn");
  btn.disabled = true;
  reel.classList.add("spinning");

  let ticks = 0;
  const total = 16 + Math.floor(Math.random() * 8);
  const interval = setInterval(() => {
    const t = TEAMS[Math.floor(Math.random() * TEAMS.length)];
    $("#reel-team").textContent = t.team;
    $("#reel-year").textContent = t.year;
    ticks++;
    if (ticks >= total) {
      clearInterval(interval);
      reel.classList.remove("spinning");
      const team = randomTeam();
      state.currentTeam = team;
      $("#reel-team").textContent = team.team;
      $("#reel-year").textContent = team.year;
      showPool(team);
    }
  }, 90);
}

function openSlotsFor(player) {
  // A slot is selectable if it's empty and the player can plausibly play there.
  return state.slots
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => !s.player && positionFit(player, s.pos) >= 0.45);
}

function showPool(team) {
  $("#spin-btn").disabled = true;
  $("#pool").hidden = false;
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
      ? `<div class="player-stats">
           <span>INS <b>${player.ins}</b></span>
           <span>OUT <b>${player.out}</b></span>
           <span>PLY <b>${player.ply}</b></span>
           <span>REB <b>${player.reb}</b></span>
           <span>DEF <b>${player.def}</b></span>
         </div>`
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
    $("#spin-hint").textContent = "Ingen i denne troppen passer dine ledige posisjoner — spinn på nytt.";
  }
}

function draftPlayer(player, openSlots) {
  let target;
  if (openSlots.length === 1) {
    target = openSlots[0];
  } else {
    // Choose the open slot with the best fit; ties resolve to the first.
    target = openSlots.reduce((best, cur) => {
      const f = positionFit(player, cur.s.pos);
      const bf = positionFit(player, best.s.pos);
      return f > bf ? cur : best;
    });
    // If multiple slots share top fit, let the user pick.
    const topFit = positionFit(player, target.s.pos);
    const tied = openSlots.filter(({ s }) => positionFit(player, s.pos) === topFit);
    if (tied.length > 1) {
      target = pickSlotPrompt(player, tied) || target;
    }
  }

  const slot = state.slots[target.i];
  slot.player = { ...player, fromTeam: `${state.currentTeam.team} ${state.currentTeam.year}` };
  slot.fit = positionFit(player, slot.pos);

  state.usedTeams.add(state.currentTeam.team + state.currentTeam.year);
  state.round++;
  renderCourt();
  updateRoundLabel();

  if (state.slots.every((s) => s.player)) {
    $("#spinner").hidden = true;
    $("#pool").hidden = true;
    $("#finish-btn").disabled = false;
    toast("Femmeren er komplett! Se resultatet.");
  } else {
    resetSpinner();
  }
}

// Simple synchronous picker when a player fits several open slots equally.
function pickSlotPrompt(player, tied) {
  const labels = tied.map(({ s }) => s.pos);
  const choice = window.prompt(
    `${player.name} passer flere posisjoner likt: ${labels.join(", ")}.\nSkriv posisjonen du vil bruke:`,
    labels[0]
  );
  if (!choice) return null;
  const found = tied.find(({ s }) => s.pos.toUpperCase() === choice.trim().toUpperCase());
  return found || null;
}

function renderCourt() {
  const court = $("#court");
  court.innerHTML = "";
  const nextEmpty = state.slots.findIndex((s) => !s.player);

  state.slots.forEach((slot, i) => {
    const div = document.createElement("div");
    div.className = "slot" + (slot.player ? " filled" : "") + (i === nextEmpty ? " target" : "");

    let body;
    if (slot.player) {
      const fitPct = Math.round(slot.fit * 100);
      const fitClass = slot.fit >= 1 ? "fit-ok" : "fit-off";
      const fitLabel = slot.fit >= 1 ? "passer" : `${fitPct}% fit`;
      const showOvr = state.mode === "classic";
      body = `
        <div class="slot-body">
          <div class="slot-name">${slot.player.name}
            <span class="slot-fit ${fitClass}">${fitLabel}</span>
          </div>
          <div class="slot-meta">${slot.player.fromTeam}${showOvr ? " · OVR " + slot.player.ovr : ""}</div>
        </div>`;
    } else {
      body = `<div class="slot-body"><span class="slot-empty">Ledig — draft en ${slot.pos}</span></div>`;
    }

    div.innerHTML = `<div class="slot-pos">${slot.pos}</div>${body}`;
    court.appendChild(div);
  });
}

/* ---------------- projection ---------------- */
function projectRecord() {
  // Weighted team rating: each player's OVR scaled by how well they fit their slot.
  let weighted = 0;
  state.slots.forEach((s) => {
    weighted += s.player.ovr * s.fit;
  });
  const teamRating = weighted / state.slots.length;

  // Smooth logistic curve mapping rating -> wins out of 82.
  // ~78 rating ≈ .500 team; 99 across the board approaches 82-0.
  let wins = 82 / (1 + Math.exp(-(teamRating - 78) / 5));
  wins = Math.round(wins);

  // Reserve a literal 82-0 for a genuinely elite, perfectly-fit roster.
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

  $("#record").textContent = `${wins} – ${losses}`;
  $("#record-sub").textContent = `${wins} seire · ${losses} tap over 82 kamper · ${wins * 2} poeng`;

  const tierEl = $("#tier");
  tierEl.textContent = tier.label;
  tierEl.classList.toggle("perfect", !!tier.perfect);

  $("#team-rating").textContent = teamRating.toFixed(1);

  // MVP = highest effective rating (ovr * fit)
  const players = state.slots.map((s) => ({ ...s.player, fit: s.fit, slot: s.pos }));
  const mvp = players.reduce((a, b) => (b.ovr * b.fit > a.ovr * a.fit ? b : a));
  $("#mvp").textContent = mvp.name;

  // Top scorer = best combined inside + outside scoring
  const scorer = players.reduce((a, b) => (b.ins + b.out > a.ins + a.out ? b : a));
  $("#scorer").textContent = scorer.name;

  const ff = $("#final-five");
  ff.innerHTML = "";
  state.slots.forEach((s) => {
    const row = document.createElement("div");
    row.className = "ff-row";
    row.innerHTML = `
      <span class="ff-pos">${s.pos}</span>
      <span><span class="ff-name">${s.player.name}</span><br><span class="ff-meta">${s.player.fromTeam}</span></span>
      <span class="ff-ovr">${Math.round(s.player.ovr * s.fit)}</span>`;
    ff.appendChild(row);
  });

  state._lastResult = { wins, losses, tier: tier.label, players: state.slots };
  showScreen("result");
}

function shareResult() {
  const r = state._lastResult;
  if (!r) return;
  const lines = r.players.map((s) => `${s.pos}: ${s.player.name}`).join("\n");
  const text = `Min 82-0 NBA-femmer gikk ${r.wins}-${r.losses} (${r.tier})!\n\n${lines}\n\nBygg din egen på 82-0`;
  if (navigator.share) {
    navigator.share({ title: "82-0", text }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => toast("Resultat kopiert til utklippstavlen!"));
  } else {
    toast("Deling støttes ikke i denne nettleseren.");
  }
}

/* ---------------- wiring ---------------- */
function init() {
  initSetup();
  $("#spin-btn").addEventListener("click", spin);
  $("#respin-btn").addEventListener("click", () => { resetSpinner(); });
  $("#finish-btn").addEventListener("click", showResult);
  $("#share-btn").addEventListener("click", shareResult);
  $("#again-btn").addEventListener("click", () => showScreen("setup"));
  showScreen("setup");
}

document.addEventListener("DOMContentLoaded", init);
