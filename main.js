// Everything you are likely to edit lives in CONFIG and SYSTEMS.
const CONFIG = {
  handle: "hz_ji",
  discord: "hz.ji",
  discordId: "1273766618941358112",
};

const CATEGORIES = ["Combat", "Sports", "Netcode", "AI", "Physics", "Gameplay", "Interface"];

// clip: the file name in the clips folder, without .mp4.
const SYSTEMS = [
  {
    id: "parry",
    clip: "soulbound-combat",
    title: "Parry Based Combat",
    cat: "Combat",
    tags: ["Parry windows", "Sword M1 combos", "Clashes"],
  },
  {
    id: "abilities",
    clip: "nCBuQ5cKcwStq4IbW",
    title: "Custom Ability System",
    cat: "Combat",
    tags: ["Data-driven interpreter", "Point budget", "Server-validated builds"],
  },
  {
    id: "guns",
    clip: "nCBrLkLksm2lsSnRi",
    title: "Gun System",
    cat: "Combat",
    tags: ["Server-flown ballistics", "Penetration model", "Procedural viewmodel", "Lag-compensated hitboxes"],
  },
  {
    id: "throwing",
    clip: "nCBaVTjbr_JHBi0Kf",
    title: "Throwing",
    cat: "Combat",
    tags: ["Arc preview", "Shared projectile code", "Leaderboard"],
  },
  {
    id: "hockey",
    clip: "nCBm7CX9fh_XI0JLJ",
    title: "Ice Hockey System",
    cat: "Sports",
    tags: ["Skating physics", "Match rules", "Goalie AI", "Single spec module"],
  },
  {
    id: "lagcomp",
    clip: "nCBC2iD4sT_IbfaE8",
    title: "Lag Optimization",
    cat: "Netcode",
    tags: ["Hitbox history", "Server rewind", "Slab-tested rays"],
  },
  {
    id: "anticheat",
    clip: "nCBAN5JKXYLo4iTgO",
    title: "Anti Cheat System",
    cat: "Netcode",
    tags: ["Server-side detectors", "Movement exemptions", "Rubber-banding", "Rate limits"],
  },
  {
    id: "playback",
    clip: "nCByfgLtf4Pj3pDYO",
    title: "Playback System",
    cat: "Netcode",
    tags: ["Ring buffers", "20-byte pose records", "Kill-cam"],
  },
  {
    id: "matchmaking",
    clip: "nCBdKKdhlCOURQLsk",
    title: "Queue and Matchmaking",
    cat: "Netcode",
    tags: ["Queue", "Per-match arenas", "Best of three"],
  },
  {
    id: "squad",
    clip: "nCBxCFjMLlNlA3Xaq",
    title: "Smart AI System",
    cat: "AI",
    tags: ["GOAP", "A* over bitmasks", "Squad blackboard"],
  },
  {
    id: "detection",
    clip: "nCBtonXBc84lBEYZz",
    title: "Detection System",
    cat: "AI",
    tags: ["Sight cones", "Suspicion meter", "Sound propagation", "Guard states"],
  },
  {
    id: "crowd",
    clip: "nCBwMr7KYRowBAhIh",
    title: "Crowd System",
    cat: "AI",
    tags: ["Flow fields", "Spatial hash", "Packed buffer"],
  },
  {
    id: "voxels",
    clip: "nCBDFlPrrbd96UP6W",
    title: "Voxel Destruction",
    cat: "Physics",
    tags: ["Voxel grid in a buffer", "Greedy meshing", "Chunked updates"],
  },
  {
    id: "fishing",
    clip: "nCBoNoH179vYnnzmj",
    title: "Fishing System",
    cat: "Gameplay",
    tags: ["Verlet rope", "Tension model", "Species tables"],
  },
  {
    id: "garage",
    clip: "nCBnvV0tDVoAYqI4i",
    title: "Kart Garage",
    cat: "Gameplay",
    tags: ["Part-based builder", "Server-checked purchases", "Saved loadouts"],
  },
  {
    id: "clanreroll",
    clip: "soulbound-clan-reroll",
    title: "Clan Reroll",
    cat: "Gameplay",
    tags: ["Inventory", "Consumables", "Clan rolls"],
  },
  {
    id: "skilltree",
    clip: "nCjqwaNsHhoFaa_sD",
    title: "Skill Tree System",
    cat: "Interface",
    tags: ["Pan and zoom graph", "Stat modifiers", "Server-validated purchases"],
  },
  {
    id: "stars",
    clip: "nCB7ShgidA52yhQ8y",
    title: "Stars Menu",
    cat: "Interface",
    tags: ["Generated starfield", "ReplicatedFirst", "Loading flow"],
  },
  {
    id: "menus",
    clip: "soulbound-menus",
    title: "Soul Bound Menus",
    cat: "Interface",
    tags: ["Pause menu", "Animated title", "Save slots"],
  },
];

