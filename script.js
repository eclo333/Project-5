// Central state management object
let state = {
  totalAttendance: 0,
  teamCounts: {
    water: 0,
    zero: 0,
    renewables: 0,
  },
  attendees: [],
};

// DOM Elements
const checkInForm = document.getElementById("check-in-form");
const attendeeNameInput = document.getElementById("attendee-name");
const teamSelect = document.getElementById("team-select");
const attendeeList = document.getElementById("attendee-list");
const emptyState = document.getElementById("empty-state");
const totalCountDisplay = document.getElementById("total-count");
const waterCountDisplay = document.getElementById("water-count");
const zeroCountDisplay = document.getElementById("zero-count");
const renewablesCountDisplay = document.getElementById("renewables-count");
const progressBar = document.getElementById("progressBar");
const attendeeCountDisplay = document.getElementById("attendeeCount");
const checkInBtn = document.getElementById("check-in-btn");

// Load state from localStorage on page load
function loadFromLocalStorage() {
  const savedState = localStorage.getItem("checkInState");
  if (savedState) {
    state = JSON.parse(savedState);
    rehydrateUI();
  }
}

// Save state to localStorage
function saveToLocalStorage() {
  localStorage.setItem("checkInState", JSON.stringify(state));
}

// Update all DOM elements with current state
function updateUI() {
  // Update total count display
  totalCountDisplay.textContent = state.totalAttendance;
  attendeeCountDisplay.textContent = state.totalAttendance;

  // Update team-specific counters
  waterCountDisplay.textContent = state.teamCounts.water;
  zeroCountDisplay.textContent = state.teamCounts.zero;
  renewablesCountDisplay.textContent = state.teamCounts.renewables;

  // Update progress bar (max is 50)
  const progressPercent = (state.totalAttendance / 50) * 100;
  progressBar.style.width = `${progressPercent}%`;

  // Render attendee list
  renderAttendees();

  // Save to localStorage
  saveToLocalStorage();
}

// Render attendees list dynamically from state
function renderAttendees() {
  // Clear the current list
  attendeeList.innerHTML = "";

  // If no attendees, show empty state
  if (state.attendees.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  // Hide empty state if attendees exist
  emptyState.style.display = "none";

  // Create list items for each attendee
  state.attendees.forEach(function (attendee) {
    const listItem = document.createElement("li");
    listItem.textContent = `${attendee.name} - ${attendee.team}`;
    attendeeList.appendChild(listItem);
  });
}

// Validate and process check-in
function handleCheckIn(event) {
  event.preventDefault();

  // Get input values and trim whitespace
  const nameInput = attendeeNameInput.value.trim();
  const teamInput = teamSelect.value;

  // Validate that name is not empty
  if (nameInput === "") {
    alert("Please enter a name before checking in.");
    return;
  }

  // Validate that a team is selected
  if (teamInput === "") {
    alert("Please select a team.");
    return;
  }

  // Increment total attendance
  state.totalAttendance += 1;

  // Increment team-specific count
  state.teamCounts[teamInput] += 1;

  // Add attendee to the attendees array
  state.attendees.push({
    name: nameInput,
    team: getTeamName(teamInput),
  });

  // Update UI and save to localStorage
  updateUI();

  // Clear form inputs
  attendeeNameInput.value = "";
  teamSelect.value = "";

  // Check if goal reached (50 attendees)
  if (state.totalAttendance === 50) {
    celebrationLogic();
  }
}

// Get full team name from team code
function getTeamName(teamCode) {
  const teamMap = {
    water: "🌊 Team Water Wise",
    zero: "🌿 Team Net Zero",
    renewables: "⚡ Team Renewables",
  };
  return teamMap[teamCode];
}

// Determine which team has the highest count
function getWinningTeam() {
  const { water, zero, renewables } = state.teamCounts;
  const maxCount = Math.max(water, zero, renewables);

  if (water === maxCount) {
    return "🌊 Team Water Wise";
  } else if (zero === maxCount) {
    return "🌿 Team Net Zero";
  } else {
    return "⚡ Team Renewables";
  }
}

// Celebration logic when 50 attendees reached
function celebrationLogic() {
  const winningTeam = getWinningTeam();

  // Trigger celebration alert
  alert(
    `🎉 GOAL REACHED! 🎉\n\n` +
      `We've achieved 50 attendees!\n\n` +
      `Sustainability Winner: ${winningTeam}\n\n` +
      `Thank you for your commitment to sustainability!`,
  );

  // Optional: Disable the check-in button after reaching goal
  checkInBtn.disabled = true;
  checkInBtn.textContent = "✓ Goal Reached!";
  checkInBtn.style.opacity = "0.6";
}

// Rehydrate UI from saved state on page load
function rehydrateUI() {
  updateUI();
}

// Set up event listeners
function initializeApp() {
  // Load data from localStorage
  loadFromLocalStorage();

  // Add event listener to form submission
  checkInForm.addEventListener("submit", handleCheckIn);
}

// Run initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initializeApp);
