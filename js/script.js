/* ============================================
   FAISAL FARUKH SAYYED - PORTFOLIO
   Main JavaScript File
   ============================================ */

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// ----- 1. Sticky Navbar Background on Scroll -----
/*
   When user scrolls past 50px, add 'scrolled' class to navbar.
   This adds glassmorphism background + border.
*/
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ----- 2. Mobile Menu Toggle -----
/*
   When hamburger is clicked:
   - Toggle 'active' class on hamburger (morphs to X)
   - Toggle 'active' class on menu (slides in from right)
*/
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// ----- 3. Close Mobile Menu on Link Click -----
/*
   When any nav link is clicked:
   - Remove 'active' from hamburger and menu
   - This closes the mobile menu after navigation
*/
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ----- 4. Active Link Highlighting on Scroll -----
/*
   As user scrolls through sections, highlight the 
   corresponding nav link. Uses IntersectionObserver
   for performance (no constant scroll calculations).
*/
const sections = document.querySelectorAll('section[id]');

const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Remove active from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active to current section's link
            const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

// ============================================
// PARTICLE BACKGROUND ANIMATION
// ============================================

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animationId;

// Configuration
const config = {
    particleCount: window.innerWidth < 768 ? 40 : 80, // Fewer particles on mobile
    connectionDistance: 150,
    mouseDistance: 200,
    speed: 0.5,
    color: '0, 212, 255' // RGB for neon blue
};

// Resize canvas to fill screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Mouse position tracking
let mouse = { x: null, y: null };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * config.speed;
        this.vy = (Math.random() - 0.5) * config.speed;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        // Move particle
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse interaction - particles move away from cursor
        if (mouse.x != null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.mouseDistance) {
                const force = (config.mouseDistance - distance) / config.mouseDistance;
                this.vx -= (dx / distance) * force * 0.02;
                this.vy -= (dy / distance) * force * 0.02;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${config.color}, 0.6)`;
        ctx.fill();
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
    }
}

// Draw connections between nearby particles
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.connectionDistance) {
                const opacity = (1 - distance / config.connectionDistance) * 0.3;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${config.color}, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    drawConnections();
    animationId = requestAnimationFrame(animate);
}

// Start everything
initParticles();
animate();

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================

/*
   Elements with class 'reveal' will fade in and slide up
   when they enter the viewport.
*/
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Stop observing once revealed (animates once)
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

console.log('🚀 Portfolio loaded successfully!');

// ============================================
// TYPING EFFECT
// ============================================

/*
   This creates the "typewriter" effect on the hero title.
   It cycles through different role titles, typing and deleting them.
   This grabs attention and showcases your multiple skills.
*/

const typingElement = document.getElementById('typing-text');
const roles = [
    'Business Intelligence Specialist',
    'Data Analyst',
    'GenAI Professional',
    'Power BI Developer',
    'SQL Expert'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        // Removing characters
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Faster when deleting
    } else {
        // Adding characters
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; // Normal speed when typing
    }

    // Check if word is complete
    if (!isDeleting && charIndex === currentRole.length) {
        // Pause at end of word
        isDeleting = true;
        typingSpeed = 2000; // Wait 2 seconds before deleting
    } else if (isDeleting && charIndex === 0) {
        // Move to next word
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect when page loads
document.addEventListener('DOMContentLoaded', typeEffect);

// ============================================
// STATS COUNTER ANIMATION
// ============================================

/*
   Animates numbers counting up when they scroll into view.
   Creates a dynamic, engaging visual effect.
*/

const statNumbers = document.querySelectorAll('.stat-number');

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current);
    }, 16);
}

// ============================================
// SKILL BAR ANIMATION
// ============================================

/*
   Animates skill progress bars when they scroll into view.
   The width starts at 0 and animates to the data-width value.
*/

const skillProgressBars = document.querySelectorAll('.skill-progress');

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.getAttribute('data-width');
            entry.target.style.width = width + '%';
            entry.target.classList.add('animate');
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

skillProgressBars.forEach(bar => skillsObserver.observe(bar));

// ============================================
// CONTACT FORM HANDLING
// ============================================

/*
   Since this is a static site (HTML/CSS/JS only), we can't actually send emails.
   This script shows a success message and opens the user's email client
   with a pre-filled message as a fallback.
*/

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Create mailto link as fallback
        const mailtoLink = `mailto:your.email@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        )}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show confirmation
        const btn = contactForm.querySelector('.form-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Message Ready!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}