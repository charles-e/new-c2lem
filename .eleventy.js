const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");


module.exports = function(eleventyConfig) {
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
  eleventyConfig.addCollection("allBooksSorted", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/books/*.md")
    .filter(book => book.data.date_read) // ✅ ONLY books that have date_read
      .sort((b,a) => {
        const dateA = a.data.date_read || a.data.date_started;
        const dateB = b.data.date_read || b.data.date_started;
        return new Date(dateA) - new Date(dateB); // Newest first
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
