import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Read the site configuration
const siteConfig = JSON.parse(
  readFileSync(join(rootDir, 'docs', 'public', 'site-config.json'), 'utf-8')
);

// Only proceed if favorites page is enabled
if (!siteConfig['show-favorites-page']) {
  console.log('Favorites page is disabled in site configuration - skipping generation');
  // Exit with success code since this is an expected condition
  process.exit(0);
}

// Read the PDF index
const pdfIndex = JSON.parse(
  readFileSync(join(rootDir, 'docs', 'public', 'pdf-index.json'), 'utf-8')
);

// Find all favorite PDFs
const favoritePdfs = pdfIndex.filter(entry => entry.favorite);

// Ensure the pdfs directory exists
const contentDir = join(rootDir, 'docs', 'pdfs');
if (!existsSync(contentDir)) {
  mkdirSync(contentDir, { recursive: true });
}

// Generate the favorites page
const content = `---
title: Favorites
aside: false
prev: false
next: false
---

# Favorites

${siteConfig['favorites-description'] || ''}

${favoritePdfs.length === 0 ? 'No favorites yet. Check back soon!' : ''}

${favoritePdfs.map(pdf => {
  const artistText = pdf.artists?.length ? ` - ${pdf.artists.join(', ')}` : '';
  return `- [${pdf.title}](/pdfs/${pdf.slug})${artistText}`;
}).join('\n')}
`;

// Create the file path
const filePath = join(contentDir, 'favorites.md');

// Write the markdown file
writeFileSync(filePath, content);
console.log('Generated favorites page');

// Create navigation item for favorites
const favoritesNavItem = {
  text: 'Favorites',
  link: '/pdfs/favorites'
};

// Write the favorites navigation item to a file
const navPath = join(rootDir, 'docs', '.vitepress', 'favorites-nav.json');
writeFileSync(navPath, JSON.stringify(favoritesNavItem, null, 2));
console.log('Favorites navigation item generated successfully.');

// Read the existing sidebar data
const sidebarPath = join(rootDir, 'docs', '.vitepress', 'sidebar.json');
const sidebarData = JSON.parse(readFileSync(sidebarPath, 'utf-8'));

// Ensure the items array exists
if (!sidebarData.items) {
  sidebarData.items = [];
}

// Create the favorites section
const favoritesSection = {
  text: 'Favorites',
  link: '/pdfs/favorites'
};

// Insert favorites at the beginning of the sidebar
sidebarData.items.unshift(favoritesSection);

// Write the updated sidebar data
writeFileSync(sidebarPath, JSON.stringify(sidebarData, null, 2));
console.log('Updated sidebar with favorites link'); 