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

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
	const htmlStrings = list.map(templateFn);
	if (clear) {
		parentElement.innerHTML = "";
	}
	parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
	parentElement.insertAdjacentHTML("afterbegin", template);
	if (callback) {
		callback(data);
	}
}

async function loadTemplate(path) {
	const res = await fetch(path);
	return await res.text();
}

export async function loadHeaderFooter(page) {
	const headerTemplate = await loadTemplate("../partials/header.html");
	const headerElement = document.querySelector("#main-header");
	const footerTemplate = await loadTemplate("../partials/footer.html");
	const footerElement = document.querySelector("#main-footer");

	renderWithTemplate(headerTemplate, headerElement);
	renderWithTemplate(footerTemplate, footerElement);
	
	const link = document.getElementById(page);
	if (link) {
		link.classList.add("active")
	}
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

// Basic search function to find Pokemon who's names start with search term
export function searchPokemonByName(pokemonArray, searchTerm) {
	let pokemonName;
	return pokemonArray.filter((pokemon) => {
		if ("pokemon" in pokemon) {
			pokemonName = pokemon.pokemon.name;
		} else {
			pokemonName = pokemon.name;
		}
		const lowerCaseName = pokemonName.toLowerCase();
		return lowerCaseName.includes(searchTerm.toLowerCase());
	});
}

// Gets the ID from the Pokemon URL provided.
export function getIdFromURL(url) {
	return url.split("/")[6];
}

// Separate  array into segments of x
export function separateArray(array, chunk) {
	let i, j, tempArray;
	let newArray = [];
	
	for (i = 0, j = array.length; i < j; i += chunk) {
		tempArray = array.slice(i, i + chunk);
		newArray.push(tempArray);
	}
	
	return newArray;
}
