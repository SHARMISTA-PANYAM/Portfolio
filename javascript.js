document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.menu-btn');
    const indicator = document.querySelector('.indicator');
    const mainContent = document.querySelector('main');

    // Get the current page URL
    const currentPage = window.location.pathname.split('/').pop();

    // Loop through buttons and set the active class based on the current page
    buttons.forEach(button => {
        const buttonPage = button.getAttribute('href');
        if (buttonPage === currentPage) {
            button.classList.add('active'); // Add active class to the current page button
            // Move the indicator to the active button
            indicator.style.left = button.offsetLeft + 'px';
            indicator.style.width = button.offsetWidth + 'px'; // Adjust width to match the button
        }

        // Add click event to move the indicator and handle fade effect
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            const targetPage = button.getAttribute('href');

            // Fade out the main content
            mainContent.style.opacity = 0;

            // Wait for the fade-out transition to complete
            setTimeout(() => {
                // Redirect to the target page
                window.location.href = targetPage;
            }, 500); // Match this duration with the CSS transition duration
        });
    });

    // Projects Section Logic
    const sections = {
        projectsBtn: 'projectsSection',
        workBtn: 'workSection',
        aboutBtn: 'aboutSection'
    };

    Object.entries(sections).forEach(([btnId, sectionId]) => {
        const btn = document.getElementById(btnId);
        const section = document.getElementById(sectionId);

        if (btn && section) {
            btn.addEventListener('click', () => {
                // Hide all sections
                Object.values(sections).forEach(id => {
                    const sec = document.getElementById(id);
                    if (sec) sec.style.display = 'none';
                });

                // Show clicked section with fade-in effect
                section.style.display = 'block';
                setTimeout(() => section.style.opacity = 1, 10);

                // Manage active tab styling
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        }
    });

    // Initialize all sections except the first one to be hidden
    Object.values(sections).forEach((id, index) => {
        const section = document.getElementById(id);
        if (section) section.style.display = index === 0 ? 'block' : 'none';
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Fade-In Animation for Project Cards
    const projects = document.querySelectorAll('.project');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    projects.forEach(project => {
        observer.observe(project);
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous feedback
            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback';
            
            // Get form data
            const formData = new FormData(contactForm);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // Simple validation
            if (!formDataObj.name || !formDataObj.email || !formDataObj.message) {
                showFeedback('Please fill in all fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formDataObj.email)) {
                showFeedback('Please enter a valid email address.', 'error');
                return;
            }
            
            try {
                // Show loading message
                showFeedback('Sending message...', '');
                
                // Send form data to server
                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formDataObj)
                });
                
                // Parse the JSON response
                const data = await response.json();
                
                // Handle response
                if (response.ok) {
                    showFeedback(data.message || 'Thank you for your message! I will get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    // Use the detailed error message if available
                    const errorMessage = data.message || 'Something went wrong. Please try again later.';
                    const detailedError = data.details ? `\n\nDetails: ${data.details}` : '';
                    showFeedback(errorMessage + detailedError, 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showFeedback('Network error. Please check your connection and try again.', 'error');
            }
        });
    }
    
    // Helper function to show feedback
    function showFeedback(message, type) {
        formFeedback.textContent = message;
        formFeedback.className = 'form-feedback';
        if (type) {
            formFeedback.classList.add(type);
        }
    }

    // Add copy functionality for contact information
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the ID of the element to copy from data attribute
            const targetId = button.getAttribute('data-copy');
            const textToCopy = document.getElementById(targetId).textContent;
            
            // Create a temporary textarea element to copy from
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            
            // Select and copy the text
            textarea.select();
            document.execCommand('copy');
            
            // Remove the temporary element
            document.body.removeChild(textarea);
            
            // Visual feedback that the text was copied
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.classList.add('copied');
            
            // Reset after 2 seconds
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i>';
                button.classList.remove('copied');
            }, 2000);
        });
    });
});
