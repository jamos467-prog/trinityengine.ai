// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 18, 35, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(10, 18, 35, 0.8)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards and process steps
document.querySelectorAll('.feature-card, .process-step, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// CTA form handling
const ctaForm = document.querySelector('.cta-form');
if (ctaForm) {
    const form = ctaForm.querySelector('form') || ctaForm;
    const input = form.querySelector('.cta-input');
    const button = form.querySelector('.btn-primary-large') || form.querySelector('button');
    
    if (button) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (input && input.value) {
                // Here you would typically send the email to your backend
                alert('Thank you! We\'ll be in touch soon.');
                input.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
}

// Add parallax effect to hero visual
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const visualContainer = document.querySelector('.visual-container');
    if (visualContainer && scrolled < window.innerHeight) {
        visualContainer.style.transform = `translateY(${scrolled * 0.3}px)`;
        visualContainer.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
});

// Add glow effect on hover for feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 30px rgba(51, 231, 255, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});

