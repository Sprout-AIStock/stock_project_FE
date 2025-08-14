import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: mode === 'development' ? {
    proxy: {
      '/api': {
        target: 'http://ec2-43-201-63-20.ap-northeast-2.compute.amazonaws.com:8080',
        changeOrigin: true,
        secure: false
      }
    }
  } : {},
  base: '/', // GitHub Pages 등에서 subpath 사용 시 수정
}))
