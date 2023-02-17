import ExternalServices from "./ExternalServices.mjs";
import {
	loadHeaderFooter,
	removeUniquePokemon,
	searchPokemonByName,
	getIdFromURL,
	separateArray
} from "./utils.mjs";
import PokemonRender from "./PokemonRender.mjs";

loadHeaderFooter("home");

const services = new ExternalServices();

async function searchPokemon(search = "", types = [], generation = 0) {
	let pokemon = [];

	// Check if types is set, if so then get those pokemon
	// Check if generation is between 1-9, if so get those pokemon
	// Check if search is set, if so filter by search
	// ATM the limit/page is a little weird, don't know if I want to do that myself or leave it as is.
	if (types.length > 0) {
		pokemon = await services.getPokemonByTypes(types);
	}

	if (0 < generation && generation < 10) {
		const pokemonGeneration = await services.getPokemonByGeneration(
			generation
		);
		if (types.length > 0) {
			pokemon = removeUniquePokemon(pokemon, pokemonGeneration);
		} else {
			pokemon = pokemonGeneration;
		}
	}

	if (!types.length > 0 && !(0 < generation && generation < 10)) {
		pokemon = await services.getAllPokemon();
	}

	if (search.length > 0) {
		pokemon = searchPokemonByName(pokemon, search);
	}

	// Add the id field to get sprites easier and get rid of any pokemon.pokemon
	for (let i = 0; i < pokemon.length; i++) {
		if ("pokemon" in pokemon[i]) {
			pokemon[i] = pokemon[i].pokemon;
		}
		pokemon[i].id = getIdFromURL(pokemon[i].url);
	}

	return pokemon;
}

function pageUpdate(render, pokemonList) {
	document.getElementById("content").innerHTML = "";
	render.renderPokemon(pokemonList);
}

document.querySelector("form").addEventListener("submit", (event) => {
	event.preventDefault();

	const search = document.getElementById("search").value;
	// Gets an array of all checked boxes from elements
	const types = Array.from(
		document.querySelectorAll("#types .type input:checked")
	).map((checkbox) => checkbox.value);
	const generations = parseInt(
		Array.from(
			document.querySelectorAll("#generations .generation input:checked")
		).map((checkbox) => checkbox.value)[0]
	);
	const results = parseInt(
		Array.from(
			document.querySelectorAll("#results .result input:checked")
		).map((checkbox) => checkbox.value)[0]
	);
	let page = 0;

	searchPokemon(search, types, generations).then((pokemonList) => {
		const render = new PokemonRender();
		const allPokemonLists = separateArray(pokemonList, results);

		pageUpdate(render, allPokemonLists[page]);

		const prevButton = document.getElementById("prevPage");
		const nextButton = document.getElementById("nextPage");
		nextButton.disabled = false;

		prevButton.addEventListener("click", () => {
			if (page !== 0) {
				page--;
				pageUpdate(render, allPokemonLists[page]);
				nextButton.disabled = false;
				if (page === 0) {
					prevButton.disabled = true;
				}
			}
		});

		nextButton.addEventListener("click", () => {
			if (page !== allPokemonLists.length - 1) {
				page++;
				pageUpdate(render, allPokemonLists[page]);
				prevButton.disabled = false;
				if (page === allPokemonLists.length - 1) {
					nextButton.disabled = true;
				}
			}
		});
	});
});
