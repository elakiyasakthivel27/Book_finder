import React, { useState } from "react";
import "./styles.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const booksPerPage = 3;

  const searchBooks = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${query}`
      );
      const data = await response.json();

      const formattedBooks = data.docs
        .filter((book) => book.cover_i)
        .map((book) => ({
          title: book.title || "Unknown Title",
          author: book.author_name ? book.author_name[0] : "Unknown Author",
          year: book.first_publish_year || "N/A",
          cover: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
        }));

      setBooks(formattedBooks);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error fetching books:", error);
      alert("Failed to fetch books. Please try again!");
    }
  };

  const nextPage = () => {
    if (currentIndex + booksPerPage < books.length) {
      setCurrentIndex(currentIndex + booksPerPage);
    }
  };

  const prevPage = () => {
    if (currentIndex - booksPerPage >= 0) {
      setCurrentIndex(currentIndex - booksPerPage);
    }
  };

  const displayedBooks = books.slice(currentIndex, currentIndex + booksPerPage);

  return (
    <div className="App">
      <h1>📘 Book Finder</h1>
      <p className="subtitle">Find new books, based on old favourites</p>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter a book name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchBooks()}
        />
        <button onClick={searchBooks}>Search</button>
      </div>

      {books.length > 0 ? (
        <div className="books-section">
          <button className="side-btn left" onClick={prevPage}>
            ⬅
          </button>

          <div className="books-grid">
            {displayedBooks.map((book, index) => (
              <div key={index} className="book-card">
                <img src={book.cover} alt={book.title} />
                <h3>{book.title}</h3>
                <p>
                  <strong>Author:</strong> {book.author}
                </p>
                <p>
                  <strong>Year:</strong> {book.year}
                </p>
              </div>
            ))}
          </div>

          <button className="side-btn right" onClick={nextPage}>
            ➡
          </button>
        </div>
      ) : (
        <p className="no-results">Search for books above 👆</p>
      )}
    </div>
  );
}
