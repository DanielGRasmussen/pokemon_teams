// Team selection buttons
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const teamButtons = document.querySelectorAll(".team-option");
const pokemonSlots = document.querySelector(".team-slots");
const modal = document.getElementById("team-modal");
// Add to team button
const addButton = document.getElementById("add-to-team");
let currentTeam = "";

teamButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const teams = getLocalStorage("teams");
		// Set the current team to the selected team
		currentTeam = button.textContent.split(" ")[1];
		const team = teams[currentTeam];

		// Deselect other buttons
		teamButtons.forEach((element) => {
			element.classList.remove("selected");
		});

		// Highlight selected button
		button.classList.add("selected");

		// Shows pokemon depending on team selected
		for (let i = 0; i < 6; i++) {
			if (team[i]) {
				document.getElementById(`slot${i + 1}`).textContent =
					team[i].name[0].toUpperCase() + team[i].name.slice(1);
			} else {
				document.getElementById(`slot${i + 1}`).textContent = "Empty";
			}
		}
		// Show pokemon list
		pokemonSlots.classList.remove("hidden");
		if (window.innerWidth < 800) {
			document.querySelector(".team-selection").classList.add("hidden");
		}
	});
});

// Slot selection buttons
const slotButtons = document.querySelectorAll(".slot-option");
slotButtons.forEach((button) => {
	button.addEventListener("click", () => {
		// Call addToTeam function with slot ID and current team as parameters
		addToTeam(button.textContent.split(" ")[1]);

		// Hide modal
		closeModal();
	});
});

addButton.addEventListener("click", openModal);

// Hides the modal if the user clicks a spot not on the
document.addEventListener("click", (event) => {
	const modal_content = document.querySelector(".modal-content");
	if (!modal_content.contains(event.target) && event.target !== addButton) {
		closeModal();
	}
});

// Show modal
function openModal() {
	modal.style.display = "block";
}

// Hide modal
function closeModal() {
	modal.style.display = "none";
	// Reset the modal
	teamButtons.forEach((element) => {
		element.classList.remove("selected");
	});
	pokemonSlots.classList.add("hidden");

	if (window.innerWidth < 800) {
		document.querySelector(".team-selection").classList.remove("hidden");
	}
}

// Function to add to team
function addToTeam(slotId) {
	const slot = parseInt(slotId) - 1;
	const teams = getLocalStorage("teams");
	// Get pokemon name from title
	const name = document.querySelector("h1").textContent.toLowerCase();
	const id = new URLSearchParams(window.location.search).get("pokemon");
	// Add pokemon to localstorage in slot of team
	teams[currentTeam][slot] = { name: name, id: id, moves: [] };
	setLocalStorage("teams", teams);
}
