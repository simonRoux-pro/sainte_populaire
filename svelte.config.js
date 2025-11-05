// import adapter from '@sveltejs/adapter-static';
// import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// // const dev = process.argv.includes('dev');

// /** @type {import('@sveltejs/kit').Config} */
// const config = {
//   preprocess: vitePreprocess(),
//   kit: {
//     adapter: adapter({
//       pages: 'build',
//       assets: 'build',
//       fallback: 'index.html'
//     }),
//     paths: {
//       base: '', 
//       relative: false
//     },
//     prerender: {
//       entries: ['*']
//     }
//   }
// };

// export default config;



import adapter from '@sveltejs/adapter-auto'; // ← SEUL changement
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(), // ← Ligne modifiée
    paths: {
      base: '',
      relative: false
    }
  }
};

export default config;