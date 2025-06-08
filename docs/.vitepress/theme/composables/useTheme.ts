import { ref } from 'vue';
import type { Ref } from 'vue';

interface ThemeColors {
  background: string;
  surface: {
    light: string;
    dark: string;
  };
  text: {
    light: string;
    dark: string;
  };
  accent: {
    light: string;
    dark: string;
  };
}

interface SiteConfig {
  title: string;
  description: string;
  colors: ThemeColors;
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
};

const updateCssVariables = (colors: ThemeColors) => {
  const root = document.documentElement;
  
  // Update background
  const bgRgb = hexToRgb(colors.background);
  root.style.setProperty('--vp-c-bg', colors.background);
  root.style.setProperty('--vp-c-bg-rgb', `${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}`);
  
  // Update surface colors
  const surfaceLightRgb = hexToRgb(colors.surface.light);
  const surfaceDarkRgb = hexToRgb(colors.surface.dark);
  root.style.setProperty('--vp-c-bg-soft', colors.surface.light);
  root.style.setProperty('--vp-c-bg-mute', colors.surface.dark);
  root.style.setProperty('--vp-c-bg-soft-rgb', `${surfaceLightRgb.r}, ${surfaceLightRgb.g}, ${surfaceLightRgb.b}`);
  root.style.setProperty('--vp-c-bg-mute-rgb', `${surfaceDarkRgb.r}, ${surfaceDarkRgb.g}, ${surfaceDarkRgb.b}`);
  
  // Update text colors
  const textLightRgb = hexToRgb(colors.text.light);
  const textDarkRgb = hexToRgb(colors.text.dark);
  root.style.setProperty('--vp-c-text-1', colors.text.dark);
  root.style.setProperty('--vp-c-text-2', colors.text.light);
  root.style.setProperty('--vp-c-text-1-rgb', `${textDarkRgb.r}, ${textDarkRgb.g}, ${textDarkRgb.b}`);
  root.style.setProperty('--vp-c-text-2-rgb', `${textLightRgb.r}, ${textLightRgb.g}, ${textLightRgb.b}`);
  
  // Update accent colors
  const accentLightRgb = hexToRgb(colors.accent.light);
  const accentDarkRgb = hexToRgb(colors.accent.dark);
  root.style.setProperty('--vp-c-brand-1', colors.accent.light);
  root.style.setProperty('--vp-c-brand-2', colors.accent.dark);
  root.style.setProperty('--vp-c-brand-1-rgb', `${accentLightRgb.r}, ${accentLightRgb.g}, ${accentLightRgb.b}`);
  root.style.setProperty('--vp-c-brand-2-rgb', `${accentDarkRgb.r}, ${accentDarkRgb.g}, ${accentDarkRgb.b}`);
};

export function useTheme() {
  const colors: Ref<ThemeColors> = ref({
    background: '#fefefe',
    surface: {
      light: '#ffffff',
      dark: '#f5f5f5',
    },
    text: {
      light: '#1f2937',
      dark: '#1f2937',
    },
    accent: {
      light: '#4f46e5',
      dark: '#3730a3',
    },
  });

  const loadThemeFromConfig = async () => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    try {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/site-config.json`);
      if (!response.ok) throw new Error('Failed to fetch site config');
      const config = await response.json() as SiteConfig;
      
      if (config.colors) {
        colors.value = config.colors;
        updateCssVariables(config.colors);
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