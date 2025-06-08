import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Read the PDF index
const pdfIndex = JSON.parse(
  readFileSync(join(rootDir, 'docs', 'public', 'pdf-index.json'), 'utf-8')
);

// Ensure the content directory exists
const contentDir = join(rootDir, 'docs', 'pdfs');
if (!existsSync(contentDir)) {
  mkdirSync(contentDir, { recursive: true });
}

// Generate a markdown file for each PDF entry
pdfIndex.forEach(entry => {
  // Extract the filename without the /uploads/ prefix
  const filename = entry.file.split('/').pop();
  
  const content = `---
title: ${entry.title}
description: ${entry.description || ''}
tags: ${JSON.stringify(entry.tags)}
genres: ${JSON.stringify(entry.genres)}
instruments: ${JSON.stringify(entry.instruments)}
artists: ${JSON.stringify(entry.artists)}
aside: false
prev: false
next: false
---

# ${entry.title}

${entry.artists?.length ? `${entry.artists.join(', ')}` : ''}

${entry.description || ''}

<div class="metadata-badges">
  <div class="badge-list">
    ${entry.genres.map(genre => `    <span class="vp-raw badge badge-genre">${genre}</span>`).join('\n')}
    ${entry.instruments.map(instrument => `    <span class="badge badge-instrument">${instrument}</span>`).join('\n')}
    ${entry.tags.map(tag => `    <span class="badge badge-tag">${tag}</span>`).join('\n')}
  </div>
</div>

<div class="score-viewer">
  <iframe 
    src="/uploads/${filename}#toolbar=0&navpanes=0" 
    width="100%" 
    height="800px" 
    frameborder="0"
    allow="fullscreen"
    loading="lazy"
    type="application/pdf"
  ></iframe>
</div>

<style>
.score-viewer {
  width: 100%;
  height: 800px;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
}

.metadata-badges {
  margin: 1.5rem 0;
}

.badge-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  border: 1px solid transparent;
}
</style>
`;

  // Create the file path
  const filePath = join(contentDir, `${entry.slug}.md`);
  
  // Write the markdown file
  writeFileSync(filePath, content);
  console.log(`Generated route for: ${entry.title}`);
});

// Create sidebar items for the PDFs
const sidebarItems = pdfIndex
  .map(entry => ({
    text: entry.title,
    link: `/pdfs/${entry.slug}`
  }))
  .sort((a, b) => a.text.localeCompare(b.text));

// Write the sidebar data to a file
const sidebarData = {
  items: sidebarItems
};

const sidebarPath = join(rootDir, 'docs', '.vitepress', 'sidebar.json');
writeFileSync(sidebarPath, JSON.stringify(sidebarData, null, 2));
console.log('Generated sidebar data');