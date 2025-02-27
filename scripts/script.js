// Add interactivity as needed
const navLinks = document.querySelector('.nav-links');
const toggleButton = document.querySelector('.toggle-button-responsive');

toggleButton.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

let slides = document.querySelectorAll(".slide");
let currentSlide = 0;
let slideInterval;

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