const SERVERS = [
  { id: "1546036540474400810", name: "", invite: "" },
  { id: "1530900427023978568", name: "", invite: "" },
  { id: "1246209695329419374", name: "", invite: "" },
  { id: "1538983611032670310", name: "", invite: "" },
  { id: "1559379173511004282", name: "", invite: "" },
];

const $ = (selector, root = document) => root.querySelector(selector);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// A 5x5 mirrored block mark, unique to the text it is made from.
function sigil(text) {
  let bits = hash(text);
  const cells = [];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 3; x++) {
      const on = bits & 1;
      bits = (bits >>> 1) | ((bits & 1) << 31);
      if (!on) continue;
      cells.push([x, y]);
      if (x < 2) cells.push([4 - x, y]);
    }
  }
  if (cells.length < 6) cells.push([2, 2], [1, 2], [3, 2], [2, 1], [2, 3]);
  const rects = cells
    .map(([x, y]) => `<rect x="${x + 0.06}" y="${y + 0.06}" width="0.88" height="0.88"/>`)
    .join("");
  return `<svg viewBox="0 0 5 5" fill="currentColor" aria-hidden="true">${rects}</svg>`;
}


function setupBrowser() {
  const index = $("#index");
  const frame = $("#frame");
  let current = null;
  let onScreen = false;

  for (const cat of CATEGORIES) {
    const members = SYSTEMS.filter((s) => s.cat === cat);
    if (!members.length) continue;

    const group = document.createElement("div");
    group.className = "index-group";
    group.innerHTML = `<div class="index-label"><span>${cat}</span><span>${members.length}</span></div>`;

    for (const system of members) {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "index-item";
      item.dataset.id = system.id;
      item.innerHTML = `<span class="sigil">${sigil(system.title)}</span><span>${system.title}</span>`;
      item.addEventListener("click", () => select(system.id, true));
      group.append(item);
    }
    index.append(group);
  }

  // Browsers only allow sound after a click, so the clip shown on page load starts muted.
  function play(system, withSound) {
    const state = $("#frame-state");
    $("#frame-sigil").innerHTML = sigil(system.title);
    $("#frame-note").textContent = "";
    state.classList.add("is-waiting");

    for (const old of frame.querySelectorAll("video")) {
      old.pause();
      old.classList.remove("is-current");
    }

    const player = document.createElement("video");
    player.className = "is-current";
    player.src = `clips/${system.clip}.mp4`;
    player.preload = "auto";
    player.muted = !withSound;
    player.loop = true;
    player.playsInline = true;
    player.disablePictureInPicture = true;
    player.disableRemotePlayback = true;
    player.draggable = false;
    player.setAttribute("controlslist", "nodownload noremoteplayback");
    player.setAttribute("aria-label", `${system.title} clip`);

    // The previous clip stays on screen until this one has a frame to show.
    player.addEventListener(
      "playing",
      () => {
        if (!player.classList.contains("is-current")) return;
        player.classList.add("is-on");
        state.classList.remove("is-waiting");
        for (const old of frame.querySelectorAll("video:not(.is-current)")) {
          old.classList.remove("is-on");
          setTimeout(() => old.remove(), 600);
        }
      },
      { once: true },
    );
    player.addEventListener("error", () => {
      if (!player.classList.contains("is-current")) return;
      for (const old of frame.querySelectorAll("video")) old.remove();
      state.classList.remove("is-waiting");
      $("#frame-note").textContent = "This clip's file is missing from the clips folder.";
    });
    player.addEventListener("click", () => {
      if (player.muted) player.muted = false;
      else if (player.paused) player.play();
      else player.pause();
    });

    frame.append(player);
    if (onScreen) player.play().catch(() => {});
  }

  function select(id, fromUser) {
    const system = SYSTEMS.find((s) => s.id === id) || SYSTEMS[0];
    if (current === system.id) return;
    current = system.id;

    for (const item of index.querySelectorAll(".index-item")) {
      if (item.dataset.id === system.id) item.setAttribute("aria-current", "true");
      else item.removeAttribute("aria-current");
    }

    $("#meta-cat").textContent = system.cat;
    $("#meta-title").textContent = system.title;
    $("#meta-tags").innerHTML = system.tags.map((tag) => `<li>${tag}</li>`).join("");

    const meta = $("#meta");
    meta.classList.remove("is-in");
    void meta.offsetWidth;
    meta.classList.add("is-in");

    play(system, fromUser);

    if (fromUser) {
      history.replaceState(null, "", `#system-${system.id}`);
      if (matchMedia("(max-width: 860px)").matches) {
        $("#stage").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      }
    }
  }

  index.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const items = [...index.querySelectorAll(".index-item")];
    const at = items.indexOf(document.activeElement);
    if (at < 0) return;
    event.preventDefault();
    const next = items[at + (event.key === "ArrowDown" ? 1 : -1)];
    if (next) next.focus();
  });

  // Takes away the right-click "Save video as" route.
  $("#stage").addEventListener("contextmenu", (event) => event.preventDefault());
  $("#stage").addEventListener("dragstart", (event) => event.preventDefault());

  const linked = location.hash.match(/^#system-(.+)$/);
  select(linked ? linked[1] : SYSTEMS[0].id, false);
  if (linked) $("#systems").scrollIntoView();

  $("#count-filmed").textContent = SYSTEMS.length;

  new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting;
      const player = $("video.is-current", frame);
      if (!player) return;
      if (onScreen) player.play().catch(() => {});
      else player.pause();
    },
    { threshold: 0.35 },
  ).observe(frame);
}

