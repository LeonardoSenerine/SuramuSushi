/* Aviso de privacidade/cookies. O site não usa cookies de rastreamento:
   o aviso só informa e lembra (no localStorage) que já foi fechado. */
(() => {
  const KEY = "suramu-aviso";
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}

  const base = document.documentElement.dataset.base || "";
  const box = document.createElement("aside");
  box.className = "cookie";
  box.setAttribute("role", "region");
  box.setAttribute("aria-label", "Aviso de privacidade");
  box.innerHTML = `
    <p class="cookie__title mono">✱ Aviso rápido</p>
    <p class="cookie__text">A gente não usa cookies de rastreamento nem de anúncio. Só guardamos no seu navegador o mínimo pro site funcionar.</p>
    <div class="cookie__actions">
      <button class="btn btn--white btn--sm" type="button">Fechou</button>
      <a class="cookie__link mono" href="${base}politica-de-cookies.html">Saber mais</a>
    </div>`;

  const close = () => {
    try { localStorage.setItem(KEY, "1"); } catch (e) {}
    box.classList.remove("is-on");
    setTimeout(() => box.remove(), 500);
  };
  box.querySelector("button").addEventListener("click", close);

  const show = () => {
    document.body.append(box);
    requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add("is-on")));
  };
  // na home, espera a intro terminar
  if (document.documentElement.classList.contains("intro")) setTimeout(show, 3200);
  else setTimeout(show, 900);
})();
