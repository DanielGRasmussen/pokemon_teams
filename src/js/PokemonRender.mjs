import { renderListWithTemplate } from "./utils.mjs";
import { pokemonTemplate } from "./templates.mjs";

export default class PokemonRender {
	renderPokemon(pokemon) {
		renderListWithTemplate(pokemonTemplate, document.querySelector("#content"), pokemon)
	}
}