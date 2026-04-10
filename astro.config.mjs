// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: 'https://htl-stp.github.io',
    base: '/ifnode/',
    vite: {
        resolve: {
            alias: {
                '@data': '/data',
                '@styles': '/src/styles',
            },
        },
    },
});