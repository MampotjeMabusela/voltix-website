const observerOptions = {
  threshold: 0.12,
  rootMargin: "0px 0px -60px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document
  .querySelectorAll(
    ".section, .service-card, .stat-card, .split-content, .split-image, .timeline-phase, .mini-feature, .contact-info-card"
  )
  .forEach((el) => observer.observe(el));
