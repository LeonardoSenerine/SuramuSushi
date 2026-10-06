const html = document.documentElement;
html.classList.add("js");

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const desktop = matchMedia("(min-width: 900px)");
const canHover = matchMedia("(hover: hover) and (pointer: fine)");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ================================================================
   TÍTULOS DO MANIFESTO
   Cada linha ocupa uma fração da largura (data-w), com recuo opcional (data-x),
   e o bloco inteiro encolhe se passar da altura da tela.
   ================================================================ */
function fitType() {
  document.querySelectorAll("[data-fit]").forEach((block) => {
    const rows = [...block.querySelectorAll(".row")];
    const parent = getComputedStyle(block.parentElement);
    const width = block.parentElement.clientWidth - parseFloat(parent.paddingLeft) - parseFloat(parent.paddingRight);
    const isDesktop = desktop.matches;
    const maxH = innerHeight * (isDesktop ? 0.66 : 0.56);
    const indents = rows.map((row) => parseFloat(row.dataset.x || 0));

    const sizes = rows.map((row, i) => {
      const inner = row.querySelector(".row__in");
      row.style.fontSize = "100px";
      row.style.paddingLeft = "0";
      const natural = inner.scrollWidth || 1;
      const w = parseFloat(row.dataset.w || 1);
      const frac = Math.min(isDesktop ? w : w * 1.4, 1 - indents[i]);
      return (100 * width * frac * 0.98) / natural;
    });

    const total = sizes.reduce((a, s) => a + s * 0.88, 0);
    const k = total > maxH ? maxH / total : 1;
    rows.forEach((row, i) => {
      row.style.fontSize = `${sizes[i] * k}px`;
      row.style.paddingLeft = `${indents[i] * width * k}px`;
    });
  });
}

/* ================================================================
   QUADRO DOS PEIXES DO DIA (dados em data/peixes-do-dia.js)
   ================================================================ */
function renderBoard() {
  const list = document.getElementById("board-list");
  const dateEl = document.getElementById("board-date");
  const fish = window.PEIXES_DO_DIA || [];
  const labels = { chegou: "Chegou", ultimas: "Últimas", acabou: "Acabou" };
  const dots = { chegou: "dot--in", ultimas: "dot--last", acabou: "dot--out" };

  const today = new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
  dateEl.textContent = `Hoje · ${today.replace(".", "")}`;

  list.innerHTML = "";
  fish.forEach((f) => {
    const li = document.createElement("li");
    li.className = `fish fish--${f.status}`;
    li.innerHTML = `
      <span class="fish__name"><span class="fish__txt"></span><span class="fish__jp" lang="ja"></span></span>
      <span class="fish__status mono"><i class="dot"></i><span class="fish__label"></span></span>
      <span class="fish__note"></span>`;
    li.querySelector(".fish__txt").textContent = f.nome;
    li.querySelector(".fish__jp").textContent = f.jp;
    li.querySelector(".fish__note").textContent = f.nota;
    li.querySelector(".fish__label").textContent = labels[f.status] || "";
    li.querySelector(".dot").classList.add(dots[f.status] || "dot--in");
    list.append(li);
  });
}

/* ================================================================
   ABERTO AGORA? (horário de São Paulo)
   ================================================================ */
// 0 = domingo ... 6 = sábado. Dias sem entrada = fechado.
const HORARIO = { 2: [18, 22], 3: [18, 22], 4: [18, 22], 5: [18, 22], 6: [18, 22] };
const DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function updateStatus() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" })
      .formatToParts(new Date()).map((p) => [p.type, p.value])
  );
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
  const now = Number(parts.hour) + Number(parts.minute) / 60;
  const today = HORARIO[day];

  let open = false;
  let text;
  if (today && now >= today[0] && now < today[1]) {
    open = true;
    text = `Aberto agora · até ${today[1]}h`;
  } else if (today && now < today[0]) {
    text = `Fechado · abre hoje às ${today[0]}h`;
  } else {
    for (let i = 1; i <= 7; i++) {
      const d = (day + i) % 7;
      if (HORARIO[d]) {
        text = `Fechado · abre ${i === 1 ? "amanhã" : DIAS[d]} às ${HORARIO[d][0]}h`;
        break;
      }
    }
  }

  document.querySelectorAll("[data-status]").forEach((el) => {
    el.classList.toggle("is-open", open);
    el.querySelector(".status__text").textContent = text;
  });
}

