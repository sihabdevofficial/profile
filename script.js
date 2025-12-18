// Configuration Object
const CONFIG = {
    USER_EMAIL: "sihab.dev.official@gmail.com",
    USER_PORTFOLIO: "https://sihabxd.web.app",
    USER_WHATSAPP: "8801736999500",
    RESUME_FILE_PATH: "./assets/sihab_hasan_resume.pdf",
    TITLES: ["Full-Stack Architect", "UI/UX Designer", "Open Source Contributor", "Creative Technologist"],
    TECH_STACK: [
        { name: 'TypeScript', icon: 'simple-icons:typescript', description: 'Strongly Typed Front/Backend Code', color: '#3178C6' },
        { name: 'Python', icon: 'simple-icons:python', description: 'AI/ML and Backend Services', color: '#3776AB' },
        { name: 'Rust', icon: 'simple-icons:rust', description: 'High-Performance & Safe Systems', color: '#FFFFFF' },
        { name: 'Go', icon: 'simple-icons:go', description: 'Efficient Concurrency & APIs', color: '#00ADD8' },
        { name: 'React', icon: 'simple-icons:react', description: 'Modern User Interface Library', color: '#61DAFB' },
        { name: 'Next.js', icon: 'simple-icons:nextdotjs', description: 'Full-Stack Web Framework', color: '#FFFFFF' },
        { name: 'Tailwind CSS', icon: 'simple-icons:tailwindcss', description: 'Utility-First CSS Styling', color: '#06B6D4' },
        { name: 'Three.js', icon: 'simple-icons:threedotjs', description: '3D Graphics on the Web', color: '#FFFFFF' },
        { name: 'Node.js', icon: 'simple-icons:nodedotjs', description: 'Scalable Backend Runtime', color: '#339933' },
        { name: 'PostgreSQL', icon: 'simple-icons:postgresql', description: 'Robust Relational Database', color: '#4169E1' },
        { name: 'GraphQL', icon: 'simple-icons:graphql', description: 'API Query Language', color: '#E10098' },
        { name: 'Docker', icon: 'simple-icons:docker', description: 'Containerization for Deployment', color: '#2496ED' },
        { name: 'Kubernetes', icon: 'simple-icons:kubernetes', description: 'Container Orchestration', color: '#326CE5' },
        { name: 'AWS', icon: 'simple-icons:amazonaws', description: 'Cloud Infrastructure & Services', color: '#FF9900' },
    ]
};

// State Management
const State = {
    titleIndex: 0,
    titleRotationInterval: null,
    isResumeOpen: false
};

// --- RESUME LOGIC ---
function toggleResume(show) {
    const overlay = document.getElementById('resume-overlay');
    const content = document.getElementById('card-content-view');
    const iframe = document.getElementById('resume-iframe');
    const loader = document.getElementById('resume-loader');
    
    State.isResumeOpen = show;

    if (show) {
        overlay.removeAttribute('hidden');
        overlay.classList.add('active');
        content.style.opacity = '0';
        content.style.pointerEvents = 'none';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            iframe.src = CONFIG.RESUME_FILE_PATH;
            iframe.onload = () => {
                iframe.classList.add('opacity-100');
                loader.style.display = 'none';
                iframe.focus();
            };
        }, 400);
        
        // Trap focus within modal
        trapFocus(overlay);
    } else {
        overlay.classList.remove('active');
        content.style.opacity = '1';
        content.style.pointerEvents = 'auto';
        document.body.style.overflow = '';
        
        setTimeout(() => {
            iframe.classList.remove('opacity-100');
            iframe.src = "";
            loader.style.display = 'block';
            overlay.setAttribute('hidden', '');
        }, 300);
        
        // Return focus to resume button
        const resumeButton = document.querySelector('button[onclick="toggleResume(true)"]');
        if (resumeButton) resumeButton.focus();
    }
}

// Focus trap for modal
function trapFocus(element) {
    const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (!firstFocusable) return;
    
    const handleKeyDown = function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
        if (e.key === 'Escape') {
            toggleResume(false);
        }
    };
    
    element.addEventListener('keydown', handleKeyDown);
    firstFocusable.focus();
    
    // Store reference to remove listener later
    element._keydownHandler = handleKeyDown;
}

function renderMarquee() {
    const container = document.getElementById('mega-marquee');
    if (!container) return;
    
    const createItems = () => CONFIG.TECH_STACK.map(item => `
        <div class="flex items-center gap-2 px-4 py-2 box-sm border border-white/5 bg-black/40 text-neutral-400 hover:text-white transition-all duration-300 cursor-default group whitespace-nowrap tooltip-container" 
             data-tooltip="${item.description}" style="--icon-hover-color: ${item.color};" tabindex="0" aria-label="${item.name} - ${item.description}">
            <iconify-icon icon="${item.icon}" class="w-3 h-3 text-neutral-500 transition-colors" data-color-target="true"></iconify-icon>
            <span class="text-[10px] font-mono font-bold uppercase tracking-wider">${item.name}</span>
        </div>
    `).join('');
    
    container.innerHTML = createItems() + createItems() + createItems() + createItems();
    
    const marqueeItems = container.querySelectorAll('.tooltip-container');
    marqueeItems.forEach(item => {
        const icon = item.querySelector('[data-color-target="true"]');
        if (icon) {
            const hoverColor = item.style.getPropertyValue('--icon-hover-color');
            
            const handleMouseEnter = () => {
                icon.style.color = hoverColor;
                item.classList.add('hover:border-gold');
            };
            
            const handleMouseLeave = () => {
                icon.style.color = '';
                item.classList.remove('hover:border-gold');
            };
            
            item.addEventListener('mouseenter', handleMouseEnter);
            item.addEventListener('mouseleave', handleMouseLeave);
            
            // Keyboard support
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    icon.style.color = hoverColor;
                    item.classList.add('hover:border-gold');
                }
            });
            
            // Cleanup references
            item._mouseEnterHandler = handleMouseEnter;
            item._mouseLeaveHandler = handleMouseLeave;
        }
    });
}

