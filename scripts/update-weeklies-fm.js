const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Your Weeklies folder
const weekliesFolder = path.join(__dirname, "../src/weeklies");

function updateMarkdownFile(fullPath) {
  const rawContent = fs.readFileSync(fullPath, "utf8");
  const parsed = matter(rawContent);

  const fileName = path.basename(fullPath, ".md"); // e.g., "2024-11-10"

  // Update layout
  parsed.data.layout = "layouts/blogpost.njk";

  // Update permalink if missing or wrong
  parsed.data.permalink = `/weeklies/${fileName}/`;

  // Stringify back the content
  const newContent = matter.stringify(parsed.content, parsed.data);

  fs.writeFileSync(fullPath, newContent, "utf8");

  console.log(`Updated ${fullPath}`);
}


function run() {
  const files = fs.readdirSync(weekliesFolder).filter(file => file.endsWith(".md"));

  files.forEach(file => {
    const fullPath = path.join(weekliesFolder, file);
    updateMarkdownFile(fullPath);
  });

  console.log("✅ All Weeklies updated!");
}

run();

