const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");

allSideMenu.forEach((item) => {
  const li = item.parentElement;

  item.addEventListener("click", function () {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    li.classList.add("active");
  });
});

const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");

menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
});

const switchMode = document.getElementById("switch-mode");

switchMode.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const addBookForm = document.getElementById("add-book-form");
  const tableUncompleted = document.getElementById("table-uncompleted").querySelector("tbody");
  const tableCompleted = document.getElementById("table-completed").querySelector("tbody");
  const belumSelesaiCount = document.querySelector(".belum-selesai-count");
  const selesaiCount = document.querySelector(".selesai-count");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.querySelector(".search-btn");

  searchButton.addEventListener("click", function () {
    searchBooks();
  });
  loadBooks();

  addBookForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = parseInt(document.getElementById("year").value);
    const isComplete = document.getElementById("isComplete").checked;

    const book = {
      id: +new Date(),
      title,
      author,
      year,
      isComplete,
    };

    if (isComplete) {
      addToTable(tableCompleted, book);
    } else {
      addToTable(tableUncompleted, book);
    }

    saveBook(book);

    addBookForm.reset();

    updateBookCount();
  });

  function addToTable(table, book) {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td><img src="assets/img/book.jpg" />${book.title}</td>
    <td>${book.author}</td>
    <td>${book.year}</td>
    <td>
        <button class="delete-button">Hapus Buku</button>
        <button class="switch-button ${book.isComplete ? "completed" : "uncompleted"}">${book.isComplete ? "Belum Selesai Dibaca" : "Selesai Dibaca"}</button>
        </td>
    `;

    const deleteButton = row.querySelector(".delete-button");
    deleteButton.addEventListener("click", function () {
      table.removeChild(row);

      deleteBook(book.id);

      updateBookCount();
    });

    const switchButton = row.querySelector(".switch-button");
    switchButton.addEventListener("click", function () {
      if (book.isComplete) {
        tableCompleted.removeChild(row);
        addToTable(tableUncompleted, book);
      } else {
        tableUncompleted.removeChild(row);
        addToTable(tableCompleted, book);
      }
      book.isComplete = !book.isComplete;
      updateBookCount();
      updateBookInStorage(book);
    });

    table.appendChild(row);
    console.log(book);
  }

  function saveBook(book) {
    const books = getBooksFromStorage();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  function deleteBook(bookId) {
    const books = getBooksFromStorage();
    const updatedBooks = books.filter((book) => book.id !== bookId);
    localStorage.setItem("books", JSON.stringify(updatedBooks));
  }

  function updateBookInStorage(updatedBook) {
    const books = getBooksFromStorage();
    const index = books.findIndex((book) => book.id === updatedBook.id);
    if (index !== -1) {
      books[index] = updatedBook;
      localStorage.setItem("books", JSON.stringify(books));
    }
  }

  function loadBooks() {
    const books = getBooksFromStorage();

    books.forEach((book) => {
      const table = book.isComplete ? tableCompleted : tableUncompleted;
      addToTable(table, book);
    });

    updateBookCount();
  }

  function getBooksFromStorage() {
    const booksData = localStorage.getItem("books");
    return booksData ? JSON.parse(booksData) : [];
  }

  function updateBookCount() {
    const books = getBooksFromStorage();
    const uncompletedBooks = books.filter((book) => !book.isComplete);
    const completedBooks = books.filter((book) => book.isComplete);
    belumSelesaiCount.textContent = uncompletedBooks.length.toString();
    selesaiCount.textContent = completedBooks.length.toString();
  }
  function searchBooks() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm === "") {
      alert("Masukkan kata kunci pencarian.");
      return;
    }

    removeAllBookRows();

    const books = getBooksFromStorage();

    const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTerm));

    filteredBooks.forEach((book) => {
      const table = book.isComplete ? tableCompleted : tableUncompleted;
      addToTable(table, book);
    });

    updateBookCount();
  }

  function removeAllBookRows() {
    const bookRows = document.querySelectorAll("#table-uncompleted tbody tr, #table-completed tbody tr");
    bookRows.forEach((row) => row.remove());
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const booksData = localStorage.getItem("books");
  const books = JSON.parse(booksData);

  console.log(books);
});
