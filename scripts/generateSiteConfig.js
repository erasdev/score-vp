import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const defaultConfig = {
  title: "Ricky Bob Dog's Collection",
  description: "A curated collection of sheet music.",
  "tagline": "Sheet music for everyone.",
  "favorites-description": "A collection of my favorite pieces.",
  "accent-color": "#646cff",
  "genre-badge-color": "#166534",
  "instrument-badge-color": "#0066cc",
  "tag-badge-color": "#2c662d"
};

// Ensure the VitePress public directory exists
const vitepressPublicDir = join(process.cwd(), 'docs', 'public');
if (!existsSync(vitepressPublicDir)) {
  mkdirSync(vitepressPublicDir, { recursive: true });
}

// Write the site configuration to a file in VitePress public directory
const configPath = join(vitepressPublicDir, 'site-config.json');

// Check if config already exists and preserve it if it does
let existingConfig = defaultConfig;
if (existsSync(configPath)) {
  try {
    const fileContent = readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(fileContent);
    // Preserve existing values while ensuring all required fields exist
    existingConfig = {
      ...defaultConfig,
      ...parsed,
    };
  } catch (error) {
    console.error('Error reading existing config:', error);
  }
}

writeFileSync(configPath, JSON.stringify(existingConfig, null, 2));

console.log('Site configuration file generated successfully in VitePress public directory.'); 