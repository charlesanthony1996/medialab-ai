import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5000
  },
  plugins: [vue()],
  build: {
    outDir: 'public', // Ensure this points to your extension's directory
  },
});
