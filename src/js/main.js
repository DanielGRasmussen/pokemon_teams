import ExternalServices from "./ExternalServices.mjs";
import { loadHeaderFooter, removeUniquePokemon, searchPokemonByName } from "./utils.mjs";

loadHeaderFooter();

const services = new ExternalServices();

async function searchPokemon(search = "", types = [], generation = 0, limit = 20, page = 1) {
	let pokemon = [];

	// Check if types is set, if so then get those pokemon
	// Check if generation is between 1-9, if so get those pokemon
	// Check if search is set, if so filter by search
	if (types.length > 0) {
		pokemon = await services.getPokemonByTypes(types);
	}

	if (0 < generation < 10) {
		const pokemonGeneration = await services.getPokemonByGeneration(generation, limit, page);
		if (types.length > 0) {
			pokemon = removeUniquePokemon(pokemon, pokemonGeneration);
		} else {
			pokemon = pokemonGeneration;
		}
	}

	if (!types.length > 0 && !(0 < generation < 10)) {
		pokemon = await services.getAllPokemon(limit, page, limit, page);
	}

	if (search.length > 0) {
		pokemon = searchPokemonByName(pokemon, search);
	}

	document.getElementById("content").innerHTML = JSON.stringify(pokemon);
}

searchPokemon("", ["fire"], 0, 20, 1);
