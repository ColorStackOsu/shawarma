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
  if (btn2023) btn2023.classList.add("inactive");
  if (btn2024) btn2024.classList.remove("inactive");
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

//Stat grow animation (GSAP)

gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('.sm-stat').forEach(stat => {
  
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stat,
      start: "top 80%", 
      end: "bottom 20%", 
      scrub: true, 
      markers: false, 
      toggleActions: "play reverse play reverse" 
    }
  });
  
  // More dramatic scaling effect
  tl.fromTo(stat, 
    { scale: 0.9, opacity: 0.7 }, 
    { scale: 1.3, opacity: 1, ease: "power2.out" }
  );
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
          <div class="event-card-media">
            <img src="${events[i].img}" loading="lazy" alt="${events[i].alt}">
            <div class="event-gradient"></div>
          </div>
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
// BOARD CARD FUNCTIONS
// ------------------------

function displayBoard(year){
  const boardContainer = document.getElementById("board-body");
  const members = BOARD_DATA.boards[year].members; //grab members of respective year

  if(!boardContainer){
    return;
  }else{
    boardContainer.innerHTML = ''; //clear container

    for(let i = 0 ; i < members.length; i++){
      const commentNode = document.createComment(` ${members[i].name} `); // comment member's name
      boardContainer.appendChild(commentNode);

      //Create member card
      const memberCard = document.createElement("div");
      memberCard.classList.add("col-lg-3", "col-md-4", "col-6", "py-md-3", "mx-auto");
      
      const delay = ((i % 4) + 1) * 100; // calculate delay needed based on position in row

      memberCard.innerHTML = `
      <div class="board-card reveal delay-${delay}">
        <div class="board-card-inner rounded-4">
            <img src="${members[i].img}" class="img-fluid rounded-4">
            <div class="gradient-overlay"></div> <!--Hover effect-->
            <!--Fun Fact Popup (Hidden)-->
            <div class="fun-fact-overlay">
                <div class="fun-fact-content">
                    <h6 class="mb-1">Fun Fact</h6>
                    <p class="mb-0">${members[i].funfact}</p>
                </div>
            </div>
        </div>

        <a href="${members[i].linkedin}" class="text-decoration-none text-dark ">
            <h4 class = "mt-3 mb-0" >
                ${members[i].name}
                <i class="bi bi-linkedin text-dark fs-6 align-items-center"></i>
            </h4>
        </a> 
        
        <p class="board-card-role mb-0">${members[i].position}</p>

        <!--Fun Fact Popup (SMALL)-->
        <div class="d-lg-none d-block">
            <hr class="d-none divide-line-red my-2 w-50"> 
            <p class="fun-fact-content mb-0">${members[i].funfact}</p>
        </div>

      </div>`

      boardContainer.appendChild(memberCard);

    }

    balanceGrid(boardContainer, members.length); //balance bootstrap grid if last row is not full (center)
    initRevealAnimations();
  }

}
displayBoard("2024-2025"); // display most recent board by default

//BUTTON LOGIC
const btn2023 = document.getElementById("btn-2023-2024");
const btn2024 = document.getElementById("btn-2024-2025");

//2023-2024 Button
if(btn2023){
  btn2023.addEventListener("click", function(){
    displayBoard("2023-2024");
  
    const buttons = document.querySelectorAll(".btn-primary");
    //set all buttons to inactive
    buttons.forEach(btn => {
      btn.classList.add("inactive");
    })
    btn2023.classList.remove("inactive"); // set target button to active
  
  });
}

//2024-2025 Button
if(btn2024){
  btn2024.addEventListener("click", function(){
    displayBoard("2024-2025");
  
    const buttons = document.querySelectorAll(".btn-primary");
    //set all buttons to inactive
    buttons.forEach(btn => {
      btn.classList.add("inactive");
    })
    btn2024.classList.remove("inactive"); // set target button to active
  });
}


// Add empty "balancer" divs to balance and center bootstrap grid system of last row
function balanceGrid(container, totalMembers){
  const maxPerRow = 4;
  const membersInLastRow = totalMembers % maxPerRow || maxPerRow;
  
  // Only add balancers if we have 1 or 2 members in the last row
  if (membersInLastRow === 2) {
    const allMemberCards = container.querySelectorAll('.col-lg-3');
  
    const lastRowStartIndex = totalMembers - membersInLastRow; //find index of last row
    
    //create balancer divs before 
    const balancersBefore = document.createElement("div");
    balancersBefore.classList.add("col-lg-3", "d-none", "d-lg-block");
    
    //insert balancer before the first card of the last row
    const firstCardOfLastRow = allMemberCards[lastRowStartIndex];
    container.insertBefore(balancersBefore, firstCardOfLastRow);

    //const numBalancersAfter = membersInLastRow === 1 ? 2 : 1;

    const balancerAfter = document.createElement("div");
    balancerAfter.classList.add("col-lg-3", "d-none", "d-lg-block");
    container.appendChild(balancerAfter);
    
  }
}


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
