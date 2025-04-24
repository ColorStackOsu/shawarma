import EVENTS_DATA from './events-data.js';
import BOARD_DATA from './eboard-data.js'

//const EVENTS_JSON = JSON.parse(EVENTS_DATA);
//const BOARD_JSON = JSON.parse(BOARD_DATA);

// ------------------------
// INITIALIZATION
// ------------------------

document.addEventListener('DOMContentLoaded', function() {
  //initialize functionality when DOM is ready
  initRevealAnimations();
  setupEventCardHandlers();
  setupModalReset();
  initVanillaTilt();
  //if (btn2023) btn2023.classList.add("inactive");
  //if (btn2024) btn2024.classList.remove("inactive");
});

// ------------------------
// ANIMATION FUNCTIONS
// ------------------------

function initRevealAnimations() {
  // Grab all reveal class elements
  const reveals = document.querySelectorAll('.reveal, .reveal-lg, .reveal-md, .reveal-forward, .reveal-lg-forward, .reveal-left, .reveal-right, .reveal-sm-left, .reveal-sm-right');
  
  const revealElements = function() {
    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      const elementVisible = 50; // When the element becomes visible
      
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add('active');
      }
    }
  };
  
  window.addEventListener('scroll', revealElements);
  window.addEventListener('resize', revealElements);
  
  // Initial call to reveal elements that are already visible
  revealElements();
}

function initVanillaTilt() {
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.ribbon-stat'), {
      max: 15,
      speed: 800,
      scale: 1.2,
    });

    VanillaTilt.init(document.querySelectorAll('.ribbon-red, .ribbon-black'), {
      max: 0,    
      speed: 400,
      glare: true,
      "max-glare": 0.2,
      scale: 1,
      perspective: 1000,
    });
  }
}

// Select all stat elements
const statElements = document.querySelectorAll('.sm-stat');

// Create the observer with options
const options = {
  root: null, // Use the viewport
  rootMargin: '-25% -25% -25% -25%',
  threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] // Multiple thresholds for smoother animation
};

// Create the observer
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    // The element is in view
    if (entry.isIntersecting) {
      // Calculate scale based on how much of the element is visible
      const scale = 1 + (entry.intersectionRatio * 0.5);
      
      // Apply the transformation
      entry.target.style.transform = `scale(${scale})`;
      entry.target.style.transition = 'transform 0.3s ease-out';
    } else {
      // Reset when not in view
      entry.target.style.transform = 'scale(1)';
    }
  });
}, options);


// Start observing each stat element
statElements.forEach(stat => {
  observer.observe(stat);
});


// ------------------------
// EVENT CARD FUNCTIONS
// ------------------------

function addEventCards(events){
  const eventContainer = document.getElementById("event-container");
  
  if (!eventContainer){
    return;

  }else{
    // iterate through all JSON events and create cards
    for (var i = 0; i < events.length; i++) {
      const newDiv = document.createElement("div");
      newDiv.classList.add("col-lg-4", "col-md-6", "col-11", "py-3", "mx-auto");

      const delay = ((i % 3) + 1) * 100;

      newDiv.innerHTML = `
      <div class="d-flex event-card-container-sm justify-content-center reveal delay-${delay}">
          <button class="event-card" data-event-id="${events[i].id}">
              <div class="event-gradient"></div>
              <img src="${events[i].img}" class="img-fluid" loading="lazy" alt="${events[i].alt}">
              <div class="event-inner py-3 px-2">
                  <h3 class="mb-0">${events[i].name}</h3>
                  <p class="text-red fw-semibold">${events[i].date}</p>
              </div>
          </button>
      </div>`;

      eventContainer.appendChild(newDiv);
    }
  }
  setupEventCardHandlers();
}
//load cards
addEventCards(EVENTS_DATA);


// ------------------------
// GALLERY MODAL FUNCTIONS
// ------------------------
function setupEventCardHandlers() {
  // Use event delegation for better performance
  const eventContainer = document.getElementById("event-container");
  if (!eventContainer) return;
  
  // Add a single listener to the container
  eventContainer.addEventListener('click', function(e) {
    const eventCard = e.target.closest('.event-card');
    if (!eventCard) return;
    
    const eventId = eventCard.getAttribute('data-event-id');
    if (eventId) {
      openGalleryModal(eventId);
    }
  });
}

function openGalleryModal(eventId) {
  const eventData = EVENTS_DATA.find(event => event.id === eventId); //find matching ID
  
  if (!eventData || !eventData.galleryImages) {
    console.error(`No gallery data found for event ID: ${eventId}`);
    return;
  }
  
  //update modal title
  const modalTitle = document.getElementById('galleryModalLabel');
  if (modalTitle) {
    modalTitle.textContent = eventData.galleryTitle || `${eventData.name} - ${eventData.date}`;
  }
  
  // Create a simple gallery grid
  const galleryContainer = document.getElementById('gallery-container');
  if (!galleryContainer) return;
  
  galleryContainer.innerHTML = '';
  
  // Create a grid of thumbnails
  const galleryGrid = document.createElement('div');
  galleryGrid.className = 'row g-2';
  
  eventData.galleryImages.forEach((image, index) => {
    const col = document.createElement('div');
    col.className = 'col-6 col-md-4';
    
    const imgContainer = document.createElement('div');
    imgContainer.className = 'img-thumbnail-container';
    
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt || '';
    img.className = 'img-fluid thumbnail';
    img.loading = 'lazy';
    img.setAttribute('data-full-img', image.src);
    img.setAttribute('data-index', index);
    
    // Click event to show full size
    img.onclick = function() {
      showFullSizeImage(image.src, image.alt);
    };
    
    imgContainer.appendChild(img);
    col.appendChild(imgContainer);
    galleryGrid.appendChild(col);
  });
  
  galleryContainer.appendChild(galleryGrid);
  
  // Show the modal
  const galleryModal = new bootstrap.Modal(document.getElementById('galleryModal'));
  galleryModal.show();
  
  // Add a hidden.bs.modal event listener to ensure proper cleanup
  const modalElement = document.getElementById('galleryModal');
  modalElement.addEventListener('hidden.bs.modal', cleanupBackdrop, { once: true });
}

function showFullSizeImage(src, alt){
  // Create or get the full-size image modal
  let fullImageModal = document.getElementById('fullImageModal');
  
  if (!fullImageModal) {
    // Create the modal if it doesn't exist
    fullImageModal = document.createElement('div');
    fullImageModal.id = 'fullImageModal';
    fullImageModal.className = 'modal fade';
    fullImageModal.setAttribute('tabindex', '-1');
    
    fullImageModal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center p-0">
            <img id="fullSizeImg" class="img-fluid" src="" alt="">
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(fullImageModal);
    
    // Create a completely separate close handler
    const closeBtn = fullImageModal.querySelector('.btn-close');
    closeBtn.addEventListener('click', function() {
      // Close using Bootstrap API
      const bsModal = bootstrap.Modal.getInstance(fullImageModal);
      if (bsModal) bsModal.hide();
    });
  }
  
  // Set the image source
  const fullSizeImg = fullImageModal.querySelector('#fullSizeImg');
  fullSizeImg.src = src;
  fullSizeImg.alt = alt || '';
  
  // Show the modal
  const bsModal = new bootstrap.Modal(fullImageModal);
  bsModal.show();
}

function cleanupBackdrop() {
  // Remove all modal backdrops
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => {
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
  });
  
  // Also reset body classes and styles
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}
