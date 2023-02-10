import axios from "axios";
import { removeUniquePokemon } from "./utils.mjs";

const baseURL = "https://pokeapi.co/api/v2";

export default class ExternalServices {
	async getAllPokemon() {
		const result = await axios.get(
			`${baseURL}/pokemon?limit=2000`
		);
		console.log(result)
		return result.data.results;
	}
	
	async getPokemonByName(name) {
		try {
			const response = await axios.get(`${baseURL}/pokemon/${name}`);
			return response.data;
		} catch (error) {
			console.error(error);
			return error;
		}
	}
	
	async getPokemonByType(type) {
		try {
			const response = await axios.get(`${baseURL}/type/${type}`);
			return response.data.pokemon;
		} catch (error) {
			console.error(error);
			return error;
		}
	}
	
	async getPokemonByTypes(types) {
		let pokemonData = [];
		
		for (const type of types) {
			const pokemonList = await this.getPokemonByType(type);
			
			if (pokemonData.length > 0) {
				pokemonData = removeUniquePokemon(pokemonData, pokemonList);
			} else {
				pokemonData = pokemonList;
			}
		}
		
		return pokemonData;
	}
	
	async getPokemonByGeneration(generation) {
		const response = await axios.get(`${baseURL}/generation/${generation}`);
		return response.data.pokemon_species;
	}
}
