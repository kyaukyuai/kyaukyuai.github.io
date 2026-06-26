import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// User site (kyaukyuai.github.io) is served from root.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
