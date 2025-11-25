// Innerpeacecollection Linktree - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Animate elements on scroll
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
    
    // Observe all link items for scroll animations
    const linkItems = document.querySelectorAll('.link-item');
    linkItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    // Add click analytics (you can replace with your analytics service)
    linkItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            const linkTitle = this.querySelector('h3').textContent;
            console.log(`Link clicked: ${linkTitle}`);
            
            // Add a subtle click effect
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // You can add Google Analytics or other tracking here
            // gtag('event', 'click', {
            //     'event_category': 'Link',
            //     'event_label': linkTitle
            // });
        });
    });
    
    // Add hover effects for social links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1) rotate(5deg)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        });
    });
    
    // Add a subtle parallax effect to the background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.body;
        const speed = scrolled * 0.5;
        
        parallax.style.backgroundPosition = `center ${speed}px`;
    });
    
    // Add floating animation to profile image
    const profileImage = document.querySelector('.profile-image img');
    if (profileImage) {
        let floatDirection = 1;
        setInterval(() => {
            const currentTransform = profileImage.style.transform || '';
            const translateY = floatDirection * 3;
            profileImage.style.transform = `${currentTransform} translateY(${translateY}px)`;
            floatDirection *= -1;
        }, 2000);
    }
    
    // Add sparkle effect on special links
    const specialLinks = document.querySelectorAll('.link-item.special');
    specialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            createSparkles(this);
        });
    });
    
    function createSparkles(element) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.innerHTML = '✨';
                sparkle.style.position = 'absolute';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.fontSize = '12px';
                sparkle.style.zIndex = '1000';
                
                const rect = element.getBoundingClientRect();
                sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
                sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
                
                document.body.appendChild(sparkle);
                
                // Animate sparkle
                sparkle.animate([
                    { transform: 'translateY(0px) scale(0)', opacity: 1 },
                    { transform: 'translateY(-20px) scale(1)', opacity: 0 }
                ], {
                    duration: 1000,
                    easing: 'ease-out'
                }).onfinish = () => sparkle.remove();
                
            }, i * 100);
        }
    }
    
    // Add loading animation
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        container.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
    
    // Add copy link functionality (for sharing)
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Link copied to clipboard! 💜');
        });
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #f2c2f3, #e879f9);
            color: #581c87;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Performance optimization: Lazy load images
    const images = document.querySelectorAll('img[src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                
                const tempImg = new Image();
                tempImg.onload = () => {
                    img.style.opacity = '1';
                };
                tempImg.src = img.src;
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    console.log('✨ Innerpeacecollection Linktree loaded successfully! ✨');
});
