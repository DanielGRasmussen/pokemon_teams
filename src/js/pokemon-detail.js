import { loadHeaderFooter } from "./utils.mjs";
import { loadDetails } from "./PokemonDetails.mjs";

loadHeaderFooter("");

loadDetails(
	new URLSearchParams(window.location.search).get("pokemon"),
	document.querySelector("#content")
);
