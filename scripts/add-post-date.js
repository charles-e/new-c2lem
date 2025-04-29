const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// 📁 Location of your markdown files
const BOOKS_DIR = path.join(__dirname, "../src/books");

// 📆 Default post date = 2 weeks ago
const now = new Date();
const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
const defaultPostDate = twoWeeksAgo.toISOString().split("T")[0];

fs.readdirSync(BOOKS_DIR).forEach(file => {
  const fullPath = path.join(BOOKS_DIR, file);

  if (file.endsWith(".md")) {
    const content = fs.readFileSync(fullPath, "utf8");
    const parsed = matter(content);

    if (!parsed.data.date_posted) {
      parsed.data.date_posted = defaultPostDate;

      const updated = matter.stringify(parsed.content, parsed.data);
      fs.writeFileSync(fullPath, updated, "utf8");
      console.log(`✅ Added date_posted (${defaultPostDate}) to ${file}`);
    } else {
      console.log(`✔️  ${file} already has date_posted`);
    }
  }
});
