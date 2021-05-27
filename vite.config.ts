import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const { resolve } = require('path')


// const ENV = process.env.NODE_ENV
// const devHost = '127.0.0.1'
// const dist = path.resolve('./dist')
const BACKEND = process.env.BACKEND || '172.20.155.102:8088'
const PORT = process.env.PORT || '8002'
const HOST = process.env.HOST || '127.0.0.1'
// const baseUrl = ENV === 'production' ? '' : `http://${HOST}:${PORT}`

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') }
    ]
  },
  server: {
    host: HOST,
    port: Number(PORT),
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // },
    proxy: {
      '/violet-api': {
        target: 'http://' + BACKEND,
        rewrite: path => path.replace(/^\/violet-api/, '/')
        // pathRewrite: { '^/violet-api': '/' }
      }
    }
  }

})
