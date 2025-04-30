const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");

const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-link-attributes");

module.exports = function(eleventyConfig) {

  // Set up Markdown-It with link attributes
  let markdownLib = markdownIt({
    html: true,
    linkify: true,
    typographer: true
  }).use(markdownItAttrs, {
    pattern: /^https?:\/\//, // Only external links
    attrs: {
      target: "_blank",
      rel: "noopener noreferrer"
    }
  });

  eleventyConfig.setLibrary("md", markdownLib);


  eleventyConfig.addNunjucksShortcode("renderMarkdownBody", function (relativePath) {
    const fullPath = path.join(__dirname, "src", relativePath);
    const raw = fs.readFileSync(fullPath, "utf8");
    const parsed = matter(raw);
    return markdownLib.render(parsed.content);
  });

  eleventyConfig.addPlugin(pluginRss);

  // passthrough css & js
  eleventyConfig.addPassthroughCopy({"src/_includes/css": "css"});
  eleventyConfig.addPassthroughCopy({"src/_includes/scripts": "scripts"});
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "public": "/" });

  eleventyConfig.addFilter('xmlEscape', function(value) {
    if (!value) return '';
    return value.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
  });
    eleventyConfig.addPlugin(pluginRss, {
      type: "rss", // or "atom", "json"
      outputPath: "/books_rss.xml",
      template: "books_feed.njk",
      collection: {
        name: "allBooksSorted", // replace with your collection name
        limit: 0,     // 0 means no limit
      },
      metadata: {
        language: "en",
        title: "c2lem/books RSS Feed",
        subtitle: "Book Notes",
        base: "https://c2lem.com/",
        author: {
          name: "lemagne",
          email: "charles.eubanks@gmail.com",
        }
      }
    });
      eleventyConfig.addGlobalData("siteTitle", "c2lem");
          
    eleventyConfig.addPlugin(pluginRss, {
      type: "rss", // or "atom", "json"
      outputPath: "/weeklies_rss.xml",
      template: "weeklies_feed.njk",
      collection: {
        name: "weekliesSorted", // replace with your collection name
        limit: 0,     // 0 means no limit
      },
      metadata: {
        language: "en",
        title: "c2lem/weeklies RSS Feed",
        subtitle: "just news & stuff",
        base: "https://c2lem.com/",
        author: {
          name: "lemagne",
          email: "charles.eubanks@gmail.com",
        }
      }
    });
  // Collection to list all books sorted by date
  eleventyConfig.addCollection("allBooksSorted", function(collectionApi) {
    return collectionApi.getFilteredByGlob("./src/books/*.md").filter(book => book.data.date_posted).sort((a, b) => {
      return new Date(b.data.date_posted) - new Date(a.data.date_posted);
    });
  });
  
  eleventyConfig.addCollection("allPendingBooks", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/books/*.md")
      .filter(book => !book.data.date_read) // ✅ ONLY books WITHOUT date_read
      .sort((a, b) => {
        const dateA = a.data.date_started || book.date;
        const dateB = b.data.date_started || book.date;
        return new Date(dateB) - new Date(dateA);
      });
  });
  
  eleventyConfig.addCollection("weekliesSorted", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/weeklies/*.md")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  eleventyConfig.addFilter("date", (dateObj) => {
    if (!dateObj) return "";
    const dt = DateTime.fromJSDate(dateObj, { zone: 'utc' });
    const now = DateTime.utc();

    // If same year, omit the year
    if (dt.year === now.year) {
      return dt.toFormat("LLLL d"); // Example: January 1
    } else {
      return dt.toFormat("LLLL d, yyyy"); // Example: January 1, 2025
    }
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};
