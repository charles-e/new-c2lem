const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");

const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-link-attributes");

module.exports = function (eleventyConfig) {

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

  eleventyConfig.addPlugin(pluginRss, {
    posthtmlRenderOptions: {
      closingSingleTag: "default", // opt-out of <img/>-style XHTML single tags
    },
  });

  // passthrough css & js
  eleventyConfig.addPassthroughCopy({ "src/_includes/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/_includes/scripts": "scripts" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "public": "/" });

  eleventyConfig.addFilter('xmlEscape', function (value) {
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
      limit: 20,     // 0 means no limit
    },
    metadata: {
      language: "en",
      title: "c2lem/books RSS Feed",
      subtitle: "Book Notes",
      base: "https://c2lem.com/",
      author: {
        name: "Charles",
        email: "charles@c2lem.com",
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
      limit: 10,     // 0 means no limit
    },
    metadata: {
      language: "en",
      title: "c2lem/weeklies RSS Feed",
      subtitle: "just news & stuff",
      base: "https://c2lem.com/",
      author: {
        name: "Lemagne",
        email: "lemagne@c2lem.com",
      }
    }
  });
  // Collection to list all books sorted by date
  eleventyConfig.addCollection("allBooksSorted", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./src/books/*.md").filter(book => book.data.date_posted).sort((a, b) => {
      return new Date(b.data.date_posted) - new Date(a.data.date_posted);
    });
  });

  eleventyConfig.addCollection("allPendingBooks", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/books/*/*.md")
      .filter(book => !book.data.date_read) // ✅ ONLY books WITHOUT date_read
      .sort((a, b) => {
        const dateA = a.data.date_started || book.date;
        const dateB = b.data.date_started || book.date;
        return new Date(dateB) - new Date(dateA);
      });
  });

  eleventyConfig.addCollection("weekliesSorted", function (collectionApi) {
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

  eleventyConfig.addFilter("firstLast", function (name) {
    if (!name || typeof name !== "string") return name;

    // Handles single or multiple authors
    return name
      .split(/\s*;\s*/) // split multiple authors with `;` if used
      .map(author => {
        const parts = author.split(",");
        if (parts.length === 2) {
          return `${parts[1].trim()} ${parts[0].trim()}`;
        } else {
          return author.trim(); // fallback if already First Last or malformed
        }
      })
      .join(", ");
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};
