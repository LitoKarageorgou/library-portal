import { useEffect, useState } from "react";
import { fetchJSON } from "./api/client";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Books() {
  // State variables
  const [books, setBooks] = useState([]); // list of books
  const [editingBook, setEditingBook] = useState(null); // currently editing book id
  const [form, setForm] = useState({ title: "", author: "", copies: "" }); // edit form state
  const [newBook, setNewBook] = useState({ title: "", author: "", copies: "" }); // add form state
  const [confirmDelete, setConfirmDelete] = useState(null); // holds book id to delete

  // Fetch books on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // Load books from API
  async function fetchBooks() {
    const data = await fetchJSON("/books");
    setBooks(data);
  }

  // Delete a book
  async function deleteBook(id) {
    try {
      await fetchJSON(`/books/${id}`, { method: "DELETE" });
      fetchBooks();
    } catch (err) {
      alert("Error deleting book: " + err.message);
    }
  }

  // Start editing a book
  function startEdit(book) {
    setEditingBook(book.id);
    setForm({ title: book.title, author: book.author, copies: book.copies });
  }

  // Cancel editing
  function cancelEdit() {
    setEditingBook(null);
    setForm({ title: "", author: "", copies: "" });
  }

  // Save edited book
  async function saveEdit(id) {
    try {
      await fetchJSON(`/books/${id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      fetchBooks();
      cancelEdit();
    } catch (err) {
      alert("Error updating book: " + err.message);
    }
  }

  // Add a new book
  async function addBook(e) {
    e.preventDefault();
    try {
      await fetchJSON("/books", {
        method: "POST",
        body: JSON.stringify(newBook),
      });
      setNewBook({ title: "", author: "", copies: "" }); // clear form
      fetchBooks();
    } catch (err) {
      alert("Error adding book: " + err.message);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Books</h2>

      {/* Add new book form */}
      <form
        onSubmit={addBook}
        className="mb-6 flex gap-4 items-end bg-gray-100 p-4 rounded"
      >
        <input
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          placeholder="Title"
          className="border p-2 flex-1"
          required
        />
        <input
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          placeholder="Author"
          className="border p-2 flex-1"
          required
        />
        <input
          type="number"
          value={newBook.copies}
          onChange={(e) => setNewBook({ ...newBook, copies: e.target.value })}
          placeholder="Copies"
          className="border p-2 w-24"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Book
        </button>
      </form>

      {/* Books table */}
      <table className="table-auto w-full border-collapse border border-gray-300 shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Author</th>
            <th className="border px-4 py-2">Copies</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="text-center">
              {editingBook === book.id ? (
                // Edit mode row
                <>
                  <td className="border px-4 py-2">{book.id}</td>
                  <td className="border px-4 py-2">
                    <input
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      value={form.author}
                      onChange={(e) =>
                        setForm({ ...form, author: e.target.value })
                      }
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={form.copies}
                      onChange={(e) =>
                        setForm({ ...form, copies: e.target.value })
                      }
                      className="border p-1 w-20"
                    />
                  </td>
                  <td className="border px-4 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => saveEdit(book.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                // View mode row
                <>
                  <td className="border px-4 py-2">{book.id}</td>
                  <td className="border px-4 py-2">{book.title}</td>
                  <td className="border px-4 py-2">{book.author}</td>
                  <td className="border px-4 py-2">{book.copies}</td>
                  <td className="border px-4 py-2 flex gap-2 justify-center">
                    <FaEdit
                      onClick={() => startEdit(book)}
                      className="text-blue-600 cursor-pointer hover:text-blue-800"
                    />
                    <FaTrash
                      onClick={() => setConfirmDelete(book.id)}
                      className="text-red-600 cursor-pointer hover:text-red-800"
                    />
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">Are you sure?</h3>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  deleteBook(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
