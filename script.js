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

    offset += s;
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

  if (!isMobile()) apply();
}

/* ======================
   CAROUSEL DOTS (mobile)
====================== */
const carouselContainer = document.querySelector(".carousel-container");
const carouselItems = Array.from(document.querySelectorAll(".carousel-item"));
const dotsWrap = document.querySelector(".carousel-dots");

if (carouselContainer && dotsWrap && carouselItems.length) {
  dotsWrap.innerHTML = "";
  const dots = carouselItems.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Go to image ${i + 1}`);
    b.addEventListener("click", () => {
      carouselItems[i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
    dotsWrap.appendChild(b);
    return b;
  });

  const setActive = () => {
    const center = carouselContainer.scrollLeft + carouselContainer.clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;

    carouselItems.forEach((item, i) => {
      const itemCenter = item.offsetLeft + item.clientWidth / 2;
      const dist = Math.abs(center - itemCenter);
      if (dist < bestDist) { bestDist = dist; bestIdx = i; }
    });

    dots.forEach((d, i) =>
      d.setAttribute("aria-current", i === bestIdx ? "true" : "false")
    );
  };

  carouselContainer.addEventListener("scroll", () => requestAnimationFrame(setActive), { passive: true });
  window.addEventListener("resize", setActive);
  setActive();
}

/* ======================
   CAROUSEL -> GRID MODAL -> VIEWER
====================== */
const carouselImgs = Array.from(document.querySelectorAll(".carousel-item img"));

const modal = document.querySelector(".gallery-modal");
const backdrop = document.querySelector(".gm-backdrop");
const grid = document.querySelector(".gm-grid");
const viewer = document.querySelector(".gm-viewer");
const bigImg = document.querySelector(".gm-img");
const caption = document.querySelector(".gm-caption");

const btnClose = document.querySelector(".gm-close");
const btnBack = document.querySelector(".gm-back");
const btnPrev = document.querySelector(".gm-prev");
const btnNext = document.querySelector(".gm-next");

if (carouselImgs.length && modal && grid && viewer && bigImg && btnClose && btnBack && btnPrev && btnNext) {
  const images = carouselImgs.map(img => ({
    src: img.getAttribute("src"),
    alt: img.getAttribute("alt") || ""
  }));

  // Build grid thumbs
  grid.innerHTML = "";
  images.forEach((im, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "gm-thumb";
    b.setAttribute("aria-label", `Open image ${i + 1}`);

    const t = document.createElement("img");
    t.src = im.src;
    t.alt = im.alt;

    b.appendChild(t);
    b.addEventListener("click", () => openViewer(i));
    grid.appendChild(b);
  });

  let index = 0;

  const openGrid = () => {
    grid.hidden = false;
    viewer.hidden = true;
    btnBack.hidden = true;
  };

  const openModal = () => {
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    openGrid();
  };

  const closeModal = () => {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    bigImg.src = "";
    caption.textContent = "";
  };

  function openViewer(i) {
    index = i;
    grid.hidden = true;
    viewer.hidden = false;
    btnBack.hidden = false;

    bigImg.src = images[index].src;
    bigImg.alt = images[index].alt;
    caption.textContent = images[index].alt;
  }

  const prev = () => openViewer((index - 1 + images.length) % images.length);
  const next = () => openViewer((index + 1) % images.length);

  // Clicking any carousel image opens the modal
  carouselImgs.forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", openModal);
  });

  // Controls
  btnClose.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  btnBack.addEventListener("click", openGrid);
  btnPrev.addEventListener("click", prev);
  btnNext.addEventListener("click", next);

  // Keyboard
  window.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") closeModal();
    if (!viewer.hidden && e.key === "ArrowLeft") prev();
    if (!viewer.hidden && e.key === "ArrowRight") next();
  });

  // Swipe (viewer mode)
  let startX = 0;
  viewer.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  viewer.addEventListener("touchend", (e) => {
    if (viewer.hidden) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) < 40) return;
    dx > 0 ? prev() : next();
  }, { passive: true });
} else {
  // Helpful debug if something is missing
  console.warn("[GalleryModal] Not initialised", {
    imgs: carouselImgs.length,
    modal: !!modal,
    grid: !!grid,
    viewer: !!viewer
  });
}