function startTitleRotation() {
    const container = document.getElementById('rotating-title-container');
    const textEl = document.getElementById('rotating-title-text');
    
    if (!container || !textEl) return;
    
    // Clear any existing interval
    if (State.titleRotationInterval) {
        clearInterval(State.titleRotationInterval);
    }
    
    State.titleRotationInterval = setInterval(() => {
        container.classList.remove('fade-in');
        container.classList.add('fade-out');
        
        setTimeout(() => {
            State.titleIndex = (State.titleIndex + 1) % CONFIG.TITLES.length;
            textEl.textContent = CONFIG.TITLES[State.titleIndex];
            container.classList.remove('fade-out');
            container.classList.add('fade-in');
        }, 300);
    }, 3000);
}

function triggerEntrance() {
    setTimeout(() => {
        const card = document.getElementById('main-card');
        if (card) {
            card.classList.add('active');
        }
    }, 200);
}

function renderStaticIcons() {
    const lucideScript = document.createElement('script');
    lucideScript.src = 'https://unpkg.com/lucide@latest';
    lucideScript.async = true;
    lucideScript.onload = () => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    };
    lucideScript.onerror = () => {
        console.warn('Lucide icons failed to load');
    };
    document.head.appendChild(lucideScript);
}

function copyEmailToClipboard() {
    navigator.clipboard.writeText(CONFIG.USER_EMAIL).then(() => {
        showToast();
    }).catch(err => {
        console.error('Failed to copy email: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = CONFIG.USER_EMAIL;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast();
        } catch (err) {
            console.error('Fallback copy failed: ', err);
        }
        document.body.removeChild(textArea);
    });
}

function showToast() {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.removeAttribute('hidden');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.setAttribute('hidden', ''), 300);
    }, 3000);
}

function initEventListeners() {
    // Email copy functionality
    const emailLink = document.querySelector('a[href^="mailto"]');
    if (emailLink) {
        emailLink.addEventListener('click', (e) => {
            if (navigator.clipboard && window.isSecureContext) {
                e.preventDefault();
                copyEmailToClipboard();
                setTimeout(() => {
                    window.location.href = `mailto:${CONFIG.USER_EMAIL}`;
                }, 100);
            }
        });
    }
    
    // Handle resume download
    const resumeDownload = document.getElementById('resume-download');
    if (resumeDownload) {
        resumeDownload.href = CONFIG.RESUME_FILE_PATH;
        resumeDownload.setAttribute('download', 'Sihab_Hasan_Resume.pdf');
    }
    
    // Escape key to close resume
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && State.isResumeOpen) {
            toggleResume(false);
        }
    });
    
    // Handle print events
    window.addEventListener('beforeprint', () => {
        if (!State.isResumeOpen) {
            toggleResume(true);
        }
    });
}

function initAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-card';
    skipLink.className = 'sr-only focus:not-sr-only';
    skipLink.textContent = 'Skip to main content';
    skipLink.addEventListener('focus', function() {
        this.classList.remove('sr-only');
        this.classList.add('focus:absolute', 'focus:top-4', 'focus:left-4', 'focus:z-50', 'focus:bg-white', 'focus:text-black', 'focus:p-4');
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Set ARIA attributes
    const mainCard = document.getElementById('main-card');
    if (mainCard) {
        mainCard.setAttribute('role', 'main');
        mainCard.setAttribute('aria-label', 'Sihab Hasan Profile');
    }
}

// Clean up event listeners
function cleanupEventListeners() {
    // Cleanup marquee item listeners
    const marqueeItems = document.querySelectorAll('.tooltip-container');
    marqueeItems.forEach(item => {
        if (item._mouseEnterHandler) {
            item.removeEventListener('mouseenter', item._mouseEnterHandler);
        }
        if (item._mouseLeaveHandler) {
            item.removeEventListener('mouseleave', item._mouseLeaveHandler);
        }
    });
    
    // Cleanup resume overlay keydown listener
    const overlay = document.getElementById('resume-overlay');
    if (overlay && overlay._keydownHandler) {
        overlay.removeEventListener('keydown', overlay._keydownHandler);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initAccessibility();
    initEventListeners();
    renderMarquee();
    renderStaticIcons();
    startTitleRotation();
    triggerEntrance();
    
    // Preload resume file
    if (CONFIG.RESUME_FILE_PATH) {
        const preload = document.createElement('link');
        preload.rel = 'preload';
        preload.as = 'document';
        preload.href = CONFIG.RESUME_FILE_PATH;
        document.head.appendChild(preload);
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (State.titleRotationInterval) {
        clearInterval(State.titleRotationInterval);
    }
    cleanupEventListeners();
});

// Make functions globally available
window.toggleResume = toggleResume;