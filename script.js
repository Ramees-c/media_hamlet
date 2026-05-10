document.addEventListener('DOMContentLoaded', () => {
    // Preloader Logic
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader-wrapper');
        if (loader) {
            loader.classList.add('loaded');
        }
    });

    // Initialize AOS Animation Library
    AOS.init({
        duration: 1000,
        easing: 'ease-out-quart',
        once: true,
        offset: 120,
    });

    // Navbar scroll effect (Hide on scroll down, show on scroll up)
    const navbar = document.querySelector('.custom-navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Add 'scrolled' class for background effect
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/Show logic
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
            // Scrolling down & not at the top - hide navbar
            navbar.classList.add('navbar-hidden');
        } else {
            // Scrolling up or at the top - show navbar
            navbar.classList.remove('navbar-hidden');
        }

        lastScrollY = currentScrollY;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            if (href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    // Calculate offset for fixed navbar
                    const offset = 100; // Increased to account for the floating navbar margin
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            }
        });
    });

    // Portfolio Lightbox Logic
    const lightbox = document.getElementById('portfolioLightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        const lightboxTitle = lightbox.querySelector('.lightbox-title');
        const lightboxCategory = lightbox.querySelector('.lightbox-category');
        const lightboxClose = lightbox.querySelector('.lightbox-close');

        document.querySelectorAll('.portfolio-card').forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                const title = card.querySelector('h4').textContent;
                const category = card.querySelector('.category').textContent;

                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                if (lightboxTitle) lightboxTitle.textContent = title;
                if (lightboxCategory) lightboxCategory.textContent = category;

                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
        });
    }

    // Cursor Glow Logic
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            cursorGlow.style.left = `${clientX}px`;
            cursorGlow.style.top = `${clientY}px`;
        });
    }

    // Subtle Card Tilt Effect
    const tiltCards = document.querySelectorAll('.service-card, .workflow-step-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transition = 'transform 0.1s ease-out';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

});
