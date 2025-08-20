// Global variables
let currentSection = 'home';
let eternalLoopActive = false;
let eternalLoopTimer;
let currentCarouselIndex = 0;
let carouselSlides = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateProgressBar();
});

// Event Listeners
function initializeEventListeners() {
    // Scroll event for back-to-top button
    window.addEventListener('scroll', handleScroll);
    
    // Easter egg - Press 'R' key
    document.addEventListener('keydown', function(event) {
        if (event.key.toLowerCase() === 'r') {
            showEasterEgg();
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('genericModal');
        if (event.target === modal) {
            closeModal('genericModal');
        }
    });
}

// Start Journey Function
function startJourney() {
    showNotification("My heart is waiting for u Radhe.");
    document.getElementById("startPage").style.display = "none";
    document.getElementById("mainPage").style.display = "block";
    openNav();
    showSection('home');
}

// Navigation Functions
function openNav() {
    document.getElementById("overlayNav").style.width = "100%";
}

function closeNav() {
    document.getElementById("overlayNav").style.width = "0";
}

// Show Section with Fetch
async function showSection(section) {
    closeNav();
    showLoadingSpinner();
    
    try {
        const response = await fetch(`sections/${section}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load ${section}.html`);
        }
        
        const content = await response.text();
        const contentDiv = document.getElementById("content");
        
        // Fade out current content
        contentDiv.classList.remove('active');
        
        setTimeout(() => {
            contentDiv.innerHTML = content;
            currentSection = section;
            
            // Update active nav link
            updateActiveNavLink(section);
            
            // Initialize section-specific functionality
            initializeSectionFeatures(section);
            
            // Fade in new content
            contentDiv.classList.add('active');
            
            // Update progress bar
            updateProgressBar();
            
            hideLoadingSpinner();
        }, 300);
        
    } catch (error) {
        console.error('Error loading section:', error);
        hideLoadingSpinner();
        showNotification('Error loading content. Please try again.');
    }
}

// Initialize section-specific features
function initializeSectionFeatures(section) {
    switch(section) {
        case 'radhakrishna':
            initializeCarousel();
            initializeKrishnaMusic();
            createFloatingDiyas();
            break;
        case 'future':
            createTwinklingStars();
            break;
        case 'promises':
            initializeCountdown();
            initializeTypewriter();
            break;
        case 'present':
            initializeHeartAnimation();
            break;
        case 'home':
            initializeHomeAudio();
            break;
    }
}

// Loading Spinner
function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

// Update Active Navigation Link
function updateActiveNavLink(section) {
    const navLinks = document.querySelectorAll('.overlay-content a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === section) {
            link.classList.add('active');
        }
    });
}

// Progress Bar Animation
function updateProgressBar() {
    const sections = ['home', 'past', 'present', 'future', 'promises', 'radhakrishna'];
    const currentIndex = sections.indexOf(currentSection);
    const progress = ((currentIndex + 1) / sections.length) * 100;
    
    document.getElementById("loveProgress").style.width = progress + "%";
}

// Carousel Functions
function initializeCarousel() {
    carouselSlides = document.querySelectorAll('.carousel-slide');
    if (carouselSlides.length === 0) return;
    
    currentCarouselIndex = 0;
    
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentCarouselIndex = (currentCarouselIndex - 1 + carouselSlides.length) % carouselSlides.length;
            updateCarousel();
        });
        
        nextBtn.addEventListener('click', () => {
            currentCarouselIndex = (currentCarouselIndex + 1) % carouselSlides.length;
            updateCarousel();
        });
    }
    
    // Auto-advance carousel
    setInterval(() => {
        if (currentSection === 'radhakrishna') {
            currentCarouselIndex = (currentCarouselIndex + 1) % carouselSlides.length;
            updateCarousel();
        }
    }, 4000);
}

function updateCarousel() {
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.style.transform = `translateX(-${currentCarouselIndex * 100}%)`;
    }
}

// Krishna Music Functions
function initializeKrishnaMusic() {
    const krishnaImages = document.querySelectorAll('.carousel-slide img');
    krishnaImages.forEach(img => {
        img.addEventListener('click', playKrishnaFlute);
    });
}

function playKrishnaFlute() {
    const audio = document.getElementById('radhakrishna-audio');
    if (audio) {
        if (audio.paused) {
            audio.play().catch(error => {
                console.log("Audio play failed:", error);
                showNotification("Click to play Krishna's divine music 🎵");
            });
            showNotification("Playing Krishna's divine flute 🎵");
        } else {
            audio.pause();
            showNotification("Music paused");
        }
    }
}

