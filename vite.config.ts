import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  base: process.env.VITE_BASE || '/cloudmusic-uniapp/',
  server: {
    port: 5174,
    host: '0.0.0.0',
    proxy: {
      '/netease-api': {
        target: 'https://music163.xuanmou.com.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/netease-api/, '')
      }
    }
  }
})
