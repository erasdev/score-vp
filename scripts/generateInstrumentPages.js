import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Helper function to convert text to sentence case
const toSentenceCase = (text) => {
  // First convert to lowercase and split by spaces
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Read the PDF index
const pdfIndex = JSON.parse(
  readFileSync(join(rootDir, 'docs', '.vitepress', 'public', 'pdf-index.json'), 'utf-8')
);

// Collect all instruments and their frequencies
const instrumentFrequency = {};
pdfIndex.forEach(entry => {
  entry.instruments.forEach(instrument => {
    instrumentFrequency[instrument] = (instrumentFrequency[instrument] || 0) + 1;
  });
});

// Get the 8 most frequent instruments
const topInstruments = Object.entries(instrumentFrequency)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 8)
  .map(([instrument]) => instrument);

// Ensure the instruments directory exists
const instrumentsDir = join(rootDir, 'docs', 'pdfs', 'instruments');
if (!existsSync(instrumentsDir)) {
  mkdirSync(instrumentsDir, { recursive: true });
}

// Generate a page for each top instrument
topInstruments.forEach(instrument => {
  // Find all PDFs that belong to this instrument
  const instrumentPdfs = pdfIndex.filter(entry => 
    entry.instruments.includes(instrument)
  );

  const sentenceCaseInstrument = toSentenceCase(instrument);

  const content = `---
title: ${sentenceCaseInstrument} Sheet Music
aside: false
prev: false
next: false
---

# ${sentenceCaseInstrument} Sheet Music

${instrumentPdfs.map(pdf => {
  const artistText = pdf.artists?.length ? ` - ${pdf.artists.join(', ')}` : '';
  return `- [${pdf.title}](/pdfs/${pdf.slug})${artistText}`;
}).join('\n')}
`;

  // Create the file path
  const filePath = join(instrumentsDir, `${instrument.toLowerCase().replace(/\s+/g, '-')}.md`);
  
  // Write the markdown file
  writeFileSync(filePath, content);
  console.log(`Generated instrument page for: ${sentenceCaseInstrument}`);
});

// Create navigation item for instruments
const instrumentNavItem = {
  text: 'Instruments',
  items: topInstruments.map(instrument => {
    const sentenceCaseInstrument = toSentenceCase(instrument);
    return {
      text: sentenceCaseInstrument,
      link: `/pdfs/instruments/${instrument.toLowerCase().replace(/\s+/g, '-')}`
    };
  })
};

// Write the instrument navigation item to a file
const navPath = join(rootDir, 'docs', '.vitepress', 'instrument-nav.json');
writeFileSync(navPath, JSON.stringify(instrumentNavItem, null, 2));
console.log('Instrument navigation item generated successfully.');

// Create sidebar items for the instruments
const instrumentSidebarItems = topInstruments.map(instrument => ({
  text: toSentenceCase(instrument),
  link: `/pdfs/instruments/${instrument.toLowerCase().replace(/\s+/g, '-')}`
}));

// Read the existing sidebar data
const sidebarPath = join(rootDir, 'docs', '.vitepress', 'sidebar.json');
const sidebarData = JSON.parse(readFileSync(sidebarPath, 'utf-8'));

// Ensure the items array exists
if (!sidebarData.items) {
  sidebarData.items = [];
}

// Find the index of the first non-special item (after Favorites, Genres, Instruments)
const specialItems = ['Favorites', 'Genres', 'Instruments'];
const firstRegularItemIndex = sidebarData.items.findIndex(item => 
  !specialItems.includes(item.text)
);

// Insert the instruments section at the correct position
const instrumentsSection = {
  text: 'Instruments',
  collapsed: true,
  items: instrumentSidebarItems
};

if (firstRegularItemIndex === -1) {
  // If no regular items found, append to the end
  sidebarData.items.push(instrumentsSection);
} else {
  // Insert after Genres and before regular items
  sidebarData.items.splice(firstRegularItemIndex, 0, instrumentsSection);
}

// Write the updated sidebar data
writeFileSync(sidebarPath, JSON.stringify(sidebarData, null, 2));
console.log('Updated sidebar with instrument pages'); 