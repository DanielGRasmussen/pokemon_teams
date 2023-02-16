import ExternalServices from "./ExternalServices.mjs";
import { getIdFromURL, renderWithTemplate } from "./utils.mjs";
import { pokemonDetailTemplate } from "./templates.mjs";

export async function loadDetails(pokemonId, target, highlights = []) {
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
		pokemonDetailTemplate(pokemon, data, chain, highlights),
		target,
		pokemon
	);
}