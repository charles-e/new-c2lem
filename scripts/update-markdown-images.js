const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Your books folder
const booksFolder = path.join(__dirname, "../src/books/");
const progFolder = path.join(__dirname, "../src/books/_BIP");

// Where your local images are stored relative to site root
const imageBasePath = "/images/books/";

function getLocalImageFilename(bookFileName, originalImgUrl) {
  const ext = path.extname(originalImgUrl) || ".jpg"; // default to .jpg if missing
  const baseName = bookFileName.replace(/\.md$/, '');
  return `${baseName}${ext}`;
}

function updateMarkdownFile(fullPath) {
  const rawContent = fs.readFileSync(fullPath, "utf8");
  const parsed = matter(rawContent);

  if (!parsed.data.img_url) {
    console.log(`Skipping (no img_url): ${fullPath}`);
    return;
  }

  const newFilename = getLocalImageFilename(path.basename(fullPath), parsed.data.img_url);
  const newImgUrl = imageBasePath + newFilename;

  parsed.data.img_url = newImgUrl;

  const newContent = matter.stringify(parsed.content, parsed.data);
  fs.writeFileSync(fullPath, newContent, "utf8");

  console.log(`Updated ${fullPath}`);
}

function run() {
  const files = fs.readdirSync(booksFolder).filter(file => file.endsWith(".md"));
  const in_prog = fs.readdirSync(progFolder).filter(file => file.endsWith(".md"));
  
  files.forEach(file => {
    const fullPath = path.join(booksFolder, file);
    updateMarkdownFile(fullPath);
  });

  in_prog.forEach(file => {
    const fullPath = path.join(progFolder, file);
    updateMarkdownFile(fullPath);
  });
  console.log("All markdown files updated.");
}

run();

