import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Listen on all network interfaces
    port: 3000,      // Use port 3000 explicitly
    strictPort: true, // Don't try other ports if 3000 is in use
    hmr: {
      clientPort: 3000 // Force client to use the same port
    },
    watch: {
      usePolling: true  // Better file watching in containerized environments
    }
  }
})
