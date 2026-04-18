import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy all /api and honeypot calls to our Flask backend
      '/api': 'http://localhost:5000',
      '/login': 'http://localhost:5000',
      '/admin': 'http://localhost:5000',
    }
  }
})
