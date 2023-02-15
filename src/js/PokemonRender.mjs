import { renderListWithTemplate, getIdFromURL } from "./utils.mjs";

const spriteURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

export default class PokemonRender {
	renderPokemon(pokemon) {
		renderListWithTemplate(this.pokemonTemplate, document.querySelector("#content"), pokemon)
	}
	
	pokemonTemplate(pokemon) {
		const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
		return `<section class="pokemon-card">
                <a href="/pokemon-detail/?pokemon=${getIdFromURL(pokemon.url)}">
                	<h3>${name}</h3>
                	<img src="${spriteURL}/${pokemon.id}.png" alt="Image of ${name}">
                </a>
            </section>`;
	}
}