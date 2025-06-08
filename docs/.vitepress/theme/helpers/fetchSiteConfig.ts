
export interface SiteConfig {
  title: string;
  description: string;
  'color-background': string;  // Main background color
  'color-surface-light': string;     // Background color for tables, cards, etc.
  'color-surface-dark': string;     // Background color for tables, cards, etc.
  'color-text-light': string;        // Main text color
  'color-text-dark': string;        // Main text color
  'color-accent-light': string;      // Accent color for interactive elements
  'color-accent-dark': string;      // Accent color for interactive elements
} 

export default async function fetchSiteConfig() {

    try {
        const configRes = await fetch('/site-config.json');
        return await configRes.json();

      } catch (error) {
        console.error('Failed to load site configuration:', error);
      }


}

