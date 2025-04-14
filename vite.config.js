import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    cors: {
      origin: ["https://acd6-146-196-37-59.ngrok-free.app"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true
    },
    headers: {
      'Access-Control-Allow-Origin': 'https://acd6-146-196-37-59.ngrok-free.app',
    },
    allowedHosts: ["acd6-146-196-37-59.ngrok-free.app"]
  }
})
