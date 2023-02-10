const types = document.getElementById("types-button");
const types_dropdown = document.getElementById("types");
const generations = document.getElementById("generations-button");
const generations_dropdown = document.getElementById("generations");
const results = document.getElementById("results-button");
const results_dropdown = document.getElementById("results");

function hideDropdowns() {
	types_dropdown.classList.add("hidden");
	generations_dropdown.classList.add("hidden");
	results_dropdown.classList.add("hidden");
}

types.addEventListener("click", function () {
	hideDropdowns();
	types_dropdown.classList.remove("hidden");
});

generations.addEventListener("click", function () {
	hideDropdowns();
	generations_dropdown.classList.remove("hidden");
});

results.addEventListener("click", function () {
	hideDropdowns();
	results_dropdown.classList.remove("hidden");
});

const dropdowns = document.querySelectorAll(".dropdown-container");

document.addEventListener("click", (event) => {
	let target = event.target;
	let isDropdown = false;

	dropdowns.forEach((dropdown) => {
		if (dropdown === target || dropdown.contains(target)) {
			isDropdown = true;
		}
	});

	if (!isDropdown) {
		hideDropdowns();
	}
});
