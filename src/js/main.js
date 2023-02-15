import ExternalServices from "./ExternalServices.mjs";
import {
	loadHeaderFooter,
	removeUniquePokemon,
	searchPokemonByName,
	getIdFromURL
} from "./utils.mjs";
import PokemonRender from "./PokemonRender.mjs";

loadHeaderFooter("home");

const services = new ExternalServices();

async function searchPokemon(
	search = "",
	types = [],
	generation = 0,
	limit = 20,
	page = 1
) {
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
			generation,
			limit,
			page
		);
		if (types.length > 0) {
			pokemon = removeUniquePokemon(pokemon, pokemonGeneration);
		} else {
			pokemon = pokemonGeneration;
		}
	}

	// If none of the other conditions are met, basically no other search.
	// Limit and page are going to get weird here since if the user types the name
	// of a pokemon at the end they would have to scroll through 500 pages or
	// whatever
	if (!types.length > 0 && !(0 < generation && generation < 10)) {
		pokemon = await services.getAllPokemon(limit, page, limit, page);
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

	searchPokemon(search, types, generations, results, 1).then(
		(pokemonList) => {
			const render = new PokemonRender();
			document.getElementById("content").innerHTML = "";
			render.renderPokemon(pokemonList);
		}
	);
});