/* ================================================================
   LOGO PINTADO COM SPRAY
   Troca o logo (máscara CSS) por um SVG inline com uma máscara em zigue-zague
   que "pinta" as letras em passadas, como uma lata de spray.
   ================================================================ */
let tagsPainted;
function paintTags() {
  tagsPainted ??= (async () => {
    const spans = [...document.querySelectorAll("span.tag")];
    if (!spans.length || reduceMotion) return;
    try {
      const txt = await (await fetch("assets/brand/suramu-tag.svg")).text();
      const src = new DOMParser().parseFromString(txt, "image/svg+xml").querySelector("svg");
      const d = src.querySelector("path").getAttribute("d");
      const [x, y, w, h] = src.getAttribute("viewBox").trim().split(/\s+/).map(Number);
      const rows = 4;
      const rh = h / rows;
      const m = w * 0.05;

      let zz = `M${x - m} ${y + rh / 2}`;
      for (let i = 0; i < rows; i++) {
        const yy = y + rh * (i + 0.5);
        zz += `${i ? ` V${yy}` : ""} H${i % 2 ? x - m : x + w + m}`;
      }

      spans.forEach((span, n) => {
        const id = `spray-${n}`;
        span.insertAdjacentHTML("afterend", `
          <svg class="${span.className}" viewBox="${x} ${y} ${w} ${h}" aria-hidden="true" focusable="false">
            <defs>
              <mask id="${id}" maskUnits="userSpaceOnUse" x="${x - m}" y="${y - rh}" width="${w + 2 * m}" height="${h + 2 * rh}">
                <path class="spray-stroke" d="${zz}" pathLength="1" fill="none" stroke="#fff"
                      stroke-width="${rh * 1.4}" stroke-linecap="round" stroke-linejoin="round"/>
              </mask>
            </defs>
            <path d="${d}" fill="currentColor" fill-rule="evenodd" mask="url(#${id})"/>
          </svg>`);
        const svg = span.nextElementSibling;
        span.remove();
        if (svg.classList.contains("footer__tag")) io?.observe(svg);
      });
    } catch (e) {
      /* sem fetch (ex.: arquivo aberto direto do disco): fica a versão em máscara CSS */
    }
  })();
  return tagsPainted;
}

/* ================================================================
   INTRO (só na primeira visita da sessão)
   ================================================================ */
async function runIntro() {
  const tagsReady = Promise.race([paintTags(), wait(1500)]);

  if (!html.classList.contains("intro")) {
    await tagsReady;
    html.classList.add("is-ready");
    return;
  }

  const loader = document.querySelector(".loader");
  const count = document.getElementById("loader-count");
  const DUR = 1300;
  const start = performance.now();
  const tick = (t) => {
    const p = Math.min((t - start) / DUR, 1);
    count.textContent = String(Math.round((1 - Math.pow(1 - p, 3)) * 100)).padStart(2, "0");
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  await Promise.all([wait(DUR + 150), tagsReady, Promise.race([document.fonts.ready, wait(2500)])]);
  count.textContent = "100";
  loader.classList.add("is-done");
  try { sessionStorage.setItem("suramu-intro", "1"); } catch (e) {}

  await wait(280);
  html.classList.add("is-ready");
  await wait(1100);
  loader.remove();
  html.classList.remove("intro");
}

/* ================================================================
   TEXTO "DECODIFICANDO" (estilo painel de aeroporto)
   ================================================================ */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function scramble(el, dur = 900) {
  if (reduceMotion) return;
  const final = el.dataset.final ?? (el.dataset.final = el.textContent);
  const chars = [...final];
  const settle = chars.map((_, i) => (i / chars.length) * dur * 0.6 + Math.random() * dur * 0.4);
  const start = performance.now();

  const step = (t) => {
    const e = t - start;
    let done = true;
    el.textContent = chars.map((c, i) => {
      if (!/[a-z0-9À-ÿ]/i.test(c) || e >= settle[i]) return c;
      done = false;
      return GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }).join("");
    if (!done) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  setTimeout(() => { el.textContent = final; }, dur + 120);
}

/* ================================================================
   TÍTULOS PALAVRA POR PALAVRA
   ================================================================ */
function splitWords(el) {
  const nodes = [...el.childNodes];
  el.textContent = "";
  let i = 0;
  const add = (content) => {
    const w = document.createElement("span");
    w.className = "w";
    const inner = document.createElement("span");
    inner.style.setProperty("--i", i++);
    inner.append(content);
    w.append(inner);
    el.append(w);
  };
  nodes.forEach((n) => {
    if (n.nodeType !== Node.TEXT_NODE) return add(n);
    n.textContent.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) el.append(document.createTextNode(" "));
      else add(part);
    });
  });
}

