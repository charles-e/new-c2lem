#!node
const fs = require('fs');
const path = require('path');

function renameFilesInDirectory(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }
    files.forEach(file => {
      const newName = file
        .replace(/\s+/g, '_')  // Replace all whitespace with underscores
        .replace(/['"]/g, '');  // Remove all apostrophes and quotes

      if (newName !== file) {
        const oldPath = path.join(directory, file);
        const newPath = path.join(directory, newName);
        fs.rename(oldPath, newPath, err => {
          if (err) {
            console.error(`Error renaming file ${file}:`, err);
          } else {
            console.log(`Renamed: ${file} -> ${newName}`);
          }
        });
      }
    });
  });
}

// Example usage:
renameFilesInDirectory('.');

