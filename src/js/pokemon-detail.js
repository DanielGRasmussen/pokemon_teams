import {
	getIdFromURL,
	loadHeaderFooter,
	renderWithTemplate
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { evolutionTemplate, typeTemplate } from "./templates.mjs";

loadHeaderFooter("");
const spriteURL =
	"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

function pokemonDetailTemplate(pokemon, data, chain) {
	const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
	const generation = pokemon.generation.name.split("-")[1].toUpperCase();
	let flavor_text = "No description available";
	const types = typeTemplate(data);

	// Get list of pokemon evolution IDs and Names
	let evolutions = [
		{
			name: chain.chain.species.name,
			id: getIdFromURL(chain.chain.species.url)
		}
	];
	let evolution = chain.chain.evolves_to;
	let i = 0;
	while (evolution && i < 50) {
		if (Array.isArray(evolution)) {
			for (const current_evolution of evolution) {
				evolutions.push({
					name: current_evolution.species.name,
					id: getIdFromURL(current_evolution.species.url)
				});
			}
			if (evolution[0]) {
				evolution = evolution[0].evolves_to;
			}
		}
		i++;
	}
	let evolutionList = "";
	// Removes evolution chain if there is no other evolutions
	if (evolutions.length > 1) {
		// Gets actual HTML evolution chain
		evolutionList = evolutionTemplate(evolutions);
	}

	// Gets either flavor text 1/2 depending on if 1 is in english. Otherwise, is left as "No description available"
	if (pokemon.flavor_text_entries.length) {
		let possible_flavor_text = pokemon.flavor_text_entries[0];
		// Check if it is in English
		if (possible_flavor_text.language.name === "en") {
			flavor_text = possible_flavor_text.flavor_text.replaceAll(
				/[\n\f]/g, // Regex to find characters that shouldn't be there (\n, \f)
				" "
			);
		} else {
			// Check second flavor text
			possible_flavor_text = pokemon.flavor_text_entries[1];
			// Check if it is in English
			if (possible_flavor_text.language.name === "en") {
				flavor_text = possible_flavor_text.flavor_text.replaceAll(
					/[\n\f]/g, // Regex to find characters that shouldn't be there (\n, \f)
					" "
				);
			}
		}
	}

	return `<section id="pokemon-detail">
                <h3>${name}</h3>
                ${types}
                <img src="${spriteURL}/${pokemon.id}.png" alt="Image of ${name}">
                <p>Generation ${generation}</p>
                <p>${flavor_text}</p>
                ${evolutionList}
            </section>`;
}

async function loadDetails() {
	const pokemonId = new URLSearchParams(window.location.search).get(
		"pokemon"
	);
	const services = new ExternalServices();

	const pokemon = await services.getPokemonByName(pokemonId, true);
	const data = await services.getPokemonByName(pokemonId, false);
	const chain = await services.getEvolutionChain(
		getIdFromURL(pokemon.evolution_chain.url)
	);

	console.log(pokemon);
	console.log(chain);
	console.log(data);

	const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
	document.querySelector("title").innerHTML = name + " | Pokémon Teams";

	renderWithTemplate(
		pokemonDetailTemplate(pokemon, data, chain),
		document.querySelector("main"),
		pokemon
	);
}

loadDetails();
