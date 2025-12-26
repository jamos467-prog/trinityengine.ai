// UI Showcase Lightbox Functionality

document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const zoomButtons = document.querySelectorAll('.ui-card-zoom');
    
    // Open lightbox
    zoomButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.ui-card');
            const img = card.querySelector('.ui-card-image img');
            const title = card.querySelector('.ui-card-title').textContent;
            const description = card.querySelector('.ui-card-description').textContent;
            
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxCaption.textContent = `${title} - ${description}`;
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    function closeLightbox() {
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        lightboxImage.src = '';
        lightboxCaption.textContent = '';
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') {
            closeLightbox();
        }
    });
    
    // Also allow clicking the card image to open lightbox
    document.querySelectorAll('.ui-card-image img').forEach(img => {
        img.addEventListener('click', function() {
            const card = this.closest('.ui-card');
            const title = card.querySelector('.ui-card-title').textContent;
            const description = card.querySelector('.ui-card-description').textContent;
            
            lightboxImage.src = this.src;
            lightboxImage.alt = this.alt;
            lightboxCaption.textContent = `${title} - ${description}`;
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
        
        // Add cursor pointer
        img.style.cursor = 'pointer';
    });
});

