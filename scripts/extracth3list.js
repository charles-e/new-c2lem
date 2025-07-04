const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");

const WEEKLIES_DIR = path.join(__dirname, "../src", "weeklies");
const OUTPUT_FILE = path.join(__dirname, "unique-h3-headings.txt");
const md = new MarkdownIt();

const headings = new Set();

fs.readdirSync(WEEKLIES_DIR).forEach(file => {
  if (file.endsWith(".md")) {
    const fullPath = path.join(WEEKLIES_DIR, file);
    const content = fs.readFileSync(fullPath, "utf-8");

    const { content: mdContent } = matter(content);
    const rendered = md.render(mdContent);

    const h3Matches = rendered.match(/<h3>(.*?)<\/h3>/g);
    if (h3Matches) {
      h3Matches.forEach(h3 => {
        const text = h3.replace(/<\/?h3>/g, "").trim();
        if (text) {
          headings.add(text);
        }
      });
    }
  }
});

const uniqueSortedHeadings = Array.from(headings).sort();
const output = uniqueSortedHeadings.join("\n");

fs.writeFileSync(OUTPUT_FILE, output, "utf-8");
console.log(`✅ Saved ${uniqueSortedHeadings.length} headings to ${OUTPUT_FILE}`);
