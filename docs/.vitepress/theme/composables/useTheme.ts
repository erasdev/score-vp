import { ref } from 'vue';
import type { Ref } from 'vue';

interface ThemeColors {
  "accent-color": string;
  "genre-badge-color": string;
  "instrument-badge-color": string;
  "tag-badge-color": string;
}

interface SiteConfig {
  title: string;
  description: string;
  "accent-color": string;
  "favorites-description": string;
  "genre-badge-color": string;
  "instrument-badge-color": string;
  "tag-badge-color": string;
}

const colorMix = (color: string, opacity: number): string => {
  return `color-mix(in srgb, ${color} ${opacity * 100}%, black)`;
};

const updateCssVariables = (colors: ThemeColors) => {
  const root = document.documentElement;
  
  
  root.style.setProperty('--vp-c-brand-1', colors["accent-color"]);

  root.style.setProperty('--vp-button-brand-bg', colors["accent-color"]);
  root.style.setProperty('--vp-button-brand-border', colors["accent-color"]);
  root.style.setProperty('--vp-button-brand-hover-bg', colorMix(colors["accent-color"], 0.85));
  root.style.setProperty('--vp-button-brand-hover-border', colorMix(colors["accent-color"], 0.85));
  root.style.setProperty('--vp-button-brand-hover-bg-dark', colorMix(colors["accent-color"], 0.85));
  root.style.setProperty('--vp-button-brand-hover-border-dark', colorMix(colors["accent-color"], 0.85));
  root.style.setProperty('--vp-button-brand-hover-text-dark', '#fff');

  root.style.setProperty('--genre-badge-color', colors["genre-badge-color"]);
  root.style.setProperty('--instrument-badge-color', colors["instrument-badge-color"]);
  root.style.setProperty('--tag-badge-color', colors["tag-badge-color"]);
};

export function useTheme() {
  const colors: Ref<ThemeColors> = ref({
    "accent-color": '#646cff',
    "genre-badge-color": '#166534',
    "instrument-badge-color": '#e6f3ff',
    "tag-badge-color": '#f0f7e6',
  });


  const loadThemeFromConfig = async () => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    try {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/site-config.json`);
      if (!response.ok) throw new Error('Failed to fetch site config');
      const config = await response.json() as SiteConfig;
      if (config) {
        colors.value = {
          "accent-color": config["accent-color"],
          "genre-badge-color": config["genre-badge-color"],
          "instrument-badge-color": config["instrument-badge-color"],
          "tag-badge-color": config["tag-badge-color"]
        };
        updateCssVariables(colors.value);
      }
    } catch (error) {
      console.error('Error loading theme from config:', error);
      // Apply default colors if config loading fails
      updateCssVariables(colors.value);
    }
  };

  // Always load theme on initialization
  loadThemeFromConfig();

  return {
    colors,
    loadThemeFromConfig,
  };
} 