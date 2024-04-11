import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    host: true,
  },
  // base: '/hs-extension-app/', 
  plugins: [vue()],
  build: {
    outDir: 'dist', 
  },
});
