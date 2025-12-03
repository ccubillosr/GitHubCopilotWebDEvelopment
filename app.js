    // Accessibility and Performance Optimizations

    // 1. Skip to main content link for keyboard navigation
    document.addEventListener('DOMContentLoaded', function() {
        const skipLink = document.createElement('a');
        skipLink.href = '#about-me';
        skipLink.textContent = 'Saltar al contenido principal';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = 'position:absolute;top:-40px;left:0;background:#000;color:#fff;padding:8px;z-index:9999;text-decoration:none;';
        skipLink.addEventListener('focus', function() {
            this.style.top = '0';
        });
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        document.body.insertBefore(skipLink, document.body.firstChild);

        // 2. Smooth scroll with reduced motion support
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            document.documentElement.style.scrollBehavior = 'auto';
        }

        // 3. Active navigation indicator
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a');
        
        function setActiveLink() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= (sectionTop - 100)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.removeAttribute('aria-current');
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.setAttribute('aria-current', 'page');
                    link.classList.add('active');
                }
            });
        }
        
        window.addEventListener('scroll', setActiveLink);
        setActiveLink();

        // 4. Form validation enhancement with ARIA live regions
        const contactForm = document.getElementById('contact-form');
        const formInputs = contactForm.querySelectorAll('input, textarea');
        
        // Create live region for form errors
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        contactForm.insertBefore(liveRegion, contactForm.firstChild);
        
        formInputs.forEach(input => {
            input.addEventListener('invalid', function(e) {
                e.preventDefault();
                this.setAttribute('aria-invalid', 'true');
                const errorMsg = this.validationMessage;
                liveRegion.textContent = `Error en ${this.labels[0].textContent}: ${errorMsg}`;
            });
            
            input.addEventListener('input', function() {
                if (this.validity.valid) {
                    this.removeAttribute('aria-invalid');
                }
            });
        });

        // 5. Debounced scroll handler for performance
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(setActiveLink);
        }, { passive: true });

        // 6. Keyboard navigation enhancement
        navLinks.forEach(link => {
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // 7. Focus management for form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !message) {
                liveRegion.textContent = 'Por favor, complete todos los campos obligatorios.';
                const firstInvalid = contactForm.querySelector('[aria-invalid="true"]') || contactForm.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                return false;
            }
            
            // Success message
            liveRegion.textContent = 'Formulario enviado correctamente. Gracias por contactarnos.';
            contactForm.reset();
            formInputs.forEach(input => input.removeAttribute('aria-invalid'));
        });

        // 8. Intersection Observer for animation performance
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            
            sections.forEach(section => observer.observe(section));
        }

        // 9. Announce page load to screen readers
        setTimeout(() => {
            liveRegion.textContent = 'Página de portafolio cargada. Use la navegación para explorar las secciones.';
        }, 1000);
    });
