document.addEventListener('DOMContentLoaded', () => {
    // Preloader Logic
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader-wrapper');
        if (loader) {
            loader.classList.add('loaded');
        }
    });

    // Initialize AOS Animation Library
    // Ensure animations only run once per session for better performance
    const isFirstLoad = !sessionStorage.getItem('aos-initialized');
    AOS.init({
        duration: 800,
        easing: 'ease-out-back',
        once: true,
        offset: 120,
        delay: 50,
        disable: !isFirstLoad
    });
    if (isFirstLoad) sessionStorage.setItem('aos-initialized', 'true');

    // Navbar scroll effect (Hide on scroll down, show on scroll up)
    const navbar = document.querySelector('.custom-navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;

                // Add 'scrolled' class for background effect
                if (currentScrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Hide/Show logic
                if (currentScrollY > lastScrollY && currentScrollY > 150) {
                    navbar.classList.add('navbar-hidden');
                } else {
                    navbar.classList.remove('navbar-hidden');
                }

                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Intersection Observer for Scroll-Spy (Active link update on scroll)
    const observerOptions = {
        root: null,
        rootMargin: '-25% 0px -70% 0px', // Triggers when section occupies the top-middle of viewport
        threshold: 0
    };

    // Cache nav links for observer performance
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);

    // Observe all sections that have an ID
    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            if (href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    // Immediate active state switch
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    this.classList.add('active');

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

    // Subtle Card Tilt Effect - Performance: Only enable for devices with a mouse
    if (window.matchMedia('(pointer: fine)').matches) {
        const tiltCards = document.querySelectorAll('.service-card, .workflow-step-card');
        tiltCards.forEach(card => {
            let isMoving = false;
            card.addEventListener('mousemove', (e) => {
                if (isMoving) return;
                isMoving = true;
                window.requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = (y - centerY) / 35;
                    const rotateY = (centerX - x) / 35;

                    card.style.transition = 'transform 0.2s cubic-bezier(0.03, 0.98, 0.52, 0.99)';
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
                    isMoving = false;
                });
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    }

    // Custom Dropdown Initialization and Interaction Logic
    const initCustomDropdowns = () => {
        const dropdowns = document.querySelectorAll('.custom-dropdown-container');
        
        dropdowns.forEach(dropdown => {
            const display = dropdown.querySelector('.custom-dropdown-display');
            const optionsList = dropdown.querySelector('.custom-dropdown-options');
            const hiddenSelect = dropdown.querySelector('select');
            
            if (!display || !optionsList || !hiddenSelect) return;

            // Populate custom options from the hidden native select
            optionsList.innerHTML = '';
            Array.from(hiddenSelect.options).forEach(opt => {
                if (opt.disabled) return;
                const li = document.createElement('li');
                li.textContent = opt.textContent;
                li.setAttribute('data-value', opt.value);
                optionsList.appendChild(li);
            });

            // Handle display click to open/close dropdown
            display.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = optionsList.classList.contains('show');
                
                // Close any other open dropdowns first
                document.querySelectorAll('.custom-dropdown-options.show').forEach(el => el.classList.remove('show'));
                document.querySelectorAll('.custom-dropdown-display.active').forEach(el => el.classList.remove('active'));
                document.querySelectorAll('.custom-dropdown-container.dropdown-active').forEach(el => el.classList.remove('dropdown-active'));
                
                if (!isOpen) {
                    optionsList.classList.add('show');
                    display.classList.add('active');
                    dropdown.classList.add('dropdown-active');
                }
            });

            // Handle option selection
            optionsList.addEventListener('click', (e) => {
                const li = e.target.closest('li');
                if (li) {
                    const value = li.getAttribute('data-value');
                    const text = li.textContent;
                    
                    display.textContent = text;
                    hiddenSelect.value = value;
                    
                    // Update visual state and floating label
                    dropdown.classList.add('dropdown-selected');
                    optionsList.classList.remove('show');
                    display.classList.remove('active');
                    dropdown.classList.remove('dropdown-active');
                    
                    optionsList.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
                    li.classList.add('selected');
                    
                    // Trigger change event for potential validation logic
                    hiddenSelect.dispatchEvent(new Event('change'));
                }
            });
        });

        // Global listener to close dropdown when clicking outside
        document.addEventListener('click', () => {
            document.querySelectorAll('.custom-dropdown-options').forEach(el => el.classList.remove('show'));
            document.querySelectorAll('.custom-dropdown-display').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.custom-dropdown-container').forEach(el => el.classList.remove('dropdown-active'));
        });
    };

    initCustomDropdowns();

    // Dynamically set current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
