import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'

const getCache = ({ handler, name, pattern }) => ({
  urlPattern: pattern,
  handler: handler,
  options: {
    cacheName: name,
    expiration: {
      maxEntries: 500,
      maxAgeSeconds: 60 * 60 * 24 // 1 day
    },
    cacheableResponse: {
      statuses: [200]
    }
  }
})

export default defineConfig({
  server: {
    https: true
  },
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['**/*'],
      manifest: {
        name: 'cats',
        short_name: 'cats',
        description: 'cats',
        start_url: '/',
        display: 'standalone',
        background_color: '#050505',
        theme_color: '#050505',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          getCache({
            handler: 'NetworkFirst',
            pattern: /^https:\/\/meowfacts.herokuapp.com/,
            name: 'local-facts-api'
          }),
          getCache({
            handler: 'NetworkFirst',
            pattern: /^https:\/\/api.thecatapi.com\/v1\/images\/search/,
            name: 'local-images-api'
          }),
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              }
            }
          },
          {
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'offline-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              }
            }
          }
        ]
      }
    })
  ]
})
