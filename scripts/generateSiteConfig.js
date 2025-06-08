import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const defaultConfig = {
  title: "Ricky Bob Dog's Collection",
  description: "A curated collection of sheet music.",
  "tagline": "Sheet music for everyone.",
  "favorites-description": "A collection of my favorite pieces.",
  "show-favorites-page": true,
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

// Paths for source and output config files
const sourceConfigPath = join(process.cwd(), 'public', 'site-config.json');
const outputConfigPath = join(vitepressPublicDir, 'site-config.json');

// Read source config if it exists
let sourceConfig = {};
if (existsSync(sourceConfigPath)) {
  try {
    const fileContent = readFileSync(sourceConfigPath, 'utf-8');
    sourceConfig = JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading source config:', error);
  }
}

// Merge default config with source config
const mergedConfig = {
  ...defaultConfig,
  ...sourceConfig,
};

// Write the merged configuration to the output file
writeFileSync(outputConfigPath, JSON.stringify(mergedConfig, null, 2));

console.log('Site configuration file generated successfully in VitePress public directory.'); 