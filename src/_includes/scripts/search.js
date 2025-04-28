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
    console.log("results len = " + results.length);

    if (bookList == null || bookList.innerHTML == null) {
      document.getElementById("no-results").style.display = "block";
      return;
    }
    else {
      let cards = document.getElementsByClassName("book-card");

      if (results.length === 0) {
        document.getElementById("no-results").style.display = "block";
        console.log(`cards len = ${cards.length}`);
        for (const card of cards) {
          card.style.display = "none";
        }
      } else {
        document.getElementById("no-results").style.display = "none";

        for (const card of cards) {
          const hit = results.find(b => b.ref === card.title);
          if (hit != undefined) {
            card.style.display = "block";
          }
        }
//         bookList.innerHTML = results.map(result => {
//           const book = books.find(b => b.url === result.ref);
//           return `<a href="${book.url}"><img src="${book.data.img_url}" alt="${book.data.title} by ${book.data.author}" />
// </a>`;
//         }).join('');

      }
     // reinitializeImages();

    }
  }

  searchBox.addEventListener('input', function () {
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