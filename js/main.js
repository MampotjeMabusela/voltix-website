document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabId = btn.dataset.tab;
    if (!tabId) return;

    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(tabId)?.classList.add("active");
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

const scrollIndicator = document.querySelector(".scroll-indicator");
scrollIndicator?.addEventListener("click", () => {
  const next = document.querySelector(".hero + section, .hero ~ .section");
  next?.scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll("[data-scroll-target]").forEach((el) => {
  el.addEventListener("click", () => {
    const target = document.querySelector(el.dataset.scrollTarget);
    target?.scrollIntoView({ behavior: "smooth" });
  });
});

const yearEl = document.getElementById("currentYear");
if (yearEl) yearEl.textContent = new Date().getFullYear();
