import EVENTS_DATA from "./events/events-data.js";
import {
  renderEventCards,
  attachEventCardHandlers,
} from "./events/events-render.js";
import BOARD_DATA from "./eboard-data.js";

//const EVENTS_JSON = JSON.parse(EVENTS_DATA);
//const BOARD_JSON = JSON.parse(BOARD_DATA);

// ------------------------
// INITIALIZATION
// ------------------------

document.addEventListener("DOMContentLoaded", function () {
  setupBoardMemberHandlers();
  renderEventCards(EVENTS_DATA, "event-container");
  attachEventCardHandlers(EVENTS_DATA, "event-container");
  initRevealAnimations();

  if (btn2023) btn2023.classList.add("inactive");
  if (btn2024) btn2024.classList.remove("inactive");
});

// ------------------------
// ANIMATION FUNCTIONS
// ------------------------

function initRevealAnimations() {
  // Grab all reveal class elements
  const reveals = document.querySelectorAll(
    ".reveal, .reveal-lg, .reveal-md, .reveal-forward, .reveal-lg-forward, .reveal-left, .reveal-right, .reveal-sm-left, .reveal-sm-right"
  );

  const revealElements = function () {
    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      const elementVisible = 50; // When the element becomes visible

      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      }
    }
  };

  window.addEventListener("scroll", revealElements);
  window.addEventListener("resize", revealElements);

  // Initial call to reveal elements that are already visible
  revealElements();
}

// ------------------------
// BOARD CARD FUNCTIONS
// ------------------------

function displayBoard(year) {
  const boardContainer = document.getElementById("board-body");
  const members = BOARD_DATA.boards[year].members; //grab members of respective year

  if (!boardContainer) {
    return;
  } else {
    boardContainer.innerHTML = ""; //clear container

    for (let i = 0; i < members.length; i++) {
      const commentNode = document.createComment(` ${members[i].name} `); // comment member's name
      boardContainer.appendChild(commentNode);

      //Create member card
      const memberCard = document.createElement("div");
      memberCard.classList.add(
        "col-lg-3",
        "col-md-4",
        "col-6",
        "py-md-3",
        "mx-auto"
      );

      const delay = ((i % 4) + 1) * 100; // calculate delay needed based on position in row

      memberCard.innerHTML = `
      <div class="board-card reveal delay-${delay}">
        <div class="board-card-inner rounded-4">
            <img
              src="${members[i].img}"
              class="img-fluid rounded-4 board-member-trigger"
              alt="${members[i].name}"
              role="button"
              tabindex="0"
              data-board-year="${year}"
              data-member-index="${i}"
            >

            <div class="gradient-overlay"></div> <!--Hover effect-->
            
        </div>

        <a href="${members[i].linkedin}" class="text-decoration-none text-dark ">
            <h4 class = "mt-3 mb-0" >
                ${members[i].name}
                <i class="bi bi-linkedin text-dark fs-6 align-items-center"></i>
            </h4>
        </a> 
        
        <p class="board-card-role mb-0">${members[i].position}</p>

      </div>`;

      boardContainer.appendChild(memberCard);
    }

    balanceGrid(boardContainer, members.length); //balance bootstrap grid if last row is not full (center)
    initRevealAnimations();
  }
}
displayBoard("2025-2026"); // display most recent board by default

//BUTTON LOGIC
const btn2023 = document.getElementById("btn-2023-2024");
const btn2024 = document.getElementById("btn-2024-2025");
const btn2025 = document.getElementById("btn-2025-2026");

//2023-2024 Button
if (btn2023) {
  btn2023.addEventListener("click", function () {
    displayBoard("2023-2024");

    const buttons = document.querySelectorAll(".board-btn");
    //set all buttons to inactive
    buttons.forEach((btn) => {
      btn.classList.add("inactive");
    });
    btn2023.classList.remove("inactive"); // set target button to active
  });
}

//2024-2025 Button
if (btn2024) {
  btn2024.addEventListener("click", function () {
    displayBoard("2024-2025");

    const buttons = document.querySelectorAll(".board-btn");
    //set all buttons to inactive
    buttons.forEach((btn) => {
      btn.classList.add("inactive");
    });
    btn2024.classList.remove("inactive"); // set target button to active
  });
}

//2024-2025 Button
if (btn2025) {
  btn2025.addEventListener("click", function () {
    displayBoard("2025-2026");

    const buttons = document.querySelectorAll(".board-btn");
    //set all buttons to inactive
    buttons.forEach((btn) => {
      btn.classList.add("inactive");
    });
    btn2025.classList.remove("inactive"); // set target button to active
  });
}

// ------------------------
// BOARD MEMBER MODAL
// ------------------------

function setupBoardMemberHandlers() {
  const boardContainer = document.getElementById("board-body");
  if (!boardContainer) return;

  // Event delegation: one listener for all member images (even after re-render)
  boardContainer.addEventListener("click", function (e) {
    // Don’t hijack clicks on the LinkedIn <a> (let it navigate)
    if (e.target.closest("a")) return;

    const trigger = e.target.closest(".board-member-trigger");
    if (!trigger) return;

    const year = trigger.getAttribute("data-board-year");
    const index = Number(trigger.getAttribute("data-member-index"));
    const member = BOARD_DATA?.boards?.[year]?.members?.[index];

    if (!member) return;

    openMemberModal(member);
  });

  // Optional: keyboard support (Enter/Space)
  boardContainer.addEventListener("keydown", function (e) {
    const trigger = e.target.closest(".board-member-trigger");
    if (!trigger) return;

    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();

    const year = trigger.getAttribute("data-board-year");
    const index = Number(trigger.getAttribute("data-member-index"));
    const member = BOARD_DATA?.boards?.[year]?.members?.[index];
    if (!member) return;

    openMemberModal(member);
  });
}

function openMemberModal(member) {
  const nameEl = document.getElementById("memberModalName");
  const roleEl = document.getElementById("memberModalRole");
  const bioEl = document.getElementById("memberModalBio");
  const imgEl = document.getElementById("memberModalImg");
  const linkedInEl = document.getElementById("memberModalLinkedIn");

  if (nameEl) nameEl.textContent = member.name || "";
  if (roleEl) roleEl.textContent = member.position || "";
  if (bioEl) bioEl.textContent = member.bio || "";

  if (imgEl) {
    imgEl.src = member.img || "";
    imgEl.alt = member.name || "Board member";
  }

  if (linkedInEl) {
    if (member.linkedin) {
      linkedInEl.href = member.linkedin;
      linkedInEl.classList.remove("d-none");
      linkedInEl.removeAttribute("aria-disabled");
    } else {
      linkedInEl.href = "#";
      linkedInEl.classList.add("d-none");
      linkedInEl.setAttribute("aria-disabled", "true");
    }
  }

  const modalEl = document.getElementById("memberModal");
  if (!modalEl) return;

  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
}

// Add empty "balancer" divs to balance and center bootstrap grid system of last row
function balanceGrid(container, totalMembers) {
  const maxPerRow = 4;
  const membersInLastRow = totalMembers % maxPerRow || maxPerRow;

  // Only add balancers if we have 1 or 2 members in the last row
  if (membersInLastRow === 2) {
    const allMemberCards = container.querySelectorAll(".col-lg-3");

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
