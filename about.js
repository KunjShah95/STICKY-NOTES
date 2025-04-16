// Simple script for the About page
document.addEventListener('DOMContentLoaded', () => {
    // Add any interactive elements or animations for the About page
    
    // Example: Add a simple animation to the image
    const aboutImage = document.querySelector('.about-image img');
    if (aboutImage) {
        aboutImage.addEventListener('mouseenter', () => {
            aboutImage.style.transform = 'scale(1.05)';
            aboutImage.style.transition = 'transform 0.3s ease';
        });
        
        aboutImage.addEventListener('mouseleave', () => {
            aboutImage.style.transform = 'scale(1)';
        });
    }
    
    // Create a "back to top" button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.title = 'Back to top';
    document.body.appendChild(backToTopBtn);
    
    // Show/hide the button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add style for the back to top button
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.7);
            border: none;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            font-size: 20px;
            z-index: 1000;
            backdrop-filter: blur(5px);
        }
        
        .back-to-top.visible {
            opacity: 1;
        }
        
        .back-to-top:hover {
            transform: translateY(-5px);
            background-color: rgba(255, 255, 255, 0.9);
        }
    `;
    document.head.appendChild(style);
});