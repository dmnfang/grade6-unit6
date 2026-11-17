const $ = s => document.querySelector(s);
const get = (pool, id) => ITEMS[pool].find(i => i.id === id);
const shuffle = a => [...a].sort(() => Math.random() - 0.5);

// Each question reads its correct answer from animal[key] and its tiles from ITEMS[pool]
const Q = [
  { key: "place", pool: "places", ask: a => `Where do ${a.plural} live?` },
  { key: "food", pool: "foods", ask: a => `What do ${a.plural} eat?` },
  { key: "problem", pool: "problems", ask: () => "What is the big problem?" },
  { key: "fix", pool: "solutions", ask: () => "What can we do?" }
];
const TYPE = { animal: "animals", place: "places", food: "foods", problem: "problems", fix: "solutions" };

// {s} = slot filled from the quiz, cap = capitalise, function = text built from answers
const LINES = [
  [`Let’s save the `, { s: "animal" }, "."],
  [{ s: "animal", cap: 1 }, " live ", { s: "place" }, "."],
  [{ s: "animal", cap: 1 }, " eat ", { s: "food" }, "."],
  [{ s: "problem", cap: 1 }, R => ` ${R.problem.be || "is"} a big problem.`],
  ["We can ", { s: "fix" }, "."]
];

let st;

// Images: tries .webp first, then .png, then falls back to the emoji. The result is remembered per image.
const EXTS = ["webp", "png"], found = {};
const pic = (pool, it) => {
  const k = `${pool}/${it.id}`, i = found[k] ?? 0;
  if (i >= EXTS.length) return `<span class="pic"><span class="emo">${it.emoji}</span></span>`;
  return `<span class="pic"><img src="images/${k}.${EXTS[i]}" alt="" data-k="${k}" data-i="${i}" data-e="${it.emoji}" onload="imgOk(this)" onerror="imgFail(this)"></span>`;
};
function imgOk(img) { found[img.dataset.k] = +img.dataset.i; }
function imgFail(img) {
  const i = +img.dataset.i + 1;
  if (i < EXTS.length) { img.dataset.i = i; img.src = `images/${img.dataset.k}.${EXTS[i]}`; return; }
  found[img.dataset.k] = EXTS.length;
  img.outerHTML = `<span class="emo">${img.dataset.e}</span>`;
}

function start(animal) {
  st = { animal, step: 0, ans: {}, screen: "quiz", show: new Set(), lock: false, opts: {} };
  render();
}
function newAnimal() {
  const others = ITEMS.animals.filter(a => !st || a !== st.animal);
  start(others[Math.floor(Math.random() * others.length)]);
}
// Sensible answers, keeping only ids that exist in the pool.
// Solutions come from the problem the student just picked; everything else from the animal.
function goodIds(q) {
  let ids = q.key === "fix"
    ? [].concat((ITEMS.problems.find(p => p.id === st.ans.problem) || {}).fix || [])
    : [].concat(st.animal[q.key]);
  return ids.filter(id => ITEMS[q.pool].some(i => i.id === id));
}
function opts(q) {
  let good = goodIds(q);
  const pickFrom = good.length ? good : ITEMS[q.pool].map(i => i.id); // never crash on bad data
  const one = pickFrom[Math.floor(Math.random() * pickFrom.length)];
  return (st.opts[st.step] ??= shuffle([
    get(q.pool, one),
    ...shuffle(ITEMS[q.pool].filter(i => !good.includes(i.id) && i.id !== one)).slice(0, 3)
  ]));
}

