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
    const button = form.querySelector('.btn-secondary-large') || form.querySelector('.btn-primary-large') || form.querySelector('button');
    
    if (button) {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (!input || !input.value.trim()) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            const email = input.value.trim();
            const originalButtonText = button.textContent;
            
            // Show loading state
            button.disabled = true;
            button.textContent = 'Joining...';
            
            try {
                // Use Cloud Function URL if available, otherwise fallback to local API
                const apiUrl = window.WAITLIST_API_URL || '/api/waitlist';
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showFormMessage(data.message, 'success');
                    input.value = '';
                } else {
                    showFormMessage(data.message || 'An error occurred. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error submitting waitlist:', error);
                showFormMessage('Unable to connect to server. Please try again later.', 'error');
            } finally {
                // Reset button state
                button.disabled = false;
                button.textContent = originalButtonText;
            }
        });
        
        // Allow Enter key to submit
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    button.click();
                }
            });
        }
    }
}

// Show form message (success or error)
function showFormMessage(message, type) {
    const ctaForm = document.querySelector('.cta-form');
    if (!ctaForm) return;
    
    // Remove existing message
    const existingMessage = ctaForm.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageEl = document.createElement('p');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        margin-top: 1rem;
        padding: 0.75rem 1rem;
        border-radius: 6px;
        font-size: 0.9rem;
        ${type === 'success' 
            ? 'background: rgba(51, 231, 255, 0.1); color: #33e7ff; border: 1px solid rgba(51, 231, 255, 0.3);' 
            : 'background: rgba(255, 77, 77, 0.1); color: #ff4d4d; border: 1px solid rgba(255, 77, 77, 0.3);'}
    `;
    
    // Insert after the form
    ctaForm.appendChild(messageEl);
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
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

