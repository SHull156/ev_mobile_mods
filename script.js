document.getElementById("year").textContent = new Date().getFullYear();

/* ======================
   MOBILE NAV
====================== */
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", (e) => {
    e.preventDefault();
    nav.classList.toggle("visible");
    menuToggle.classList.toggle("open");
  });
}

/* ======================
   CAROUSEL
   Desktop: buttons + transform
   Mobile: native scroll + snap (no JS movement)
====================== */
// carousel (desktop: transform, mobile: native scroll-snap)
// carousel (desktop: transform, mobile: native scroll-snap)
const track = document.querySelector(".carousel-track");
const container = document.querySelector(".carousel-container");
const prevBtn = document.querySelector(".carousel-button.prev");
const nextBtn = document.querySelector(".carousel-button.next");

if (track && container && prevBtn && nextBtn) {
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  let offset = 0; // pixels

  const gap = () => parseFloat(getComputedStyle(track).gap) || 0;

  const step = () => {
    const item = track.querySelector(".carousel-item");
    if (!item) return 0;
    return item.getBoundingClientRect().width + gap();
  };

  const maxTranslate = () =>
    Math.max(0, track.scrollWidth - container.clientWidth);

  const apply = () => {
    if (isMobile()) return; // mobile uses native scroll
    const max = maxTranslate();
    offset = Math.max(0, Math.min(offset, max));
    track.style.transform = `translateX(-${offset}px)`;
  };

  const next = () => {
    if (isMobile()) return;
    const s = step();
    const max = maxTranslate();
    if (!s) return;

    // Move one card
    offset += s;

    // If we're close to the end, snap exactly to the end
    if (max - offset < s * 0.35) offset = max;

    apply();
  };

  const prev = () => {
    if (isMobile()) return;
    const s = step();
    if (!s) return;

    offset -= s;
    if (offset < s * 0.35) offset = 0;

    apply();
  };

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  window.addEventListener("resize", () => {
    if (isMobile()) {
      track.style.transform = "";
      offset = 0;
    } else {
      apply();
    }
  });

  // init
  if (!isMobile()) apply();
}
