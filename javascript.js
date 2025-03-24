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

    // Modal functionality for contact information
    const modalOverlay = document.getElementById('modalOverlay');
    const modals = {
        phone: document.getElementById('phoneModal'),
        email: document.getElementById('emailModal')
    };
    
    // Open modal when clicking on contact items
    const contactItems = document.querySelectorAll('.contact-info-item[data-modal]');
    contactItems.forEach(item => {
        item.addEventListener('click', () => {
            const modalType = item.getAttribute('data-modal');
            openModal(modalType);
        });
    });
    
    // Close modal when clicking on close button
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });
    
    // Close modal when clicking outside modal
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Open modal function
    function openModal(type) {
        modalOverlay.classList.add('active');
        
        // Hide all modals first
        Object.values(modals).forEach(modal => {
            modal.classList.remove('active');
        });
        
        // Show the selected modal
        if (modals[type]) {
            modals[type].classList.add('active');
        }
    }
    
    // Close modal function
    function closeModal() {
        modalOverlay.classList.remove('active');
        
        // Hide all modals
        Object.values(modals).forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // Add copy functionality for contact information
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Prevent triggering the modal
            e.stopPropagation();
            
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
            const originalButtonText = button.innerHTML;
            const buttonSpan = button.querySelector('span');
            if (buttonSpan) {
                buttonSpan.textContent = 'Copied!';
            }
            button.classList.add('copied');
            
            // Reset after 2 seconds
            setTimeout(() => {
                if (buttonSpan) {
                    buttonSpan.textContent = 'Copy';
                }
                button.classList.remove('copied');
            }, 2000);
        });
    });
});
