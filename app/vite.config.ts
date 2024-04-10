import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import svgr from 'vite-plugin-svgr';
import sitemap from 'vite-plugin-sitemap';

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        exclude: [`@capacitor/camera`],
    },
    plugins: [react(), legacy(), svgr(), sitemap()],
    define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
    },
});
