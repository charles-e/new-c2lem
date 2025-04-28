async function setupSearch() {
  console.log("setupSearch")
    const response = await fetch('/search.json');
    const books = await response.json();
  
    const idx = lunr(function () {
      this.ref('url');
      this.field('title');
      this.field('author');
      this.field('tags');
  
      books.forEach(book => this.add(book));
    });
  
    const searchBox = document.getElementById('search-box');
    const bookList = document.getElementById('book-list');
  
    function renderResults(results) {
      if (bookList== null || bookList.innerHTML == null){
        console.log('no booklist yet.')
        return;
      }
      else {
      if (results.length === 0) {
        bookList.innerHTML = '<li>No results found</li>';
      } else {
        bookList.innerHTML = results.map(result => {
          const book = books.find(b => b.url === result.ref);
          return `<li><a href="${book.url}">${book.title}</a> — by ${book.author}</li>`;
        }).join('');
      }
    }
    }
  
    searchBox.addEventListener('input', function() {
      const query = this.value.trim();
  
      if (query.length === 0) {
        renderResults(books.map(book => ({ ref: book.url })));
        return;
      }
  
      const results = idx.search(query);
      renderResults(results);
    });
  
    // Initial render (all books)
    renderResults(books.map(book => ({ ref: book.url })));
  }
  
  window.addEventListener('load', () => {
    setupSearch();
  });  