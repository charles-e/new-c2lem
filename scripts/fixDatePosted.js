const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");
const matter = require("gray-matter");
const { DateTime } = require("luxon");

function isIsoDate(str) {

  ret = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(str);
  console.log(`is ISO = ${ret}`);
  return ret;
}

function fixDatePostedInFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(raw);
  const datePosted = parsed.data.date_posted;
  console.log(`${parsed.data.title} ${datePosted} ${typeof datePosted}`);
  if (typeof datePosted === "string" && !isIsoDate(datePosted)) {
    let dt = DateTime.fromFormat(datePosted, "M/d/yyyy");

    if (!dt.isValid) {
      dt = DateTime.fromJSDate(new Date(datePosted));
    }
    console.log(`${parsed.data.title} dt = ${dt}`)
    if (dt.isValid) {
      //parsed.data.date_posted = dt.toFormat("yyyy-MM-dd");
      parsed.data.date_posted = dt.toJSDate(); // 👈 full ISO format

      const newRaw = matter.stringify(parsed.content, parsed.data);
      fs.writeFileSync(filePath, newRaw);
      console.log(`✅ Fixed: ${filePath} → ${parsed.data.date_posted}`);
      return true;
    } else {
      console.log(`⚠️ Unrecognized date_posted: ${datePosted} in ${filePath}`);
    }
  }
  console.log('false');
  return false;
}

function fixAllMarkdownDates(directory) {
  const files = fg.sync(`${directory}/**/*.md`);
  console.log(`file count ${files.length}`);
  let updatedCount = 0;

  files.forEach((file) => {
    if (fixDatePostedInFile(file)) {
      updatedCount++;
    }
  });

  console.log(`\n✅ Done. ${updatedCount} file(s) updated.`);
}

// Run the fix
fixAllMarkdownDates("src/books");
