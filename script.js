document.addEventListener('DOMContentLoaded', () => {
    // Preloader Logic
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader-wrapper');
        if (loader) {
            loader.classList.add('loaded');
        }

        // Initialize Draggable Infinite Sliders
        const draggables = document.querySelectorAll('.portfolio-track, .testimonial-slider-track, .logos-ticker, .team-slider-track');
        
        draggables.forEach(track => {
            track.style.animation = 'none';
            
            let isDown = false;
            let isHovered = false;
            let startX;
            let currentX = 0;
            let hasDragged = false;
            
            let isRight = track.classList.contains('track-right');
            let duration = 30;
            if (track.classList.contains('track-left') || track.classList.contains('track-right')) duration = 25;
            else if (track.classList.contains('testimonial-slider-track')) duration = 40;
            else if (track.classList.contains('team-slider-track')) duration = 50;
            
            let speedDirection = isRight ? 1 : -1;
            
            let startY = 0;
            let isDraggingHorizontally = false;
            
            let baseCursor = track.classList.contains('portfolio-track') ? 'grab' : 'auto';
            let dragCursor = track.classList.contains('portfolio-track') ? 'grabbing' : 'auto';
            
            track.style.cursor = baseCursor;
            
            track.addEventListener('mousedown', (e) => {
                isDown = true;
                hasDragged = false;
                startX = e.pageX;
                track.style.cursor = dragCursor;
            });
            
            track.addEventListener('mouseenter', () => isHovered = true);
            
            track.addEventListener('mouseleave', () => {
                isHovered = false;
                if (isDown) {
                    isDown = false;
                    track.style.cursor = baseCursor;
                }
            });
            
            window.addEventListener('mouseup', () => {
                if (isDown) {
                    isDown = false;
                    track.style.cursor = baseCursor;
                }
            });
            
            window.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX;
                const walk = (x - startX);
                if (Math.abs(walk) > 3) hasDragged = true;
                startX = x;
                currentX += walk;
            });
            
            track.addEventListener('touchstart', (e) => {
                isDown = true;
                hasDragged = false;
                startX = e.touches[0].pageX;
                startY = e.touches[0].pageY;
                isDraggingHorizontally = false;
            }, {passive: true});
            
            window.addEventListener('touchend', () => {
                isDown = false;
            });
            
            window.addEventListener('touchmove', (e) => {
                if (!isDown) return;
                
                const x = e.touches[0].pageX;
                const y = e.touches[0].pageY;
                
                if (!isDraggingHorizontally) {
                    if (Math.abs(x - startX) > Math.abs(y - startY)) {
                        isDraggingHorizontally = true;
                    } else {
                        isDown = false;
                        return;
                    }
                }
                
                if (isDraggingHorizontally && e.cancelable) {
                    e.preventDefault();
                }
                
                const walk = (x - startX);
                if (Math.abs(walk) > 3) hasDragged = true;
                startX = x;
                currentX += walk;
            }, {passive: false});

            track.addEventListener('click', (e) => {
                if (hasDragged) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, {capture: true});

            track.querySelectorAll('img, a').forEach(el => {
                el.addEventListener('dragstart', (e) => e.preventDefault());
            });

            let lastTime = performance.now();

            function update(time) {
                const deltaTime = time - lastTime;
                lastTime = time;
                
                const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
                const totalWidth = track.scrollWidth;
                const halfWidth = (totalWidth + gap) / 2;
                
                if (halfWidth > 0) {
                    const speed_px_per_ms = halfWidth / (duration * 1000);
                    
                    if (!isDown && !isHovered) {
                        currentX += speedDirection * speed_px_per_ms * deltaTime;
                    }
                    
                    if (currentX <= -halfWidth) {
                        currentX = currentX % halfWidth;
                    } else if (currentX > 0) {
                        currentX = (currentX % halfWidth) - halfWidth;
                    }
                    
                    track.style.transform = `translate3d(${currentX}px, 0, 0)`;
                }
                requestAnimationFrame(update);
            }
            
            requestAnimationFrame(update);
        });
    });

    // Initialize AOS Animation Library
    // Ensure animations only run once per session for better performance
    AOS.init({
        duration: 800,
        easing: 'ease-out-back',
        once: true,
        offset: 50, // Reduced offset for better reliability on small mobile screens
        delay: 50,
        disable: false // Always enable AOS so elements don't stay hidden on refresh
    });

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
        const lightboxClose = lightbox.querySelector('.lightbox-close');

        document.querySelectorAll('.portfolio-card').forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');

                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;

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
        const tiltCards = document.querySelectorAll('.service-card');
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
                    dropdown.classList.remove('dropdown-invalid');
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
                    dropdown.classList.remove('dropdown-invalid');
                    
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

    // Project Category Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectItems.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    
                    setTimeout(() => {
                        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                            item.classList.remove('hidden');
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        } else {
                            item.classList.add('hidden');
                        }
                    }, 300);
                });
            });
        });
    }

    // Dynamically set current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Contact Form AJAX Submission
    const contactForm = document.getElementById('contact-form');
    const successModalElement = document.getElementById('successModal');
    const successModal = successModalElement ? new bootstrap.Modal(successModalElement) : null;

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            // Check HTML5 validation
            if (!this.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.add('was-validated');
                
                // Handle custom dropdown validation manually
                const companySelect = this.querySelector('#companyType');
                if (companySelect && !companySelect.value) {
                    companySelect.closest('.custom-dropdown-container').classList.add('dropdown-invalid');
                }
                return;
            }

            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    this.reset();
                    this.classList.remove('was-validated');
                    // Manually reset custom dropdown UI state
                    const dropdownDisplay = this.querySelector('.custom-dropdown-display');
                    if (dropdownDisplay) {
                        dropdownDisplay.textContent = dropdownDisplay.getAttribute('data-placeholder') || 'Select Category';
                        const container = dropdownDisplay.closest('.custom-dropdown-container');
                        container.classList.remove('dropdown-selected');
                        container.classList.remove('dropdown-invalid');
                    }
                    if (successModal) successModal.show();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (err) {
                console.log("error");
                
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});
