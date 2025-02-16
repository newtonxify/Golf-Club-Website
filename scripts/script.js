// Add interactivity as needed
// Example: Toggle mobile menu
const navLinks = document.querySelector('.nav-links');
const toggleButton = document.querySelector('.toggle-button-responsive');

toggleButton.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

let slides = document.querySelectorAll(".slide");
let currentSlide = 0;
let slideInterval;

// Function to show a slide
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
    });
    currentSlide = index;
}

// Function to go to the next slide
function nextSlide() {
    let nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
}

// Function to go to the previous slide
function prevSlide() {
    let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
}

// Auto-slide every 4 seconds
function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 4000);
}

// Pause auto-slide on hover
document.querySelector(".slider-container").addEventListener("mouseenter", () => {
    clearInterval(slideInterval);
});

// Resume auto-slide when mouse leaves
document.querySelector(".slider-container").addEventListener("mouseleave", startAutoSlide);

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// Start the slider
startAutoSlide();
