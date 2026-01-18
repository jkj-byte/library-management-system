import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Library() {
  const navigate = useNavigate();

  // ===== STATE =====
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("Reading");
  const [search, setSearch] = useState("");

  // ===== AUTH CHECK =====
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchBooks(token);
    }
  }, []);

  // ===== FETCH BOOKS (LIST + SEARCH) =====
  const fetchBooks = async (token) => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/books?search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      alert("Failed to load books");
      return;
    }

    const data = await res.json();
    setBooks(data.books || []);
  };

  // ===== ADD BOOK =====
  const addBook = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, author, status }),
    });

    if (res.ok) {
      setTitle("");
      setAuthor("");
      setStatus("Reading");
      fetchBooks(token);
    } else {
      alert("Failed to add book");
    }
  };

  // ===== UPDATE STATUS =====
  const updateStatus = async (bookId, newStatus) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://127.0.0.1:8000/api/books/${bookId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (res.ok) {
      fetchBooks(token);
    } else {
      alert("Failed to update status");
    }
  };

  const deleteBook = async (bookId) => {
  const token = localStorage.getItem("token");

  const confirmDelete = window.confirm("Are you sure you want to delete this book?");
  if (!confirmDelete) return;

  const res = await fetch(`http://127.0.0.1:8000/api/books/${bookId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    fetchBooks(token);
  } else {
    alert("Failed to delete book");
  }
};


  // ===== LOGOUT =====
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ===== UI =====
  return (
    <div>
      <h2>My Library</h2>

      <p>You have {books.length} books</p>

      {/* SEARCH */}
      <input
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={() => fetchBooks(localStorage.getItem("token"))}>
        Search
      </button>

      <hr />

      {/* ADD BOOK */}
      <h3>Add Book</h3>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option>Reading</option>
        <option>Completed</option>
        <option>Plan-to-Read</option>
      </select>

      <button onClick={addBook}>Add</button>

      <hr />

      {/* BOOK LIST */}
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <b>{book.title}</b> – {book.author}{" "}
            <select
              value={book.status}
              onChange={(e) =>
                updateStatus(book.id, e.target.value)
              }
            >
              <option>Reading</option>
              <option>Completed</option>
              <option>Plan-to-Read</option>
            </select>
            <span>
              {" "}
              | Added:{" "}
              {new Date(book.created_at).toLocaleString()}
            </span>
            <button
    style={{ marginLeft: "10px", color: "red" }}
    onClick={() => deleteBook(book.id)}
  >
    Delete
  </button>
          </li>
        ))}
      </ul>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Library;