/* ================================================================
   ENTRADAS AO ROLAR
   ================================================================ */
let io;
function setupReveal() {
  const targets = document.querySelectorAll("[data-fit], .reveal, .photo, [data-scramble], svg.footer__tag");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-in"));
    return;
  }

  io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("is-in");
      io.unobserve(el);

      if (el.hasAttribute("data-scramble")) scramble(el);
      if (el.classList.contains("board")) {
        el.querySelectorAll(".fish__txt").forEach((name, i) => setTimeout(() => scramble(name, 1000), 250 + i * 130));
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });

  targets.forEach((t) => io.observe(t));
}

/* ================================================================
   CURSOR PRÓPRIO + BOTÕES MAGNÉTICOS + NAV QUE ROLA (desktop)
   ================================================================ */
const cursor = { el: null, label: null, x: -100, y: -100, cx: -100, cy: -100 };

function setupPointer() {
  document.querySelectorAll(".nav__links a").forEach((a) => {
    const t = a.textContent.trim();
    a.setAttribute("aria-label", t);
    a.innerHTML = `<span class="roll" aria-hidden="true"><span data-text="${t}">${t}</span></span>`;
  });

  if (!canHover.matches || reduceMotion) return;

  html.classList.add("has-cursor");
  cursor.el = document.createElement("div");
  cursor.el.className = "cursor";
  cursor.el.setAttribute("aria-hidden", "true");
  cursor.el.innerHTML = `<span class="cursor__label"></span>`;
  document.body.append(cursor.el);
  cursor.label = cursor.el.firstElementChild;

  addEventListener("mousemove", (e) => { cursor.x = e.clientX; cursor.y = e.clientY; }, { passive: true });
  addEventListener("mousedown", () => cursor.el.classList.add("is-down"));
  addEventListener("mouseup", () => cursor.el.classList.remove("is-down"));
  document.addEventListener("mouseleave", () => cursor.el.classList.add("is-hidden"));
  document.addEventListener("mouseenter", () => cursor.el.classList.remove("is-hidden"));

  document.addEventListener("mouseover", (e) => {
    const dish = e.target.closest(".dish");
    const link = e.target.closest("a, button");
    cursor.el.classList.toggle("is-hidden", !!dish);
    cursor.el.classList.toggle("is-link", !!link && !dish);
    cursor.label.textContent = link?.classList.contains("btn") ? "Bora" : link ? "→" : "";
  });

  document.querySelectorAll(".btn").forEach((b) => {
    b.addEventListener("mousemove", (e) => {
      const r = b.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      b.style.translate = `${(dx * 0.22).toFixed(1)}px ${(dy * 0.35).toFixed(1)}px`;
    });
    b.addEventListener("mouseleave", () => { b.style.translate = ""; });
  });
}

/* ================================================================
   CARDÁPIO: FOTO SEGUE O CURSOR
   ================================================================ */
const preview = { el: document.getElementById("menu-preview"), on: false, cx: 0, cy: 0 };

