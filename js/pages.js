/* Páginas internas: destaca no índice a seção que está na tela. */
(() => {
  const links = [...document.querySelectorAll(".legal__toc a")];
  if (!links.length || !("IntersectionObserver" in window)) return;

  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.remove("is-current"));
      byId.get(e.target.id)?.classList.add("is-current");
    });
  }, { rootMargin: "-30% 0px -60% 0px" });

  document.querySelectorAll(".legal__body section[id]").forEach((s) => io.observe(s));
})();
