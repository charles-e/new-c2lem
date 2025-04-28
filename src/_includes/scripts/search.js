document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.getElementById("search-box");
  const helperText = document.getElementById("search-helper");

  if (searchBox && helperText) {
    searchBox.addEventListener("input", function () {
      if (searchBox.value.trim().length > 0) {
        helperText.style.opacity = "0";
      } else {
        helperText.style.opacity = "1";
      }
    });
  }
});

function reinitializeImages() {
  console.log("re-init img");
  const images = document.querySelectorAll("img");
  console.log(images.length);
  images.forEach(img => {
    console.log(" img");
    if (img.dataset) {
      img.src = img.dataset.src;
    }
  });
}

async function setupSearch() {
  console.log("setupSearch")
  const response = await fetch('/search.json');
  const books = await response.json();

  const idx = lunr(function () {
    this.ref('url');
    this.field('title');
    this.field('author');
    this.field('tags');
    this.field('series');

    books.forEach(book => this.add(book));
  });

  const searchBox = document.getElementById('search-box');

  const bookList = document.getElementById('book-list');

  function renderResults(results) {
    console.debug("results len = " + results.length);

    if (bookList == null || bookList.innerHTML == null) {
      document.getElementById("no-results").style.display = "block";
      return;
    }
    else {
      let cards = document.getElementsByClassName("book-card");

      if (results.length === 0) { 
      // filtered out all the books
        document.getElementById("no-results").style.display = "block";
        console.debug(`cards len = ${cards.length}`);
        for (const card of cards) {
          card.style.display = "none";
        }
      } else { // we have filtered some books
        // hide the no results message 
        document.getElementById("no-results").style.display = "none";
        // and for all the cards set the display attribute
        // none is the default
        // block if it is in the search result
        for (const card of cards) {
          const hit = results.find(b => b.ref === card.title);
          if (hit != undefined) {
            console.debug(`ref = ${hit.ref} card = ${card.ariaLabel}`);
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        }
      }

    }
  }

  searchBox.addEventListener('input', function () {

    // Append an asterisk to the query if necessary because that makes the search fuzzy.
    // Without this, all books are filtered (showing nothing) until an exact hit OR the user adds the asterisk.
    // And that behavior is confusing/annoying/bad.
    // If we replace lunr with something else then we can revisit.
    var query = this.value.trim();

    if (query.length === 0) {
      renderResults(books.map(book => ({ ref: book.url })));
      return;
    }
    if (query.endsWith('*') == false){
      query = query+'*';
    }
    console.debug(`qry = ${query}`);
    const results = idx.search(query);
    renderResults(results);
  });

  // Initial render (all books)
  renderResults(books.map(book => ({ ref: book.url })));
}

window.addEventListener('load', () => {
  setupSearch();
});  