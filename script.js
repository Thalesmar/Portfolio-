document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const menuContainer = document.querySelector('.menu-container');
    const menuLinks = document.querySelectorAll('.menu a');
    const body = document.body;

    // Toggle menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menuContainer.classList.toggle('active');
        body.style.overflow = menuContainer.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            menuContainer.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menuContainer.classList.contains('active') && 
            !menuContainer.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            menuContainer.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Prevent menu from closing when clicking inside
    menuContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Smooth scroll with header offset
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const menuContainer = document.querySelector('.menu-container');
                if (menuContainer.classList.contains('active')) {
                    menuContainer.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.menu a');

    function highlightNavigation() {
        const scrollPos = window.scrollY + headerHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    const paragraphs = document.querySelectorAll('.about-text p');
    
    // Track which paragraphs have reached full opacity
    const fullyVisible = new Set();
    
    // Set initial opacity
    paragraphs.forEach(p => {
        p.style.opacity = '1';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const paragraph = entry.target;
            
            if (entry.isIntersecting) {
                paragraph.style.opacity = '1';
                fullyVisible.add(paragraph); // Add to set of fully visible paragraphs
            } else {
                // Only reduce opacity if it hasn't been fully visible before
                if (!fullyVisible.has(paragraph)) {
                    paragraph.style.opacity = '0.5';
                }
            }
        });
    }, {
        threshold: 0.7, // Increased threshold for better trigger point
        rootMargin: '-10% 0px -10% 0px'
    });

    // Observe all paragraphs
    paragraphs.forEach(paragraph => {
        observer.observe(paragraph);
    });

    // Smooth scroll animation
    let ticking = false;
    document.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                paragraphs.forEach(p => {
                    // Skip animation if paragraph is already fully visible
                    if (!fullyVisible.has(p)) {
                        const rect = p.getBoundingClientRect();
                        const elementCenter = rect.top + (rect.height / 2);
                        const windowCenter = window.innerHeight / 2;
                        const distanceFromCenter = Math.abs(elementCenter - windowCenter);
                        const maxDistance = window.innerHeight / 2;
                        
                        let opacity = 1 - (distanceFromCenter / maxDistance);
                        opacity = Math.max(0.5, opacity);
                        
                        // If opacity reaches 1, add to fully visible set
                        if (opacity >= 0.95) {
                            fullyVisible.add(p);
                            p.style.opacity = '1';
                        } else if (!fullyVisible.has(p)) {
                            p.style.opacity = opacity;
                        }
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    });
});
