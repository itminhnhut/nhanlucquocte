const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace violet-* with blue-* and indigo-* with sky-*
  let newContent = content
    .replace(/violet-/g, 'blue-')
    .replace(/indigo-/g, 'sky-');

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(srcDir);
console.log('Done coloring!');
