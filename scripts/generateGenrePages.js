import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Helper function to convert text to sentence case
const toSentenceCase = (text) => {
  // Special case for "old-time"
  if (text === 'old-time') {
    return 'Old-Time';
  }
  
  // First convert to lowercase
  const lowerText = text.toLowerCase();
  
  // Split by spaces only to preserve hyphens
  return lowerText
    .split(' ')
    .map(word => {
      // For each word, capitalize the first letter of each hyphenated part
      return word.split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('-');
    })
    .join(' ');
};

// Read the PDF index
const pdfIndex = JSON.parse(
  readFileSync(join(rootDir, 'docs', '.vitepress', 'public', 'pdf-index.json'), 'utf-8')
);

// Collect all genres and their frequencies
const genreFrequency = {};
pdfIndex.forEach(entry => {
  entry.genres.forEach(genre => {
    genreFrequency[genre] = (genreFrequency[genre] || 0) + 1;
  });
});

// Get the 8 most frequent genres
const topGenres = Object.entries(genreFrequency)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 8)
  .map(([genre]) => genre);

// Ensure the genres directory exists
const genresDir = join(rootDir, 'docs', 'pdfs', 'genres');
if (!existsSync(genresDir)) {
  mkdirSync(genresDir, { recursive: true });
}

// Generate a page for each top genre
topGenres.forEach(genre => {
  // Find all PDFs that belong to this genre
  const genrePdfs = pdfIndex.filter(entry => 
    entry.genres.includes(genre)
  );

  const sentenceCaseGenre = toSentenceCase(genre);
  const slug = sentenceCaseGenre.toLowerCase().replace(/\s+/g, '-');

  const content = `---
title: ${sentenceCaseGenre} Sheet Music
aside: false
prev: false
next: false
---

# ${sentenceCaseGenre} Sheet Music

${genrePdfs.map(pdf => {
  const artistText = pdf.artists?.length ? ` - ${pdf.artists.join(', ')}` : '';
  return `- [${pdf.title}](/pdfs/${pdf.slug})${artistText}`;
}).join('\n')}
`;

  // Create the file path
  const filePath = join(genresDir, `${slug}.md`);
  
  // Write the markdown file
  writeFileSync(filePath, content);
  console.log(`Generated genre page for: ${sentenceCaseGenre}`);
});

// Create navigation item for genres
const genreNavItem = {
  text: 'Genres',
  items: topGenres.map(genre => {
    const sentenceCaseGenre = toSentenceCase(genre);
    const slug = sentenceCaseGenre.toLowerCase().replace(/\s+/g, '-');
    return {
      text: sentenceCaseGenre,
      link: `/pdfs/genres/${slug}`
    };
  })
};

// Write the genre navigation item to a file
const navPath = join(rootDir, 'docs', '.vitepress', 'nav.json');
writeFileSync(navPath, JSON.stringify(genreNavItem, null, 2));
console.log('Genre navigation item generated successfully.');

// Create sidebar items for the genres
const genreSidebarItems = topGenres.map(genre => {
  const sentenceCaseGenre = toSentenceCase(genre);
  const slug = sentenceCaseGenre.toLowerCase().replace(/\s+/g, '-');
  return {
    text: sentenceCaseGenre,
    link: `/pdfs/genres/${slug}`
  };
});

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

// Insert the genres section at the correct position
const genresSection = {
  text: 'Genres',
  collapsed: true,
  items: genreSidebarItems
};

if (firstRegularItemIndex === -1) {
  // If no regular items found, append to the end
  sidebarData.items.push(genresSection);
} else {
  // Insert after Favorites and before regular items
  sidebarData.items.splice(firstRegularItemIndex, 0, genresSection);
}

// Write the updated sidebar data
writeFileSync(sidebarPath, JSON.stringify(sidebarData, null, 2));
console.log('Updated sidebar with genre pages'); 