function setupMenuPreview() {
  document.querySelectorAll(".menu__group").forEach((g) => {
    g.querySelectorAll(".dish").forEach((dish, i) => dish.style.setProperty("--i", i));
  });

  document.querySelectorAll(".dish").forEach((dish) => {
    dish.addEventListener("mouseenter", (e) => {
      if (!canHover.matches || !desktop.matches) return;
      preview.el.src = dish.dataset.img;
      if (!preview.on) { preview.cx = e.clientX; preview.cy = e.clientY; }
      preview.on = true;
      preview.el.classList.add("is-on");
    });
    dish.addEventListener("mouseleave", () => {
      preview.on = false;
      preview.el.classList.remove("is-on");
    });
  });
}

/* ================================================================
   ROTA: SCROLL VERTICAL VIRA HORIZONTAL (desktop)
   ================================================================ */
const route = document.getElementById("rota");
const track = document.getElementById("route-track");
const routeBar = document.getElementById("route-bar");
const routeImgs = [...track.querySelectorAll("img")];
let routeDist = 0;

function sizeRoute() {
  if (!desktop.matches) {
    route.style.height = "";
    track.style.transform = "";
    routeDist = 0;
    return;
  }
  routeDist = Math.max(0, track.scrollWidth - innerWidth);
  route.style.height = `${routeDist + innerHeight}px`;
}

function updateRoute() {
  const r = route.getBoundingClientRect();
  if (r.bottom < 0 || r.top > innerHeight) return;
  if (routeDist) {
    const p = Math.min(Math.max(-r.top / (route.offsetHeight - innerHeight), 0), 1);
    track.style.transform = `translate3d(${(-p * routeDist).toFixed(1)}px, 0, 0)`;
    routeBar.style.width = `${p * 100}%`;
  }
  if (!reduceMotion) {
    routeImgs.forEach((img) => {
      const b = img.parentElement.getBoundingClientRect();
      img.style.transform = `translateX(${((b.left + b.width / 2 - innerWidth / 2) * -0.1).toFixed(1)}px)`;
    });
  }
}

/* ================================================================
   MANIFESTO EM CARTAS EMPILHADAS
   ================================================================ */
const stackEls = [...document.querySelectorAll(".mf--charcoal, .mf--coral")];
function sizeStack() {
  stackEls.forEach((el) => {
    el.classList.remove("is-stack");
    el.style.transform = "";
    el.style.removeProperty("--cover");
    if (!reduceMotion && el.offsetHeight <= innerHeight + 2) el.classList.add("is-stack");
  });
}

/* ================================================================
   LAÇO PRINCIPAL (um único requestAnimationFrame para tudo)
   ================================================================ */
