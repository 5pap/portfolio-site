// JavaScript for portfolio site
document.addEventListener('DOMContentLoaded', function() {
    // Hide page loader
    const pageLoader = document.querySelector('.page-loader');
    pageLoader.classList.add('hidden');

    // Privacy Policy and Terms of Service links
    const privacyLink = document.getElementById('privacy-link');
    const termsLink = document.getElementById('terms-link');

    if (privacyLink) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Privacy Policy: This website does not collect personal information. For more details, please contact the site owner.');
        });
    }

    if (termsLink) {
        termsLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Terms of Service: By using this website, you agree to use it for lawful purposes only. The site owner is not liable for any issues arising from its use.');
        });
    }

    // Scroll Progress Indicator
    const progressBar = document.querySelector('.scroll-progress-bar');
    const backToTopButton = document.querySelector('.back-to-top');

    // Throttle scroll event for performance
    const handleScroll = throttle(() => {
        const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (windowScroll / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';

        // Show/hide back to top button
        if (windowScroll > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }, 100);

    window.addEventListener('scroll', handleScroll);

    // Back to top button click
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile menu toggle (if we had one)
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Initialize form state
        let isSubmitting = false;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Prevent multiple submissions
            if (isSubmitting) return;

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const project = document.getElementById('project').value;
            const message = document.getElementById('message').value.trim();

            // Enhanced validation
            const validationErrors = [];

            if (!name) {
                validationErrors.push('Name is required');
            } else if (name.length < 2) {
                validationErrors.push('Name must be at least 2 characters');
            } else if (name.length > 50) {
                validationErrors.push('Name must be less than 50 characters');
            }

            if (!email) {
                validationErrors.push('Email is required');
            } else if (!isValidEmail(email)) {
                validationErrors.push('Please enter a valid email address');
            }

            if (!project) {
                validationErrors.push('Please select a project type');
            }

            if (!message) {
                validationErrors.push('Message is required');
            } else if (message.length < 10) {
                validationErrors.push('Message must be at least 10 characters');
            } else if (message.length > 500) {
                validationErrors.push('Message must be less than 500 characters');
            }

            // Show validation errors if any
            if (validationErrors.length > 0) {
                showFormErrors(validationErrors);
                return;
            }

            // Clear any existing errors
            clearFormErrors();

            // Set submitting state
            isSubmitting = true;

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            submitButton.classList.add('sending');

            try {
                // Prepare form data
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('project', project);
                formData.append('message', message);

                // Send to Formspree
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success! Show integrated success message
                    showFormSuccess('Thank you! Your message has been sent. I\'ll get back to you soon.');
                    contactForm.reset();
                } else {
                    // Error from server
                    throw new Error(`Formspree error: ${response.status}`);
                }
            } catch (error) {
                // Show error
                console.error('Form submission error:', error);
                showFormError('Oops! There was an error sending your message. Please try again later or email me directly.');
            } finally {
                // Reset button state
                isSubmitting = false;
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                submitButton.classList.remove('sending');
            }
        });
    }

// Helper function to validate email format
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Helper function to show form errors
function showFormErrors(errors) {
    // Clear existing errors first
    clearFormErrors();

    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-errors';
    errorContainer.role = 'alert';

    const errorList = document.createElement('ul');
    errors.forEach(error => {
        const li = document.createElement('li');
        li.textContent = error;
        errorList.appendChild(li);
    });

    errorContainer.appendChild(errorList);

    // Insert error container before the form
    const contactForm = document.getElementById('contact-form');
    contactForm.parentNode.insertBefore(errorContainer, contactForm);

    // Focus on first invalid field
    const firstInvalidInput = contactForm.querySelector(':invalid');
    if (firstInvalidInput) {
        firstInvalidInput.focus();
    }
}

// Helper function to show form success message
function showFormSuccess(message) {
    // Clear existing messages/errors first
    clearFormMessages();

    // Create success container
    const successContainer = document.createElement('div');
    successContainer.className = 'form-success';
    successContainer.role = 'status';
    successContainer.innerHTML = `<span class="form-icon success">✓</span> ${message}`;

    // Insert success container before the form
    const contactForm = document.getElementById('contact-form');
    contactForm.parentNode.insertBefore(successContainer, contactForm);

    // Remove success message after 5 seconds
    setTimeout(() => {
        if (successContainer.parentNode) {
            successContainer.remove();
        }
    }, 5000);
}

// Helper function to show form error message
function showFormError(message) {
    // Clear existing messages/errors first
    clearFormMessages();

    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.role = 'alert';
    errorContainer.innerHTML = `<span class="form-icon error">⚠</span> ${message}`;

    // Insert error container before the form
    const contactForm = document.getElementById('contact-form');
    contactForm.parentNode.insertBefore(errorContainer, contactForm);

    // Remove error message after 5 seconds
    setTimeout(() => {
        if (errorContainer.parentNode) {
            errorContainer.remove();
        }
    }, 5000);
}

// Helper function to clear form messages
function clearFormMessages() {
    const existingMessages = document.querySelectorAll('.form-errors, .form-success, .form-error');
    existingMessages.forEach(el => el.remove());
}

// Helper function to clear form errors specifically
function clearFormErrors() {
    const existingErrors = document.querySelectorAll('.form-errors');
    existingErrors.forEach(el => el.remove());
}

// Performance optimization: throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add hover effect to portfolio items for touch devices
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('touchstart', function() {
            this.classList.add('hover');
        });

        item.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('hover');
            }, 300);
        });
    });

    // Add hover effect to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });

        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });

    // Add active class to nav links on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Throttle scroll event for performance
    const handleNavScroll = throttle(() => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }, 100);

    window.addEventListener('scroll', handleNavScroll);
});

// Simple animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .about-text, .about-skills');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;

        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .about-text, .about-skills');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Run on load and scroll
    animateOnScroll();
    window.addEventListener('scroll', throttle(animateOnScroll, 100));
});