const THEME_KEY = "theme-preference";
const rootEl = document.documentElement;
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const backToTop = document.getElementById("back-to-top");
const revealEls = document.querySelectorAll(".reveal");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = Array.from(document.querySelectorAll("main .section"));

function applyTheme(theme) {
  if (theme === "dark") {
    rootEl.setAttribute("data-theme", "dark");
    themeIcon.textContent = "☀️";
  } else {
    rootEl.removeAttribute("data-theme");
    themeIcon.textContent = "🌙";
  }
}

function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    applyTheme(saved);
    return;
  }

  applyTheme("light");
}

function toggleTheme() {
  const isDark = rootEl.getAttribute("data-theme") === "dark";
  const nextTheme = isDark ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);
}

themeToggleBtn.addEventListener("click", toggleTheme);
loadTheme();

function updateBackToTop() {
  backToTop.style.display = window.scrollY > 500 ? "flex" : "none";
}

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
window.addEventListener("scroll", updateBackToTop);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: "0px 0px -6% 0px"
});

revealEls.forEach((el) => revealObserver.observe(el));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const id = entry.target.id;
    const matchingLink = document.querySelector(`a.nav-link[data-target="${id}"]`);

    if (entry.isIntersecting) {
      navLinks.forEach((link) => link.classList.remove("active"));
      if (matchingLink) matchingLink.classList.add("active");
    }
  });
}, {
  threshold: 0.45,
  rootMargin: "0px 0px -10% 0px"
});

sections.forEach((section) => sectionObserver.observe(section));

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetId = link.dataset.target;
    const target = document.getElementById(targetId);

    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }

    navLinks.forEach((navLink) => navLink.classList.remove("active"));
    link.classList.add("active");
  });
});

updateBackToTop();
