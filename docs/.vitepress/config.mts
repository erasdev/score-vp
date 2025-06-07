import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "SCORE",
  description: "Sheet Collection & Organized Reader Experience",
  head: [
      ['script', { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js'}],
      ['script', {src: '/netlify-identity-script.js'}]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  // Add this to ensure admin routes are handled correctly
  rewrites: {
    'admin/:path*': 'public/admin/:path*'
  }
})
