/**
 * Main JavaScript for Portfolio Website
 * Handles UI interactions and API calls
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize visitor counter
  initVisitorCounter();
  
  // Initialize contact form
  initContactForm();
  
  // Initialize projects section
  initProjects();
  
  // Initialize parallax effect
  parallaxEffect();
  
  // Add sound effects
  addSoundEffects();
});

/**
 * Visitor Counter Functions
 */
async function initVisitorCounter() {
  try {
    const visitorCountElement = document.getElementById('visitor-count');
    if (!visitorCountElement) return;
    
    // Check if this is a new browser (never visited before)
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    const isUnique = !hasVisitedBefore;
    
    // Mark as visited
    if (!hasVisitedBefore) {
      localStorage.setItem('hasVisitedBefore', 'true');
    }
    
    // Increment visitor count
    const response = await portfolioAPI.incrementVisitorCount(isUnique);
    
    if (response.success) {
      // Animate counter
      animateCounter(0, response.data.totalVisits, visitorCountElement);
    } else {
      // Fallback to local storage if API fails
      let count = localStorage.getItem('visitorCount') || 0;
      count = parseInt(count) + 1;
      localStorage.setItem('visitorCount', count.toString());
      
      visitorCountElement.textContent = count;
    }
  } catch (error) {
    console.error('Error initializing visitor counter:', error);
  }
}

function animateCounter(start, end, element) {
  // For small numbers, animate slowly
  const duration = 2000; // 2 seconds
  const frameDuration = 1000/60; // 60fps
  const totalFrames = Math.min(60, duration / frameDuration);
  const counterIncrement = (end - start) / totalFrames;
  
  let currentCount = start;
  const counter = setInterval(() => {
    currentCount += counterIncrement;
    
    if (currentCount >= end) {
      clearInterval(counter);
      element.textContent = end;
    } else {
      element.textContent = Math.floor(currentCount);
    }
  }, frameDuration);
}

/**
 * Contact Form Functions
 */
function initContactForm() {
  const contactForm = document.querySelector('.contact-form form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Validate form data
    if (!name || !email || !subject || !message) {
      showFormMessage('Please fill in all fields', 'error');
      return;
    }

    // Disable submit button and show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // Prepare FormData
    const formData = new FormData();
    formData.append('access_key', 'f726b3a5-52e5-4f23-bf97-c111ebecf9db');
    formData.append('name', name);
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        contactForm.reset();
        showFormMessage('Your message has been sent successfully!', 'success');
      } else {
        showFormMessage(result.message || 'Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      showFormMessage('An unexpected error occurred. Please try again later.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}

function showFormMessage(message, type) {
  let messageElement = document.querySelector('.form-message');

  if (!messageElement) {
    messageElement = document.createElement('div');
    messageElement.className = 'form-message';
    const contactForm = document.querySelector('.contact-form form');
    contactForm.parentNode.insertBefore(messageElement, contactForm.nextSibling);
  }

  messageElement.textContent = message;
  messageElement.className = `form-message ${type}`;

  setTimeout(() => {
    messageElement.classList.add('hiding');
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.parentNode.removeChild(messageElement);
      }
    }, 500);
  }, 5000);
}


/**
 * Projects Functions
 */
async function initProjects() {
  try {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    // Get projects from API
    const response = await portfolioAPI.getProjects(false, 3); // Get first 3 projects
    
    if (response.success && response.data.length > 0) {
      // Clear existing "Coming Soon" projects
      projectsGrid.innerHTML = '';
      
      // Add projects to grid
      response.data.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
      });
    }
  } catch (error) {
    console.error('Error initializing projects:', error);
  }
}

function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'project-card';
  
  // Create project image
  const imgDiv = document.createElement('div');
  imgDiv.className = 'project-img';
  
  const img = document.createElement('img');
  img.src = project.imageUrl;
  img.alt = project.title;
  imgDiv.appendChild(img);
  
  // Create project info
  const infoDiv = document.createElement('div');
  infoDiv.className = 'project-info';
  
  const title = document.createElement('h3');
  title.textContent = project.title;
  
  const description = document.createElement('p');
  description.textContent = project.description;
  
  // Create project tags
  const tagsDiv = document.createElement('div');
  tagsDiv.className = 'project-tags';
  
  project.technologies.forEach(tech => {
    const tag = document.createElement('span');
    tag.textContent = tech;
    tagsDiv.appendChild(tag);
  });
  
  // Create project links
  const linksDiv = document.createElement('div');
  linksDiv.className = 'project-links';
  
  if (project.liveUrl) {
    const liveLink = document.createElement('a');
    liveLink.href = project.liveUrl;
    liveLink.className = 'btn small-btn';
    liveLink.textContent = 'Live Demo';
    liveLink.target = '_blank';
    linksDiv.appendChild(liveLink);
  }
  
  if (project.sourceCodeUrl) {
    const sourceLink = document.createElement('a');
    sourceLink.href = project.sourceCodeUrl;
    sourceLink.className = 'btn small-btn secondary-btn';
    sourceLink.textContent = 'Source Code';
    sourceLink.target = '_blank';
    linksDiv.appendChild(sourceLink);
  }
  
  // Assemble project card
  infoDiv.appendChild(title);
  infoDiv.appendChild(description);
  infoDiv.appendChild(tagsDiv);
  infoDiv.appendChild(linksDiv);
  
  card.appendChild(imgDiv);
  card.appendChild(infoDiv);
  
  return card;
}

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add active class to nav links on scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(navItem => {
        navItem.classList.remove('active');
        if (navItem.getAttribute('href') === `#${current}`) {
            navItem.classList.add('active');
        }
    });
});

// Add scroll animation to elements
const fadeElements = document.querySelectorAll('.project-card, .skill-item, .stat, .contact-item');

const fadeInOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -100px 0px"
};

const fadeInObserver = new IntersectionObserver((entries, fadeInObserver) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('fade-in');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, fadeInOptions);

fadeElements.forEach(element => {
    element.classList.add('fade-element');
    fadeInObserver.observe(element);
});

// Add CSS class for active navigation when page loads
window.addEventListener('DOMContentLoaded', () => {
    // Update active nav based on the hash in the URL
    const currentHash = window.location.hash || '#home';
    document.querySelector(`a[href="${currentHash}"]`)?.classList.add('active');
    
    // Add a CSS class for styling active state
    document.querySelector('.nav-links').classList.add('nav-loaded');
    
    // Add animation class to the hero section
    document.querySelector('.hero-content').classList.add('animate-hero');
});

// Add animation class to hamburger menu on click
hamburger.addEventListener('click', function() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.classList.toggle('animate');
    });
});

// Update copyright year
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.querySelector('footer p');
    if (copyrightElement) {
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2023', currentYear);
    }
});

// Add parallax effect
function parallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax');
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed');
            const yPos = -(window.scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Add sound effects
function addSoundEffects() {
    const hoverSound = new Audio('audio/hover.mp3');
    const clickSound = new Audio('audio/click.mp3');

    document.querySelectorAll('button, a').forEach(element => {
        element.addEventListener('mouseenter', () => hoverSound.play());
        element.addEventListener('click', () => clickSound.play());
    });

    // Background ambient sound
    const ambientSound = new Audio('audio/ambient.mp3');
    ambientSound.loop = true;
    ambientSound.volume = 0.2;
    ambientSound.play();
} 
