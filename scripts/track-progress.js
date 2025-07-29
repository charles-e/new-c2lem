const fs = require("fs");
const path = require("path");

const booksDir = "./src/books/_BIP";
const metaRegex = /<span\s+meta="(\d+)@([\d\-T:.Z]+)"><\/span>/g;
const frontmatterRegex = /^---\n([\s\S]+?)\n---/;

function updateFrontmatter(content, newFields) {
  const match = frontmatterRegex.exec(content);
  if (!match) return content;

  const frontmatter = match[1];
  const body = content.slice(match[0].length);
  const updatedFrontmatter = frontmatter + Object.entries(newFields)
    .map(([key, value]) => `\n${key}: ${value}`)
    .join("");
    
  return `---\n${updatedFrontmatter}\n---${body}`;
}

fs.readdirSync(booksDir).forEach(file => {
  if (!file.endsWith(".md")) return;

  const filePath = path.join(booksDir, file);
  const content = fs.readFileSync(filePath, "utf-8");

  let latest = { percent: 0, datetime: "1970-01-01T00:00:00.000Z" };

  for (const match of content.matchAll(metaRegex)) {
    const [_, percent, datetime] = match;
    if (new Date(datetime) > new Date(latest.datetime)) {
      latest = { percent: Number(percent), datetime };
    }
  }

  if (latest.percent > 0) {
    const updatedContent = updateFrontmatter(content, {
      pct_progress: latest.percent,
      latest_progress: `"${latest.datetime}"`
    });
    fs.writeFileSync(filePath, updatedContent, "utf-8");
    console.log(`Updated: ${file}`);
  }
});
