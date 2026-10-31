import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Added so the public tunnel host can reach the dev server.
// Vite 8 blocks unknown Host headers by default.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
  // Split the bundle so vendor code is cached separately from app code.
  // (Vite 8 / Rolldown: manualChunks lives under rolldownOptions.)
  build: {
    rolldownOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor-react';
          if (id.includes('node_modules/firebase')) return 'vendor-firebase';
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons';
          return undefined;
        },
      },
    },
  },
})
