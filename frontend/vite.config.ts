import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiProxyTarget = process.env.VITE_API_PROXY_TARGET ?? 'https://your-api-domain.com'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/Bookstore': {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
