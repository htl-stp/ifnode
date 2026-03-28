import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    base: "./",
    build: {
        rolldownOptions: {
            input: {
                index: path.resolve(__dirname, 'index.html'),
                file: path.resolve(__dirname, 'view.html'),
            },
        },
    },
});