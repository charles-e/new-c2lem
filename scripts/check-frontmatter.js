#!/usr/bin/env node
const fs = require("fs");
const fg = require("fast-glob");
const matter = require("gray-matter");

const BOOKS_DIR = "src/books";

const files = fg.sync(`${BOOKS_DIR}/*.md`);
let missing_date = [];
let missing_img = [];
let bad_img = [];
let missing_perm = [];
let bad_perm = [];

for (const file of files) {
    const raw = fs.readFileSync(file, "utf-8");
    const fm = matter(raw);

    if (!fm.data || !fm.data.date_posted) {
        missing_date.push(file);
    }

    if (!fm.data.img_url) {
        missing_img.push(file);
    }
    if (!fm.data.img_url.startsWith("/images/books/")) {
        bad_img.push(file);
    }
    if (!fm.data.permalink) {
        missing_perm.push(file);
    }
    if (!fm.data.permalink.startsWith("/books/") || !fm.data.permalink.endsWith("/")) {
        bad_perm.push(file);
    }
}

if (missing_date.length > 0) {
    console.error("❌ Some book posts are missing `date_posted` in frontmatter:\n");
    missing_date.forEach(file => console.error(`- ${file}`));
}
if (missing_img.length > 0) {
    console.error("❌ Some book posts are missing `img_url` in frontmatter:\n");
    missing_img.forEach(file => console.error(`- ${file}`));
}
if (bad_img.length > 0) {
    console.error("❌ Some book posts have bad `img_url` in frontmatter:\n");
    bad_img.forEach(file => console.error(`- ${file}`));
}
if (missing_perm.length > 0) {
    console.error("❌ Some book posts missing `permalink` in frontmatter:\n");
    missing_perm.forEach(file => console.error(`- ${file}`));
}
if (bad_perm.length > 0) {
    console.error("❌ Some book posts have bad `permalink` in frontmatter:\n");
    bad_perm.forEach(file => console.error(`- ${file}`));
}
if (missing_date.length || missing_img.length || missing_perm.length || bad_img.length || bad_perm.length) {
    console.error("\n🛑 Push aborted. Fix the frontmatter tags in each book.");
    process.exit(1);
} else {
    console.log("✅ All book posts meet frontmatter criteria — good to push.");
}
