import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
		  allow: [
			'/workspaces/EstimationPoker/server/classes/',
			'/workspaces/EstimationPoker/server/classes/messages/',
		  ],
		},
	  },
});
