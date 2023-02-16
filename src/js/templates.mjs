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

export function movesTemplate(data, highlights) {
	const moves = data.moves;
	let list = "<ul id='moves'>";
	for (let move of moves) {
		move = move.move;
		const name = move.name[0].toUpperCase() + move.name.slice(1);
		if (highlights.includes(name)) {
			list += `<li class="selected">${name}</li>`;
		} else {
			list += `<li>${name}</li>`;
		}
		
	}
	list += "</ul>";
	return list;
}

export function pokemonDetailTemplate(pokemon, data, chain, highlights) {
	const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
	const generation = pokemon.generation.name.split("-")[1].toUpperCase();
	let flavor_text = "No description available";
	const types = typeTemplate(data);
	const moves = movesTemplate(data, highlights);
	
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
                <h1>${name}</h1>
                ${types}
                <img src="${spriteURL}/${pokemon.id}.png" alt="Image of ${name}">
                <p>Generation ${generation}</p>
                <p>${flavor_text}</p>
                ${evolutionList}
                <h2>Moves</h2>
                ${moves}
            </section>`;
}

export function teamTemplate(team) {
	return `<ul id="team">
				<li><img src="${spriteURL}/${team[0].id}.png" alt="Image of ${team[0].name}" class="pokemon-0"></li>
				<li><img src="${spriteURL}/${team[1].id}.png" alt="Image of ${team[1].name}" class="pokemon-1"></li>
				<li><img src="${spriteURL}/${team[2].id}.png" alt="Image of ${team[2].name}" class="pokemon-2"></li>
				<li><img src="${spriteURL}/${team[3].id}.png" alt="Image of ${team[3].name}" class="pokemon-3"></li>
				<li><img src="${spriteURL}/${team[4].id}.png" alt="Image of ${team[4].name}" class="pokemon-4"></li>
				<li><img src="${spriteURL}/${team[5].id}.png" alt="Image of ${team[5].name}" class="pokemon-5"></li>
			</ul>`
}