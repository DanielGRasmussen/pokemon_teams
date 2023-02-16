import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	root: "src/",

	build: {
		outDir: "../dist",
		rollupOptions: {
			input: {
				main: resolve(__dirname, "src/index.html"),
				detail: resolve(__dirname, "src/pokemon-detail/index.html"),
				manage: resolve(__dirname, "src/manage-teams/index.html")
			}
		}
	}
});
