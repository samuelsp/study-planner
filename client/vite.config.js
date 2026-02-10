import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Permite acesso externo (necessário para Docker)
    port: 5173,
    watch: {
      usePolling: true, // Necessário para hot-reload em alguns sistemas
    },
  },
});
