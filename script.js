document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    nav.classList.toggle('visible');
    
});