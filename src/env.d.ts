/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "@pagefind/default-ui" {
	declare class PagefindUI {
		constructor(arg: unknown);
	}
}

interface ImportMetaEnv {
	readonly WEBMENTION_API_KEY: string;
	readonly CONTRACT_ADDRESS?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
	readonly main?: boolean; // Bun-specific: true if this is the main module
}
