module.exports = {
    data: {
      permalink: "/search.json",
      eleventyExcludeFromCollections: true
    },
  
    render({ collections }) {
      const books = collections.all
        .filter(book => book.inputPath.includes('/books/') && book.data.date_read)
        .map(book => ({
          title: book.data.title,
          author: book.data.author,
          tags: book.data.tags,
          url: book.url
        }));
  
      return JSON.stringify(books, null, 2);
    }
  };
  