function setupServers() {
  const list = $("#servers");
  const month = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" });
  for (const server of SERVERS) {
    const created = new Date(Number((BigInt(server.id) >> 22n) + 1420070400000n));
    const card = document.createElement(server.invite ? "a" : "div");
    card.className = "server";
    if (server.invite) {
      card.href = server.invite;
      card.target = "_blank";
      card.rel = "noopener";
    }
    card.innerHTML = `
      <span class="server-mark">${sigil(server.id)}</span>
      <span class="server-name">${server.name || "Discord server"}</span>
      <span class="server-id">${server.id}</span>
      <span class="server-foot"><span>Since ${month.format(created)}</span><span>${server.invite ? "Join" : "Contributor"}</span></span>`;
    const item = document.createElement("li");
    item.append(card);
    list.append(item);
  }
  $("#count-servers").textContent = SERVERS.length;
}

function setupContact() {
  const actions = $("#contact-actions");
  const note = $("#copy-note");

  for (const node of document.querySelectorAll('[data-config="handle"]')) node.textContent = CONFIG.handle;
  for (const node of document.querySelectorAll("[data-sigil]")) node.innerHTML = sigil(node.dataset.sigil);

  const mark = sigil(CONFIG.handle)
    .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
    .replace('viewBox="0 0 5 5"', 'viewBox="-1 -1 7 7"')
    .replace('fill="currentColor"', 'fill="#fff" style="background:#000"');
  $("#icon").href = `data:image/svg+xml,${encodeURIComponent(mark)}`;

  const profile = `https://discord.com/users/${CONFIG.discordId}`;
  for (const node of document.querySelectorAll("[data-discord]")) {
    node.href = profile;
    node.target = "_blank";
    node.rel = "noopener";
  }

  const open = document.createElement("a");
  open.className = "btn btn-solid";
  open.href = profile;
  open.target = "_blank";
  open.rel = "noopener";
  open.textContent = "Open my Discord profile";

  const copy = document.createElement("button");
  copy.type = "button";
  copy.className = "btn btn-line";
  copy.textContent = `Copy username: ${CONFIG.discord}`;
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.discord);
      note.textContent = "Copied. Paste it into Discord's Add Friend box.";
    } catch {
      note.textContent = `Copy didn't work here. The username is ${CONFIG.discord}.`;
    }
  });

  actions.append(open, copy);
}

function setupChrome() {
  const nav = $("#nav");
  const stick = () => nav.classList.toggle("is-stuck", scrollY > 12);
  addEventListener("scroll", stick, { passive: true });
  stick();

  const reveals = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    for (const node of reveals) node.classList.add("is-in");
    return;
  }
  const watcher = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        watcher.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  for (const node of reveals) watcher.observe(node);
}

