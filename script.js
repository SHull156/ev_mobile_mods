document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    nav.classList.toggle('visible');
    
});

//carousel
const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-button.prev');
const nextBtn = document.querySelector('.carousel-button.next');

let index = 0;
const itemWidth = document.querySelector('.carousel-item').offsetWidth + 16;

nextBtn.addEventListener('click', () => {
    if (index < track.children.length - 3) {
        index++;
        track.style.transform = `translateX(-${index * itemWidth}px)`;
    }
});

prevBtn.addEventListener('click', () => {
    if (index > 0) {
        index--;
        track.style.transform = `translateX(-${index * itemWidth}px)`;
    }
});

//swipe for touch screen

let startX = 0;
let currentX = 0;
let isDragging = false;

track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
});

track.addEventListener('touchmove', e => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
});

track.addEventListener('touchend', e => {
    if (!isDragging) return;
    const deltaX = startX - currentX;
    if (deltaX > 50) nextBtn.click();
    if (deltaX <- 50) prevBtn.click();
    isDragging = false;
});

