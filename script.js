document.addEventListener('DOMContentLoaded', () => {

    // --- Elements ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]'); // Select only sections with IDs
    const navLinks = document.querySelectorAll('#nav-menu a');
    const coffeeBeansContainer = document.getElementById('coffee-beans');
    const backToTopButton = document.querySelector('.back-to-top');
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    const offerBadge = document.getElementById('offer-badge-button');
    const modal = document.getElementById('offers-modal');
    const closeModalButton = modal ? modal.querySelector('.close-modal') : null;
    const currentYearSpan = document.getElementById('current-year');

    // --- Mobile Menu ---
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            navMenu.setAttribute('aria-hidden', !isActive);

            // Change icon based on state
            menuToggle.innerHTML = isActive ?
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';

            // Toggle body scroll
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Close mobile menu when clicking a link inside it
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navMenu.setAttribute('aria-hidden', 'true');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    document.body.style.overflow = ''; // Restore scroll
                }
            });
        });

         // Close mobile menu on Escape key press
         document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            }
        });
    }

    // --- Navbar Scroll Effect ---
    if (navbar) {
        const scrollThreshold = 50; // Pixels scrolled before effect activates
        const handleScroll = () => {
            if (window.scrollY > scrollThreshold) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check in case page loads scrolled
    }

    // ---Gallery ---
    const carousel = document.getElementById('carousel');
    const totalSlides = carousel.children.length;
    let currentSlide = 0;

    document.querySelector('.next-btn').addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    });

    document.querySelector('.prev-btn').addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    });

    // --- Active Link Highlighting on Scroll ---
    if (sections.length > 0 && navLinks.length > 0) {
        const observerOptions = {
            root: null, // relative to document viewport
            rootMargin: '-30% 0px -70% 0px', // Adjust margins to activate link sooner/later
            threshold: 0 // Trigger as soon as element enters/leaves rootMargin
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const correspondingLink = document.querySelector(`#nav-menu a[href="#${id}"]`);

                if (entry.isIntersecting) {
                    // Remove active class from all links
                    navLinks.forEach(link => link.classList.remove('active'));
                    // Add active class to the intersecting section's link
                    if (correspondingLink) {
                        correspondingLink.classList.add('active');
                    }
                } else {
                    // Optional: Remove active class when section leaves viewport
                    // if (correspondingLink) {
                    //     correspondingLink.classList.remove('active');
                    // }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => observer.observe(section));
    }


    // --- Falling Coffee Beans Animation ---
    if (coffeeBeansContainer) {
        const createCoffeeBeans = (count = 15) => { // Reduced default count
             // Performance Note: Reduce bean count further or simplify animation if needed.
            for (let i = 0; i < count; i++) {
                const bean = document.createElement('div');
                bean.classList.add('bean');
                bean.setAttribute('aria-hidden', 'true'); // Decorative

                const left = Math.random() * 100;
                const animationDuration = 6 + Math.random() * 8; // Slightly adjusted range
                const animationDelay = Math.random() * 6;
                const size = 15 + Math.random() * 15; // Smaller beans

                bean.style.left = `${left}%`;
                bean.style.width = `${size}px`;
                bean.style.height = `${size}px`;
                bean.style.animationDuration = `${animationDuration}s`;
                bean.style.animationDelay = `${animationDelay}s`;

                coffeeBeansContainer.appendChild(bean);
            }
        };
        // Delay creation slightly to ensure page layout is stable
        setTimeout(createCoffeeBeans, 500);
    }

    // --- Back to Top Button ---
    if (backToTopButton) {
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Use CSS smooth scrolling by default (href="#home")
            // Provide JS fallback or use if more complex behavior is needed
             window.scrollTo({
                 top: 0,
                 behavior: 'smooth' // Explicitly use smooth scroll via JS
             });
        });
        // Optionally hide/show button based on scroll position
         window.addEventListener('scroll', () => {
             if (window.scrollY > 300) {
                 backToTopButton.style.opacity = '1';
                 backToTopButton.style.visibility = 'visible';
             } else {
                 backToTopButton.style.opacity = '0';
                 backToTopButton.style.visibility = 'hidden';
             }
         }, { passive: true });
         // Initial state
          if (window.scrollY <= 300) {
              backToTopButton.style.opacity = '0';
              backToTopButton.style.visibility = 'hidden';
          }
    }

    // --- Form Submission Handling ---
    const handleFormSubmit = (form, feedbackElementId) => {
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const feedbackElement = document.getElementById(feedbackElementId);
            const submitButton = form.querySelector('.submit-btn');

            if (!feedbackElement || !submitButton) return;

            // --- Basic Validation (Example - enhance as needed) ---
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    // Add error indication (e.g., border color)
                    field.style.borderColor = 'var(--error-red)';
                } else {
                     field.style.borderColor = ''; // Reset border color
                }
            });

            if (!isValid) {
                feedbackElement.textContent = 'Please fill out all required fields.';
                feedbackElement.className = 'form-feedback error'; // Use class for styling
                return; // Stop submission
            }
            // --- End Basic Validation ---


            feedbackElement.textContent = ''; // Clear previous feedback
            feedbackElement.className = 'form-feedback'; // Reset class
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Simulate form submission (replace with actual fetch/AJAX call)
            setTimeout(() => {
                form.reset(); // Clear the form
                feedbackElement.textContent = 'Thank you! Your message has been sent.';
                feedbackElement.className = 'form-feedback success'; // Success class
                submitButton.disabled = false;
                submitButton.textContent = form.id === 'newsletterForm' ? 'Subscribe' : 'Send Message';

                // Optionally hide feedback after a few seconds
                setTimeout(() => {
                    feedbackElement.textContent = '';
                    feedbackElement.className = 'form-feedback';
                }, 5000);

            }, 1500); // Simulate network delay
        });
    };

    handleFormSubmit(contactForm, 'form-feedback');
    handleFormSubmit(newsletterForm, 'newsletter-feedback');

    // --- Special Offers Modal ---
    if (offerBadge && modal && closeModalButton) {
        const openModal = () => {
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
            closeModalButton.focus(); // Focus the close button for accessibility
        };

        const closeModal = () => {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restore background scroll
            offerBadge.focus(); // Return focus to the badge
        };

        offerBadge.addEventListener('click', openModal);
        closeModalButton.addEventListener('click', closeModal);

        // Close modal on clicking outside the content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close modal on Escape key press
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
    }

    // --- "Add to Cart" Button Feedback ---
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const itemElement = button.closest('.menu-category')?.querySelector('h3');
                const item = itemElement ? itemElement.textContent : 'Item';
                const originalText = button.textContent;

                button.textContent = 'Added!';
                button.disabled = true;
                // Optionally add a class for styling feedback
                 button.classList.add('added');

                // For screen readers, announce the addition
                // Create a temporary live region or use an existing one
                // e.g., alert(`${item} added to order.`);

                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.classList.remove('added');
                }, 1500); // Revert after 1.5 seconds
            });
        });
    }

    // --- Update Footer Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

}); // End DOMContentLoaded