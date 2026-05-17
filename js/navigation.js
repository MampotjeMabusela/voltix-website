const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuClose = document.getElementById("mobileMenuClose");

function closeMobileMenu() {
  mobileMenu?.classList.remove("active");
  mobileMenuToggle?.classList.remove("active");
  document.body.style.overflow = "";
}

if (mobileMenuToggle && mobileMenu) {
  mobileMenuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("active");
    mobileMenuToggle.classList.toggle("active", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
}

mobileMenuClose?.addEventListener("click", closeMobileMenu);

document.querySelectorAll(".mobile-menu-items a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

function updateActiveNav() {
  const currentPath =
    window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.remove("active");

    if (
      href === currentPath ||
      (href === "index.html" &&
        (currentPath === "" || currentPath === "index.html"))
    ) {
      link.classList.add("active");
    }
  });
}

updateActiveNav();

let lastScroll = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener(
  "scroll",
  () => {
    const current = window.scrollY;
    if (!navbar) return;

    if (current > 80) {
      navbar.style.boxShadow = "0 4px 24px rgba(0,0,0,0.5)";
    } else {
      navbar.style.boxShadow = "";
    }
    lastScroll = current;
  },
  { passive: true }
);
