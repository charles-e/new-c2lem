const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const mkdirp = require('mkdirp');

// Where your Markdown books live
const booksFolder = path.join(__dirname, "../src/books");
const readingFolder = path.join(__dirname, "../src/books/_BIP");

// Where to save images locally
const outputFolder = path.join(__dirname, "../src/images/books");

// Ensure output folder exists
mkdirp.sync(outputFolder);

// Helper to download one image
async function downloadImage(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  const fileStream = fs.createWriteStream(dest);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
}
async function run() {
  await doFolder(booksFolder);
  await doFolder(readingFolder);
}

async function doFolder(targetFolder) {
  const files = fs.readdirSync(targetFolder).filter(file => file.endsWith(".md"));

  const downloads = [];

  for (const file of files) {
    const fullPath = path.join(targetFolder, file);
    const content = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(content);

    if (data.img_url) {
      const imgUrl = data.img_url;
      if (imgUrl.startsWith("http")){
        const filename = file.replace(/\.md$/, path.extname(imgUrl)); // keep extension from img
        const destPath = path.join(outputFolder, filename);

        downloads.push({ title: data.title, imgUrl, destPath });
      }
      else {
        console.log(`already done ${file}`);
      }
    }
  }

  console.log(`Found ${downloads.length} images.`);

  for (const item of downloads) {
    try {
      console.log(`Downloading ${item.title}...`);
      await downloadImage(item.imgUrl, item.destPath);
      console.log(`Saved: ${item.destPath}`);
    } catch (err) {
      console.error(`Failed to download ${item.title}:`, err.message);
    }
  }
}

run();