// The hero: an isometric field of blocks whose heights move in stud-sized steps
// and rise under the cursor.
function setupField() {
  const canvas = $("#field");
  const hero = canvas.parentElement;
  const ctx = canvas.getContext("2d");
  const SIZE = 34;
  const heights = new Float32Array(SIZE * SIZE);

  let width = 0;
  let height = 0;
  let tileW = 0;
  let tileH = 0;
  let originX = 0;
  let originY = 0;
  let step = 0;
  let pointerI = -99;
  let pointerJ = -99;
  let visible = true;
  let frame = 0;

  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const narrow = width < 860;
    tileW = Math.max(width, 900) / (narrow ? 15 : 21);
    tileH = tileW / 2;
    step = tileH * 0.62;
    originX = narrow ? width * 0.5 : width * 0.7;
    originY = height * (narrow ? 0.34 : 0.4) - (SIZE * tileH) / 2;
    if (reducedMotion) draw(0);
  }

  function project(i, j, z) {
    return [originX + ((i - j) * tileW) / 2, originY + ((i + j) * tileH) / 2 - z];
  }

  function quad(a, b, c, d) {
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.lineTo(c[0], c[1]);
    ctx.lineTo(d[0], d[1]);
    ctx.closePath();
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    const t = time * 0.00035;
    const half = SIZE / 2;

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const di = (i + 0.5 - half) / half;
        const dj = (j + 0.5 - half) / half;
        const fade = Math.max(0, 1 - Math.pow(di * di + dj * dj, 1.4));
        if (fade < 0.03) continue;

        const wave =
          Math.sin(i * 0.34 + t * 2.1) + Math.sin(j * 0.41 - t * 1.7) + Math.sin((i + j) * 0.19 + t * 1.2);
        const pi = i + 0.5 - pointerI;
        const pj = j + 0.5 - pointerJ;
        const lift = Math.exp(-(pi * pi + pj * pj) / 9);

        const levels = Math.round((wave / 3 + 1) * 2.2 + lift * 4);
        const slot = i * SIZE + j;
        const target = levels * step;
        heights[slot] = reducedMotion ? target : heights[slot] + (target - heights[slot]) * 0.14;
        const z = heights[slot];

        const glow = Math.min(1, z / (step * 6));
        const top = Math.round(8 + glow * 84 + lift * 140);
        const edge = (0.14 + glow * 0.5 + lift * 0.5) * fade;

        const a = project(i, j, z);
        const b = project(i + 1, j, z);
        const c = project(i + 1, j + 1, z);
        const d = project(i, j + 1, z);
        const c0 = project(i + 1, j + 1, 0);

        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(255,255,255,${edge * 0.6})`;

        ctx.fillStyle = "#000";
        quad(d, c, c0, project(i, j + 1, 0));
        ctx.fill();
        ctx.stroke();

        const side = Math.round(top * 0.4 * fade);
        ctx.fillStyle = `rgb(${side},${side},${side})`;
        quad(b, c, c0, project(i + 1, j, 0));
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = `rgb(${Math.round(top * fade)},${Math.round(top * fade)},${Math.round(top * fade)})`;
        ctx.strokeStyle = `rgba(255,255,255,${edge})`;
        quad(a, b, c, d);
        ctx.fill();
        ctx.stroke();
      }
    }

    // Keeps the headline readable where the field runs behind it.
    const shade = ctx.createLinearGradient(0, 0, width, 0);
    shade.addColorStop(0, "rgba(0,0,0,0.88)");
    shade.addColorStop(width < 860 ? 1 : 0.55, width < 860 ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, width, height);
  }

  function loop(time) {
    frame = 0;
    if (!visible) return;
    draw(time);
    frame = requestAnimationFrame(loop);
  }

  hero.addEventListener("pointermove", (event) => {
    const box = canvas.getBoundingClientRect();
    const u = (event.clientX - box.left - originX) / (tileW / 2);
    const v = (event.clientY - box.top - originY + step * 2) / (tileH / 2);
    pointerI = (u + v) / 2;
    pointerJ = (v - u) / 2;
    if (reducedMotion) draw(0);
  });
  hero.addEventListener("pointerleave", () => {
    pointerI = pointerJ = -99;
    if (reducedMotion) draw(0);
  });

  addEventListener("resize", resize);
  resize();

  if (reducedMotion) return;
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !frame) frame = requestAnimationFrame(loop);
  }).observe(hero);
}

setupContact();
setupBrowser();
setupServers();
setupChrome();
setupField();
