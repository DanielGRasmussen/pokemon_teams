import { loadHeaderFooter, renderWithTemplate } from "./utils.mjs";
import { teamTemplate } from "./templates.mjs";
import { loadDetails } from "./PokemonDetails.mjs";

loadHeaderFooter();

const team = [
	{ name: "10", id: 10, moves: ["Growth", "Bide"] },
	{ name: "20", id: 20, moves: ["Growth", "Bide"] },
	{ name: "30", id: 30, moves: ["Growth", "Bide"] },
	{ name: "40", id: 40, moves: ["Growth", "Bide"] },
	{ name: "50", id: 50, moves: ["Growth", "Bide"] },
	{ name: "60", id: 60, moves: ["Growth", "Bide"] }
];

function loadTeam() {
	// const team = [
	// 	{ name: "1", id: 1, moves: ["Growth", "Bide"] },
	// 	{ name: "2", id: 2, moves: ["Growth", "Bide"] },
	// 	{ name: "3", id: 3, moves: ["Growth", "Bide"] },
	// 	{ name: "4", id: 4, moves: ["Growth", "Bide"] },
	// 	{ name: "5", id: 5, moves: ["Growth", "Bide"] },
	// 	{ name: "6", id: 6, moves: ["Growth", "Bide"] }
	// ];

	const teamImages = teamTemplate(team);
	renderWithTemplate(teamImages, document.querySelector("main"));
}

function listHighlights() {
	// Add an event listener to moves
	document.getElementById("moves").addEventListener("click", (event) => {
		// Check if user clicked on li
		if (event.target && event.target.nodeName === "LI") {
			// TODO check # of selected from localstorage, if 4, don't do this
			// Highlight the clicked `li` element
			event.target.classList.toggle("selected");

			const text = event.target.textContent;
			// TODO add text to movelist in localstorage
		}
	});
}

loadTeam();
const details = document.getElementById("detail-page");

// Renders pokemon details on click of the images
document.getElementById("team").addEventListener("click", async (event) => {
	if (event.target.tagName === "IMG") {
		// const team = [
		// 	{ name: "1", id: 1, moves: ["Growth", "Bide"] },
		// 	{ name: "2", id: 2, moves: ["Growth", "Bide"] },
		// 	{ name: "3", id: 3, moves: ["Growth", "Bide"] },
		// 	{ name: "4", id: 4, moves: ["Growth", "Bide"] },
		// 	{ name: "5", id: 5, moves: ["Growth", "Bide"] },
		// 	{ name: "6", id: 6, moves: ["Growth", "Bide"] }
		// ];

		// Clear out the information in case this is the second pokemon they selected
		details.innerHTML = "";
		// Get position in list (pokemon-0/1/2/3/4/5), split it, then get the pokemon data
		const pokemon = team[event.target.classList[0].split("-")[1]];
		await loadDetails(pokemon.id, details, pokemon.moves);
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
			// TODO remove from team
		});
		listHighlights();
	}
});