function startLoop() {
  const nav = document.getElementById("nav");
  const fab = document.querySelector(".fab");
  const hero = document.querySelector(".hero");
  const heroTitle = document.querySelector(".hero__title");
  const footer = document.getElementById("pedir");
  const stickerSvg = document.querySelector(".sticker svg");
  const story = document.getElementById("historia");
  const letters = [...document.querySelectorAll(".story__giant span")];
  const parallax = [...document.querySelectorAll("[data-parallax]")];
  const tickers = [...document.querySelectorAll(".ticker__track")].map((el) => ({
    el, x: 0, dir: el.classList.contains("ticker__track--rev") ? 1 : -1,
  }));

  let lastY = scrollY;
  let lastT = performance.now();
  let vel = 0;
  let scrollDir = 1;
  let angle = 0;

  const frame = (t) => {
    requestAnimationFrame(frame);
    if (document.hidden) { lastT = t; return; }

    const dt = Math.min((t - lastT) / 1000, 0.05);
    lastT = t;
    const y = scrollY;
    const vh = innerHeight;
    const dy = y - lastY;
    vel += (dy - vel) * 0.15;
    if (Math.abs(dy) > 0.5) scrollDir = Math.sign(dy);

    // nav: fica sólida depois do hero, some ao descer e volta ao subir
    nav.classList.toggle("is-solid", y > vh * 0.6);
    if (y > vh && dy > 2) nav.classList.add("is-hidden");
    else if (dy < -2 || y <= vh) nav.classList.remove("is-hidden");
    lastY = y;

    // botão flutuante do celular
    const pastHero = hero.getBoundingClientRect().bottom < vh * 0.4;
    const atFooter = footer.getBoundingClientRect().top < vh * 0.9;
    fab.classList.toggle("is-on", pastHero && !atFooter);

    updateRoute();

    if (!reduceMotion) {
      // hero: o logo desce mais devagar que a página
      if (y < vh * 1.2) heroTitle.style.translate = `0 ${(y * 0.28).toFixed(1)}px`;

      // nigiris em paralaxe
      parallax.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        el.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallax)).toFixed(1)}px`;
      });

      // faixas: aceleram com a velocidade da rolagem e invertem ao subir
      const boost = 1 + Math.min(Math.abs(vel) / 5, 7);
      tickers.forEach((tk) => {
        const half = tk.el.scrollWidth / 2;
        if (!half) return;
        tk.x += tk.dir * scrollDir * 70 * dt * boost;
        if (tk.x <= -half) tk.x += half;
        if (tk.x > 0) tk.x -= half;
        tk.el.style.transform = `translate3d(${tk.x.toFixed(1)}px, 0, 0)`;
      });

      // selo gira mais rápido quando você rola
      angle += dt * (20 + Math.abs(vel) * 6) * scrollDir;
      stickerSvg.style.transform = `rotate(${angle.toFixed(1)}deg)`;

      // manifesto: a carta de baixo encolhe e escurece quando a próxima cobre
      stackEls.forEach((el) => {
        if (!el.classList.contains("is-stack")) return;
        const top = el.nextElementSibling.getBoundingClientRect().top;
        const p = Math.min(Math.max(1 - top / vh, 0), 1);
        el.style.setProperty("--cover", p.toFixed(3));
        el.style.transform = p > 0 ? `scale(${(1 - p * 0.07).toFixed(4)})` : "";
      });

      // história: letras gigantes em velocidades diferentes
      const sr = story.getBoundingClientRect();
      if (sr.bottom > 0 && sr.top < vh) {
        const p = (vh - sr.top) / (vh + sr.height) - 0.5;
        letters.forEach((l, i) => { l.style.transform = `translateY(${(p * (i % 2 ? 180 : -120)).toFixed(1)}px)`; });
      }

      // cursor
      if (cursor.el) {
        cursor.cx += (cursor.x - cursor.cx) * 0.25;
        cursor.cy += (cursor.y - cursor.cy) * 0.25;
        cursor.el.style.transform = `translate3d(${cursor.cx.toFixed(1)}px, ${cursor.cy.toFixed(1)}px, 0)`;
      }

      // foto do cardápio
      if (preview.on) {
        const px = preview.cx, py = preview.cy;
        preview.cx += (cursor.x - px) * 0.18;
        preview.cy += (cursor.y - py) * 0.18;
        preview.el.style.transform = `translate3d(${(preview.cx + 28).toFixed(1)}px, ${(preview.cy - 160).toFixed(1)}px, 0) rotate(${((cursor.x - preview.cx) * 0.04).toFixed(2)}deg)`;
      }
    }
  };
  requestAnimationFrame(frame);
}

/* ================================================================
   INÍCIO
   ================================================================ */
renderBoard();
updateStatus();
setInterval(updateStatus, 60_000);
document.querySelectorAll(".split").forEach(splitWords);
setupPointer();
setupMenuPreview();
// sem cursor próprio, a foto do cardápio precisa da posição do mouse mesmo assim
addEventListener("mousemove", (e) => { cursor.x = e.clientX; cursor.y = e.clientY; }, { passive: true });

runIntro();

document.fonts.ready.then(() => {
  fitType();
  sizeRoute();
  sizeStack();
  setupReveal();
  startLoop();
});

let resizeTimer;
addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { fitType(); sizeRoute(); sizeStack(); }, 120);
});
