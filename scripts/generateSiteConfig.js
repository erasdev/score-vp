import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const defaultConfig = {
  title: "Ricky Bob Dog's Collection",
  description: "A collection of musical scores and arrangements.",
  "color-background": '#ffffff',
  "color-surface-light": '#ffffff',     
  "color-surface-dark": '#f3f4f6',
  "color-text-light": '#6b7280',
  "color-text-dark": '#1f2937',
  "color-accent-light": '#4f46e5',
  "color-accent-dark": '#155e75',
};

// Ensure the public directory exists
const publicDir = join(process.cwd(), 'public');
if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
}

// Write the site configuration to a file
const configPath = join(publicDir, 'site-config.json');

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

console.log('Site configuration file generated successfully.'); 