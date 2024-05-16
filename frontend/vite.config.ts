import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin'
// import manifest from './public/manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    host: true,
  },
  // base: '/hs-extension-app/', 
  plugins: [
    vue(),
    // crx({ manifest }),
  ],
  build: {
    outDir: 'dist', 
  },
});
