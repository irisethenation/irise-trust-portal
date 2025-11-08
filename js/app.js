/**
 * iRise Academy Trust Documentation Portal
 * Main Application JavaScript
 */

// ===================================
// Service Worker Registration (PWA)
// ===================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// ===================================
// Smooth Scrolling for Navigation
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Update active navigation link
            updateActiveNavLink(targetId);
        }
    });
});

// ===================================
// Active Navigation Link Management
// ===================================
function updateActiveNavLink(targetId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// Scroll spy for navigation
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            updateActiveNavLink(`#${sectionId}`);
        }
    });
});

// ===================================
// Form Iframe Height Adjustment
// ===================================
function adjustIframeHeight() {
    const iframes = document.querySelectorAll('.form-iframe');
    iframes.forEach(iframe => {
        // Set minimum height
        iframe.style.minHeight = '600px';
        
        // Try to adjust based on content (if same-origin)
        try {
            if (iframe.contentWindow && iframe.contentWindow.document) {
                const iframeDoc = iframe.contentWindow.document;
                const height = iframeDoc.body.scrollHeight;
                if (height > 600) {
                    iframe.style.height = height + 'px';
                }
            }
        } catch (e) {
            // Cross-origin iframe, use default height
            console.log('Cross-origin iframe, using default height');
        }
    });
}

// Adjust iframe heights on load
window.addEventListener('load', adjustIframeHeight);
window.addEventListener('resize', adjustIframeHeight);

// ===================================
// Deadline Countdown - REMOVED
// ===================================
// Countdown timer removed to make portal generic and reusable.
// Each student receives their specific deadline (8 days from receipt)
// in their personalized onboarding email.
//
// To re-enable for a specific cohort, uncomment and set date:
// const deadlineDate = new Date('YYYY-MM-DDTHH:MM:SS');

// ===================================
// Form Submission Tracking
// ===================================
window.addEventListener('message', (event) => {
    // Listen for messages from Google Forms iframe
    if (event.origin === 'https://docs.google.com') {
        // Track form submissions
        if (event.data && event.data.type === 'formSubmit') {
            console.log('Form submitted successfully');
            
            // Show success notification
            showNotification('Form submitted successfully! Your trust documents will be generated shortly.', 'success');
        }
    }
});

// ===================================
// Notification System
// ===================================
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
        border-left: 4px solid ${type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#3182ce'};
    `;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">${icon}</span>
            <span style="color: #1a202c; font-weight: 500;">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// ===================================
// Loading States for Iframes
// ===================================
function initIframeLoading() {
    const iframes = document.querySelectorAll('.form-iframe');
    
    iframes.forEach(iframe => {
        // Create loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'iframe-loading';
        loadingOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        `;
        loadingOverlay.innerHTML = `
            <div style="text-align: center;">
                <div class="spinner"></div>
                <p style="margin-top: 1rem; color: #4a5568; font-weight: 500;">Loading form...</p>
            </div>
        `;
        
        // Insert overlay
        const container = iframe.parentElement;
        container.style.position = 'relative';
        container.insertBefore(loadingOverlay, iframe);
        
        // Remove overlay when iframe loads
        iframe.addEventListener('load', () => {
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                loadingOverlay.style.transition = 'opacity 0.3s ease-out';
                setTimeout(() => {
                    if (loadingOverlay.parentElement) {
                        loadingOverlay.parentElement.removeChild(loadingOverlay);
                    }
                }, 300);
            }, 500);
        });
    });
}

// Add spinner styles
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #e2e8f0;
        border-top-color: #3182ce;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }
`;
document.head.appendChild(style);

// Initialize loading states
window.addEventListener('load', initIframeLoading);

// ===================================
// Local Storage for Form Progress
// ===================================
function saveFormProgress(formId, data) {
    try {
        localStorage.setItem(`irise-form-${formId}`, JSON.stringify(data));
    } catch (e) {
        console.error('Error saving form progress:', e);
    }
}

function loadFormProgress(formId) {
    try {
        const data = localStorage.getItem(`irise-form-${formId}`);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error loading form progress:', e);
        return null;
    }
}

function clearFormProgress(formId) {
    try {
        localStorage.removeItem(`irise-form-${formId}`);
    } catch (e) {
        console.error('Error clearing form progress:', e);
    }
}

// ===================================
// Accessibility Enhancements
// ===================================
function initAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        left: -9999px;
        z-index: 999;
        padding: 1rem;
        background: #3182ce;
        color: white;
        text-decoration: none;
        font-weight: 600;
    `;
    skipLink.addEventListener('focus', () => {
        skipLink.style.left = '0';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.left = '-9999px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark if not present
    const main = document.querySelector('.main');
    if (main && !main.id) {
        main.id = 'main';
    }
}

// Initialize accessibility features
window.addEventListener('load', initAccessibility);

// ===================================
// Print Functionality
// ===================================
function printPage() {
    window.print();
}

// Add print button if needed
function addPrintButton() {
    const buttons = document.querySelectorAll('.form-footer');
    buttons.forEach(footer => {
        const printBtn = document.createElement('button');
        printBtn.className = 'btn-secondary';
        printBtn.innerHTML = '<i class="fas fa-print"></i> Print Instructions';
        printBtn.style.marginRight = '1rem';
        printBtn.onclick = printPage;
        footer.insertBefore(printBtn, footer.firstChild);
    });
}

// Uncomment to enable print buttons
// window.addEventListener('load', addPrintButton);

// ===================================
// Console Message
// ===================================
console.log('%c🏛️ iRise Academy Trust Documentation Portal', 'font-size: 20px; font-weight: bold; color: #1a365d;');
console.log('%cManaged by Morpheus AI Administrative System', 'font-size: 14px; color: #3182ce;');
console.log('%cPeace and Balance', 'font-size: 12px; font-style: italic; color: #4a5568;');
