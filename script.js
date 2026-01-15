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
const track = document.querySelector(".carousel-track");
const container = document.querySelector(".carousel-container");
const prevBtn = document.querySelector(".carousel-button.prev");
const nextBtn = document.querySelector(".carousel-button.next");

if (track && container && prevBtn && nextBtn) {
  // Helper: are we in mobile layout?
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  let index = 0;

  const getStep = () => {
    const firstItem = document.querySelector(".carousel-item");
    if (!firstItem) return 0;

    // Actual rendered width + gap
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return firstItem.getBoundingClientRect().width + gap;
  };

  const maxIndex = () => {
    // How many full items can fit in the container (desktop)
    const step = getStep();
    if (!step) return 0;
    const visibleCount = Math.max(1, Math.floor(container.clientWidth / step));
    return Math.max(0, track.children.length - visibleCount);
  };

  const applyTransform = () => {
    // Only desktop uses transform movement
    if (isMobile()) return;
    const step = getStep();
    track.style.transform = `translateX(-${index * step}px)`;
  };

  const clampIndex = () => {
    index = Math.max(0, Math.min(index, maxIndex()));
  };

  // Button handlers (desktop only)
  nextBtn.addEventListener("click", () => {
    if (isMobile()) return;
    index++;
    clampIndex();
    applyTransform();
  });

  prevBtn.addEventListener("click", () => {
    if (isMobile()) return;
    index--;
    clampIndex();
    applyTransform();
  });

  // On resize, reset correctly (especially when switching mobile/desktop)
  window.addEventListener("resize", () => {
    if (isMobile()) {
      // Let native scrolling handle it on mobile
      track.style.transform = "";
      index = 0;
    } else {
      clampIndex();
      applyTransform();
    }
  });

  // Initial setup
  if (isMobile()) {
    track.style.transform = "";
  } else {
    applyTransform();
  }
}
