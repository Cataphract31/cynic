/**
 * DIOGENES' DOG ($CYNIC) - Interactive JavaScript
 * Features: Custom lantern cursor, hidden text reveal, mobile navigation
 */

document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const lanternCursor = document.getElementById('lanternCursor');
    const hiddenTexts = document.querySelectorAll('[data-reveal]');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Configuration
    const REVEAL_DISTANCE = 150; // pixels from cursor to reveal text
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isTouch = 'ontouchstart' in window;

    // ==========================================
    // LANTERN CURSOR (Desktop Only)
    // ==========================================

    if (!isMobile && !isTouch) {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        // Track mouse position
        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor following with animation frame
        function animateCursor() {
            // Smooth interpolation for lantern movement
            const ease = 0.15;
            currentX += (mouseX - currentX) * ease;
            currentY += (mouseY - currentY) * ease;

            lanternCursor.style.left = currentX + 'px';
            lanternCursor.style.top = currentY + 'px';

            // Check proximity to hidden text elements
            checkProximity(mouseX, mouseY);

            requestAnimationFrame(animateCursor);
        }

        // Start animation
        animateCursor();

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', function () {
            lanternCursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', function () {
            lanternCursor.style.opacity = '1';
        });
    }

    // ==========================================
    // HIDDEN TEXT REVEAL
    // ==========================================

    function checkProximity(x, y) {
        hiddenTexts.forEach(function (element) {
            const rect = element.getBoundingClientRect();
            const elementCenterX = rect.left + rect.width / 2;
            const elementCenterY = rect.top + rect.height / 2;

            // Calculate distance from cursor to element center
            const distance = Math.sqrt(
                Math.pow(x - elementCenterX, 2) +
                Math.pow(y - elementCenterY, 2)
            );

            // Reveal if within range
            if (distance < REVEAL_DISTANCE) {
                element.classList.add('revealed');
            } else {
                element.classList.remove('revealed');
            }
        });
    }

    // ==========================================
    // MOBILE TOUCH REVEAL
    // ==========================================

    if (isTouch || isMobile) {
        // On mobile, reveal on tap
        hiddenTexts.forEach(function (element) {
            // For fixed position elements, hide them on mobile
            if (element.style.position === 'fixed' ||
                window.getComputedStyle(element).position === 'fixed') {
                element.style.display = 'none';
            }
        });

        // Touch event for inline hidden text
        document.addEventListener('touchstart', function (e) {
            const touch = e.touches[0];
            hiddenTexts.forEach(function (element) {
                if (element.classList.contains('hidden-text-inline')) {
                    const rect = element.getBoundingClientRect();
                    const distance = Math.sqrt(
                        Math.pow(touch.clientX - (rect.left + rect.width / 2), 2) +
                        Math.pow(touch.clientY - (rect.top + rect.height / 2), 2)
                    );
                    if (distance < 100) {
                        element.classList.add('revealed');
                    }
                }
            });
        });
    }

    // ==========================================
    // MOBILE NAVIGATION
    // ==========================================

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // PARALLAX EFFECT ON HERO (Subtle)
    // ==========================================

    const heroImage = document.querySelector('.hero-image');

    if (heroImage && !isTouch) {
        window.addEventListener('scroll', function () {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;

            if (scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${rate}px) scale(${1 - scrolled * 0.0002})`;
            }
        });
    }

    // ==========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ==========================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards and sections
    document.querySelectorAll('.philosophy-card, .token-stat, .manifesto-block, .social-link').forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });

    // Add visible class handler
    const style = document.createElement('style');
    style.textContent = '.fade-in-visible { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);

    // ==========================================
    // EASTER EGG: Konami Code
    // ==========================================

    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', function (e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Easter egg: Show all hidden texts
                hiddenTexts.forEach(function (el) {
                    el.classList.add('revealed');
                });
                konamiIndex = 0;
                console.log('🔦 The lantern reveals all truths...');
            }
        } else {
            konamiIndex = 0;
        }
    });

    console.log('🐕 Diogenes\' Dog says: "I am looking for an honest developer..."');
});
