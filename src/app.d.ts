// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		interface Locals {
			admin: boolean;
		}
		interface PageData {
			admin?: boolean;
		}
	}
}

export {};
