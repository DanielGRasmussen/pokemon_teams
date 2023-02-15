import {
	getIdFromURL,
	loadHeaderFooter,
	renderWithTemplate
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

loadHeaderFooter("");

const spriteURL =
	"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

function evolutionTemplate(data) {
	let list = "<ul id='evolutions'>";
	for (const pokemon of data) {
		const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
		list += `<li><a href="/pokemon-detail/?pokemon=${pokemon.id}"><img src="${spriteURL}/${pokemon.id}.png" alt="Image of ${name}"><h4>${name}</h4></a></li>`;
	}
	list += "</ul>";
	return list;
}

function typeTemplate(data) {
	const types = data.types;
	let list = "<ul id='types'>";
	for (let type of types) {
		type = type.type;
		const name = type.name[0].toUpperCase() + type.name.slice(1);
		list += `<li><span>${name}</span></li>`;
	}
	list += "</ul>";
	return list;
}

function pokemonTemplate(pokemon, data, chain) {
	const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
	const generation = pokemon.generation.name.split("-")[1].toUpperCase();
	let flavor_text = "No description available";
	const types = typeTemplate(data);

	let evolutions = [];
	let evolution = chain.chain;
	while (evolution) {
		if (Array.isArray(evolution)) {
			evolution = evolution[0];
		}

		if (evolution) {
			evolutions.push({
				name: evolution.species.name,
				id: getIdFromURL(evolution.species.url)
			});
			evolution = evolution.evolves_to;
		}
	}
	const evolutionList = evolutionTemplate(evolutions);

	if (pokemon.flavor_text_entries.length) {
		flavor_text = pokemon.flavor_text_entries[0].flavor_text.replaceAll(
			/[\n\f]/g,
			" "
		);
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
		pokemonTemplate(pokemon, data, chain),
		document.querySelector("main"),
		pokemon
	);
}

loadDetails();
