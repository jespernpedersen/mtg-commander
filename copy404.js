const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'dist', 'index.html');
const destPath = path.join(__dirname, 'dist', '404.html');

fs.copyFile(srcPath, destPath, (err) => {
  if (err) {
    console.error('Error: Unable to copy index.html to 404.html:', err);
  } else {
    console.log('Successfully copied index.html to 404.html');
  }
});
