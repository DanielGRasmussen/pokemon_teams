// retrieve data from localstorage
export function getLocalStorage(key) {
	return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}
// delete local storage item
export function deleteLocalStorage(key) {
	localStorage.removeItem(key);
}

export function renderWithTemplate(template, parentElement, data, callback) {
	parentElement.insertAdjacentHTML("afterbegin", template);
	if (callback) {
		callback(data);
	}
}

async function loadTemplate(path) {
	const res = await fetch(path);
	const template = await res.text();
	return template;
}

export async function loadHeaderFooter() {
	const headerTemplate = await loadTemplate("../partials/header.html");
	const headerElement = document.querySelector("#main-header");
	const footerTemplate = await loadTemplate("../partials/footer.html");
	const footerElement = document.querySelector("#main-footer");

	renderWithTemplate(headerTemplate, headerElement);
	renderWithTemplate(footerTemplate, footerElement);
}

// Removes any duplicate pokemon. Doesn't use filter because it has to check name
export function removeDuplicatePokemon(list1, list2) {
	const allPokemon = list1.concat(list2);
	let uniquePokemon = [];
	let pokemonNames = [];
	let pokemonName;

	for (const pokemon of allPokemon) {
		if ("pokemon" in pokemon) {
			pokemonName = pokemon.pokemon.name;
		} else {
			pokemonName = pokemon.name;
		}
		if (!pokemonNames.includes(pokemonName)) {
			uniquePokemon.push(pokemon);
			pokemonNames.push(pokemonName);
		}
	}
	return uniquePokemon;
}

// Keeps all duplicate pokemon.
export function removeUniquePokemon(list1, list2) {
	const allPokemon = list1.concat(list2);
	const uniquePokemon = removeDuplicatePokemon(list1, list2);

	return allPokemon.filter((item) => !uniquePokemon.includes(item));
}

// Basic search function to find pokemon who's names start with searchterm
export function searchPokemonByName(pokemonArray, searchTerm) {
	let pokemonName;
	return pokemonArray.filter((pokemon) => {
		if ("pokemon" in pokemon) {
			pokemonName = pokemon.pokemon.name;
		} else {
			pokemonName = pokemon.name;
		}
		const lowerCaseName = pokemonName.toLowerCase();
		return lowerCaseName.startsWith(searchTerm.toLowerCase());
	});
}
