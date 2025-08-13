import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://ec2-43-201-63-20.ap-northeast-2.compute.amazonaws.com:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
