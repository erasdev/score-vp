import { defineConfig } from 'vitepress'
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read the generated sidebar data
const sidebarData = JSON.parse(
  readFileSync(join(__dirname, 'sidebar.json'), 'utf-8')
)

// Read the generated genre navigation item
const genreNavItem = JSON.parse(
  readFileSync(join(__dirname, 'nav.json'), 'utf-8')
)

// Read the generated instrument navigation item
const instrumentNavItem = JSON.parse(
  readFileSync(join(__dirname, 'instrument-nav.json'), 'utf-8')
)

// Read the generated favorites navigation item
const favoritesNavItem = JSON.parse(
  readFileSync(join(__dirname, 'favorites-nav.json'), 'utf-8')
)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Ricky Bob Dog's Collection",
  description: "A curated collection of sheet music",
  head: [
    ['script', { 
      src: 'https://identity.netlify.com/v1/netlify-identity-widget.js',
      type: 'text/javascript'
    }],
    ['script', {
      src: '/netlify-identity-script.js',
      type: 'text/javascript',    
    }]
  ],
  themeConfig: {
    siteTitle: false,
    logo: {
      light: '/dog.svg',
      dark: '/dog-inverted.svg',
      alt: 'Ricky Bob Dog'
    },
    nav: [
      { text: 'Home', link: '/' },
      favoritesNavItem,
      genreNavItem,
      instrumentNavItem
    ],
    sidebar: [sidebarData],
  
    search: {
      provider: 'local',
    },
  },
  // Add this to ensure admin routes and uploads are handled correctly
  rewrites: {
    'admin/:path*': 'public/admin/:path*',
  },
  vite: {
    server: {
      fs: {
        strict: false,
        allow: ['..']
      }
    },
    build: {
      rollupOptions: {
        output: {
          format: 'es'
        }
      }
    }
  },
  // Ensure PDFs are served correctly
  outDir: '../dist',
  base: '/',
  cleanUrls: true,
})