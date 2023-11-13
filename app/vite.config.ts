import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        exclude: [`@capacitor/camera`],
    },
    plugins: [react(), legacy(), svgr()],
    define: {
        'APP_VERSION': JSON.stringify(process.env.npm_package_version),
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
    },
});
