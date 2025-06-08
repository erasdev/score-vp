import DefaultTheme from 'vitepress/theme'
import './tailwind.css'
import './custom.css'
import { useTheme } from './composables/useTheme'
import { createPinia } from 'pinia'

// Import Tailwind's base styles
import 'tailwindcss/base.css'
import 'tailwindcss/components.css'
import 'tailwindcss/utilities.css'

export default {
  ...DefaultTheme,
  // You can add custom theme overrides here
  enhanceApp({ app }) {
    // Initialize Pinia
    const pinia = createPinia()
    app.use(pinia)
    
    // Initialize theme
    useTheme()
  }
} 