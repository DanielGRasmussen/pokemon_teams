import { getIdFromURL } from "./utils.mjs";

const spriteURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

export function pokemonTemplate(pokemon) {
	const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
	return `<section class="pokemon-card">
                <a href="/pokemon-detail/?pokemon=${getIdFromURL(pokemon.url)}">
                	<h3>${name}</h3>
                	<img src="${spriteURL}/${pokemon.id}.png" alt="Image of ${name}">
                </a>
            </section>`;
}

export function evolutionTemplate(data) {
	let list = "<ul id='evolutions'>";
	for (const pokemon of data) {
		const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
		list += `<li><a href="/pokemon-detail/?pokemon=${pokemon.id}"><img src="${spriteURL}/${pokemon.id}.png" alt="Image of ${name}"><h4>${name}</h4></a></li>`;
	}
	list += "</ul>";
	return list;
}

export function typeTemplate(data) {
	const types = data.types;
	let list = "<ul id='types'>";
	for (let type of types) {
		type = type.type;
		const name = type.name[0].toUpperCase() + type.name.slice(1);
		list += `<li><span class="${type.name}">${name}</span></li>`;
	}
	list += "</ul>";
	return list;
}

export function movesTemplate(data) {
	const moves = data.moves;
	let list = "<ul id='moves'>";
	for (let move of moves) {
		move = move.move;
		const name = move.name[0].toUpperCase() + move.name.slice(1);
		list += `<li>${name}</li>`;
	}
	list += "</ul>";
	return list;
}