// Floating Diyas Animation
function createFloatingDiyas() {
    const container = document.querySelector('.radhakrishna-section');
    if (!container) return;
    
    // Remove existing diyas
    const existingDiyas = container.querySelectorAll('.floating-diyas');
    existingDiyas.forEach(diya => diya.remove());
    
    const diyaContainer = document.createElement('div');
    diyaContainer.className = 'floating-diyas';
    
    for (let i = 0; i < 5; i++) {
        const diya = document.createElement('div');
        diya.className = 'diya';
        diya.style.left = Math.random() * 80 + 10 + '%';
        diya.style.animationDelay = Math.random() * 6 + 's';
        diyaContainer.appendChild(diya);
    }
    
    container.appendChild(diyaContainer);
}

// Twinkling Stars for Future Section
function createTwinklingStars() {
    const futureSection = document.querySelector('.future-goals');
    if (!futureSection) return;
    
    // Remove existing stars
    const existingStars = futureSection.querySelectorAll('.stars-background');
    existingStars.forEach(star => star.remove());
    
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-background';
    futureSection.appendChild(starsContainer);
}

// Countdown Timer
function initializeCountdown() {
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;
    
    const futureDate = new Date("2026-01-01T00:00:00");
    
    function updateCountdown() {
        const now = new Date();
        const remainingTime = futureDate - now;
        
        if (remainingTime <= 0) {
            countdownElement.innerHTML = "The moment has arrived! 💕";
            return;
        }
        
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Typewriter Effect
function initializeTypewriter() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.width = '0';
        
        setTimeout(() => {
            element.style.width = '100%';
            let i = 0;
            const typeInterval = setInterval(() => {
                element.textContent += text.charAt(i);
                i++;
                if (i >= text.length) {
                    clearInterval(typeInterval);
                }
            }, 100);
        }, 500);
    });
}

// Heart Animation for Present Section
function initializeHeartAnimation() {
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach(heart => {
        heart.addEventListener('click', animateHeart);
    });
}

function animateHeart() {
    const heart = event.target;
    heart.classList.add('heart-animated');
    
    setTimeout(() => {
        heart.classList.remove('heart-animated');
    }, 600);
    
    showNotification("My heart beats for you! 💕");
}

// Home Audio
function initializeHomeAudio() {
    const homeAudio = document.getElementById("home-audio");
    if (homeAudio) {
        homeAudio.play().catch(error => {
            console.log("Autoplay blocked:", error);
        });
    }
}

// Modal Functions
function openModal(modalId, title, content) {
    const modal = document.getElementById('genericModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h3>${title}</h3>
        <p>${content}</p>
    `;
    
    modal.style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Scroll Functions
function handleScroll() {
    const backToTop = document.querySelector('.back-to-top');
    if (window.pageYOffset > 300) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Easter Egg
function showEasterEgg() {
    document.getElementById('easterEgg').style.display = 'flex';
    setTimeout(() => {
        closeEasterEgg();
    }, 5000);
}

function closeEasterEgg() {
    document.getElementById('easterEgg').style.display = 'none';
}

// Eternal Loop Mode
function toggleEternalLoop() {
    if (eternalLoopActive) {
        clearInterval(eternalLoopTimer);
        eternalLoopActive = false;
        showNotification("Eternal loop stopped");
    } else {
        startEternalLoop();
        eternalLoopActive = true;
        showNotification("Eternal loop started - symbolizing our eternal love 💕");
    }
}

function startEternalLoop() {
    const sections = ['home', 'past', 'present', 'future', 'promises', 'radhakrishna'];
    let currentIndex = 0;
    
    eternalLoopTimer = setInterval(() => {
        showSection(sections[currentIndex]);
        currentIndex = (currentIndex + 1) % sections.length;
    }, 15000);
}

// Notification System
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #ff99cc, #800080);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            z-index: 1500;
            font-family: 'Quicksand', sans-serif;
            font-weight: 600;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.transform = 'translateX(0)';
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
    }, 3000);
}

// Voice Message Placeholder
function startVoiceMessage() {
    showNotification("Voice message feature coming soon! 🎵");
    const status = document.getElementById('voiceMessageStatus');
    if (status) {
        status.innerHTML = "Preparing your special message...";
        setTimeout(() => {
            status.innerHTML = "Your love has been heard! ❤️";
        }, 2000);
    }
}

// Promise Details
function showPromiseDetails() {
    const details = document.getElementById('promiseDetails');
    if (details) {
        details.style.display = 'block';
        initializeCountdown();
    }
}

// Future Plans
function showFuturePlans() {
    const plans = document.getElementById('futurePlans');
    if (plans) {
        plans.style.display = 'block';
    }
}

// Proposal Story
function showProposalStory() {
    const story = document.getElementById('proposalStory');
    if (story) {
        story.style.display = 'block';
    }
}

// Auto-start eternal loop after 30 seconds of inactivity
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        if (!eternalLoopActive) {
            toggleEternalLoop();
        }
    }, 30000);
}

// Reset inactivity timer on user interaction
document.addEventListener('click', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('scroll', resetInactivityTimer);

// Initialize inactivity timer
resetInactivityTimer();