function quiz() {
  const bar = `<div class="bar">${Q.map((_, i) => `<i class="${i < st.step ? "on" : ""}"></i>`).join("")}</div>`;
  if (st.step >= Q.length) {
    const chips = Q.map(q => {
      const it = get(q.pool, st.ans[q.key]);
      return `<div class="chip">${pic(q.pool, it)}<span>${it.word}</span></div>`;
    }).join("");
    return `${bar}<div class="done"><h2>Great job!</h2><div class="chips">${chips}</div><button class="btn pri big" data-a="speech">Make speech</button></div>`;
  }
  const q = Q[st.step];
  const tiles = opts(q).map(it => `<button class="tile" data-id="${it.id}">${pic(q.pool, it)}<span class="lbl">${it.word}</span></button>`).join("");
  return `${bar}<h2>${q.ask(st.animal)}</h2><div class="grid">${tiles}</div>`;
}

function speech() {
  const R = { animal: st.animal };
  Q.forEach(q => (R[q.key] = get(q.pool, st.ans[q.key])));
  const lines = LINES.map((line, i) => {
    const parts = line.map((p, j) => {
      if (typeof p === "string") return p;
      if (typeof p === "function") return p(R);
      const it = R[p.s], k = `${i}-${j}`;
      let w = p.s === "animal" ? it.plural : it.word;
      if (p.cap) w = w[0].toUpperCase() + w.slice(1);
      return st.show.has(k)
        ? `<button class="slot word c-${p.s}" data-k="${k}">${w}</button>`
        : `<button class="slot img c-${p.s}" data-k="${k}">${pic(TYPE[p.s], it)}</button>`;
    });
    return `<p>${parts.join("")}</p>`;
  });
  return `<div class="script">${lines.join("")}</div>`;
}

function flipAll() {
  const keys = [];
  LINES.forEach((l, i) => l.forEach((p, j) => p.s && keys.push(`${i}-${j}`)));
  st.show = keys.every(k => st.show.has(k)) ? new Set() : new Set(keys);
  render();
}

function render() {
  const sp = st.screen === "speech";
  $("#app").innerHTML = `
    <header>
      <h1>Save the animals</h1>
      <div class="nav">
        ${sp ? `<button class="btn" data-a="flip">Flip all</button>` : ""}
        <button class="btn" data-a="redo">Redo quiz</button>
        <button class="btn pri" data-a="new">New animal</button>
      </div>
    </header>
    <main>
      <section class="panel left"><div class="animal-card">${pic("animals", st.animal)}<div class="name">${st.animal.word}</div></div></section>
      <section class="panel right ${sp ? "speech" : ""}">${sp ? speech() : quiz()}</section>
    </main>`;
}

$("#app").onclick = e => {
  const b = e.target.closest("[data-a],.tile,.slot");
  if (!b) return;
  if (b.dataset.a) {
    ({ new: newAnimal, redo: () => start(st.animal), speech: () => { st.screen = "speech"; render(); }, flip: flipAll })[b.dataset.a]();
    return;
  }
  if (b.classList.contains("slot")) {
    const k = b.dataset.k;
    st.show.has(k) ? st.show.delete(k) : st.show.add(k);
    render();
    return;
  }
  if (st.lock) return;
  const q = Q[st.step];
  if (REQUIRE_CORRECT && !goodIds(q).includes(b.dataset.id)) {
    b.classList.add("wrong");
    setTimeout(() => b.classList.remove("wrong"), 400);
    return;
  }
  b.classList.add("right");
  st.lock = true;
  setTimeout(() => { st.ans[q.key] = b.dataset.id; st.step++; st.lock = false; render(); }, 500);
};

// Warn about answers that point at ids missing from the data
const missing = (who, pool, ids) => [].concat(ids).forEach(id => {
  if (!ITEMS[pool].some(i => i.id === id)) console.warn(`data.js: ${who} uses "${id}" which is not in ${pool}`);
});
ITEMS.animals.forEach(an => Q.filter(q => q.key !== "fix").forEach(q => missing(`${an.id}.${q.key}`, q.pool, an[q.key])));
ITEMS.problems.forEach(pr => pr.fix ? missing(`${pr.id}.fix`, "solutions", pr.fix) : console.warn(`data.js: problem "${pr.id}" has no fix`));

newAnimal();
