import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
  alias: {


     '@': path.resolve(__dirname, './src'),
  },
   

  },
   server: {
    proxy: {
      // Intercept any local call starting with '/api-sports'
      '/api': {
        target: 'https://api.football-data.org/v4', // Check your exact version endpoint
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
   
  
  
  
})
