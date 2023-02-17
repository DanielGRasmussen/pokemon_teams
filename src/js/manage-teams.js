import {
	getLocalStorage,
	loadHeaderFooter,
	renderWithTemplate,
	setLocalStorage
} from "./utils.mjs";
import { teamTemplate } from "./templates.mjs";
import { loadDetails } from "./PokemonDetails.mjs";

loadHeaderFooter("manage");
const currentTeam = "1";
let currentSlot = -1;

function loadTeam() {
	const teams = getLocalStorage("teams");
	const teamImages = teamTemplate(teams[currentTeam]);
	const team = document.getElementById("team");
	// Clear out main. For some reason .empty() and .innerHTML = "" don't work.
	if (team) {
		team.remove();
	}
	const details_page = document.getElementById("detail-page");
	if (details_page) {
		details_page.innerHTML = "";
	}
	// Reset currentSlot to default
	currentSlot = -1;
	renderWithTemplate(teamImages, document.querySelector("main"));
	teamDetails();
}

function listHighlights() {
	// Add an event listener to moves
	document.getElementById("moves").addEventListener("click", (event) => {
		// Check if user clicked on li
		if (!event.target || event.target.nodeName !== "LI") {
			return;
		}
		const teams = getLocalStorage("teams");
		const pokemon = teams[currentTeam][currentSlot];

		const text = event.target.textContent.toLowerCase();
		const index = pokemon.moves.indexOf(text);
		// Check # of selected from localstorage, if 4, cancel
		if (index !== -1) {
			// Unhighlight the clicked `li` element
			event.target.classList.remove("selected");
			pokemon.moves.splice(index, 1);
		} else if (pokemon.moves.length < 4) {
			// Highlight the clicked `li` element
			event.target.classList.add("selected");
			pokemon.moves.push(text);
		}
		setLocalStorage("teams", teams);
	});
}

function teamDetails() {
	// Renders pokemon details on click of the images
	document.getElementById("team").addEventListener("click", async (event) => {
		if (event.target.tagName !== "IMG") {
			return;
		}
		const teams = getLocalStorage("teams");

		// Get classes, then split it if it isn't undefined
		const classes = event.target.classList[0];
		if (!classes) {
			return;
		}
		const details = document.getElementById("detail-page");
		// Clear out the information in case this is the second pokemon they selected
		details.innerHTML = "";

		currentSlot = classes.split("-")[1] - 1;
		// Get the pokemon data
		const pokemon = teams[currentTeam][currentSlot];
		await loadDetails(pokemon.id, details, pokemon.moves, true);
		// Add the management buttons
		renderWithTemplate(
			`<div id="manageButtons"><input type="button" value="Remove" id="remove"><input type="button" value="Clear" id="clear"></div>`,
			details
		);

		// The clear button's functionality
		document.getElementById("clear").addEventListener("click", (e) => {
			e.preventDefault();
			details.innerHTML = "";
		});

		// The remove button's functionality
		document.getElementById("remove").addEventListener("click", (e) => {
			e.preventDefault();
			teams[currentTeam][currentSlot] = undefined;
			setLocalStorage("teams", teams);
			loadTeam();
		});
		listHighlights();
	});
}

loadTeam();
