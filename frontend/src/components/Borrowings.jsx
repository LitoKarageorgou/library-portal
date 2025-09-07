import { useEffect, useState } from "react";
import { fetchJSON } from "../api/client";
import { FaUndoAlt } from "react-icons/fa";
import BackHomeButton from "./BackHomeButton";

export default function Borrowings() {
  // State variables
  const [borrowings, setBorrowings] = useState([]); // list of borrowings
  const [students, setStudents] = useState([]); // list of students
  const [books, setBooks] = useState([]); // list of books

  // Form state for new borrowing
  const [newBorrowing, setNewBorrowing] = useState({
    student_id: "",
    book_id: "",
  });

  // Modal state for return confirmation (holds borrowing id)
  const [confirmReturn, setConfirmReturn] = useState(null);

  // Fetch all data on mount
  useEffect(() => {
    fetchAll();
  }, []);

  // Load borrowings, students, and books from API
  async function fetchAll() {
    const [b, s, bk] = await Promise.all([
      fetchJSON("/borrowings"),
      fetchJSON("/students"),
      fetchJSON("/books"),
    ]);
    setBorrowings(b);
    setStudents(s);
    setBooks(bk);
  }

  // Add a new borrowing
  async function addBorrowing(e) {
    e.preventDefault();
    try {
      await fetchJSON("/borrowings", {
        method: "POST",
        body: JSON.stringify({
          student_id: Number(newBorrowing.student_id),
          book_id: Number(newBorrowing.book_id),
        }),
      });
      setNewBorrowing({ student_id: "", book_id: "" }); // clear form
      fetchAll();
    } catch (err) {
      alert("Error creating borrowing: " + err.message);
    }
  }

  // Return a borrowing
  async function returnBorrowing(id) {
    try {
      await fetchJSON(`/borrowings/${id}/return`, { method: "PUT" });
      fetchAll();
    } catch (err) {
      alert("Error returning book: " + err.message);
    }
  }

  // Format ISO date string to simple date
  const fmt = (iso) => (iso ? new Date(iso).toLocaleDateString() : "-");

  // Helper: get student name from id
  const studentName = (id) =>
    students.find((s) => s.id === id)?.name || `#${id}`;

  // Helper: get book title from id
  const bookTitle = (id) =>
    books.find((b) => b.id === id)?.title || `#${id}`;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Borrowings</h2>

      {/* Add new borrowing form */}
      <form
        onSubmit={addBorrowing}
        className="mb-6 flex gap-4 items-end bg-gray-100 p-4 rounded"
      >
        {/* Student dropdown */}
        <div className="flex-1">
          <label className="block text-sm mb-1">Student</label>
          <select
            value={newBorrowing.student_id}
            onChange={(e) =>
              setNewBorrowing({ ...newBorrowing, student_id: e.target.value })
            }
            className="border p-2 w-full"
            required
          >
            <option value="">Select a student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Book dropdown */}
        <div className="flex-1">
          <label className="block text-sm mb-1">Book</label>
          <select
            value={newBorrowing.book_id}
            onChange={(e) =>
              setNewBorrowing({ ...newBorrowing, book_id: e.target.value })
            }
            className="border p-2 w-full"
            required
          >
            <option value="">Select a book</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} {b.copies > 0 ? "" : "(no copies)"}
              </option>
            ))}
          </select>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Borrowing
        </button>
      </form>

      {/* Borrowings table */}
      <table className="table-auto w-full border-collapse border border-gray-300 shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Student</th>
            <th className="border px-4 py-2">Book</th>
            <th className="border px-4 py-2">Borrowed at</th>
            <th className="border px-4 py-2">Due date</th>
            <th className="border px-4 py-2">Returned at</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {borrowings.map((br) => {
            const isReturned = Boolean(br.returned_at);
            return (
              <tr key={br.id} className="text-center">
                <td className="border px-4 py-2">{br.id}</td>
                <td className="border px-4 py-2">{studentName(br.student_id)}</td>
                <td className="border px-4 py-2">{bookTitle(br.book_id)}</td>
                <td className="border px-4 py-2">{fmt(br.borrowed_at)}</td>
                <td className="border px-4 py-2">{fmt(br.due_date)}</td>
                <td className="border px-4 py-2">{fmt(br.returned_at)}</td>
                <td className="border px-4 py-2">
                  {isReturned ? (
                    <span className="text-green-700 font-semibold">Returned</span>
                  ) : (
                    <button
                      onClick={() => setConfirmReturn(br.id)}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                      title="Return book"
                    >
                      <FaUndoAlt />
                      Return
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Return confirmation modal */}
      {confirmReturn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">Return this book?</h3>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  returnBorrowing(confirmReturn);
                  setConfirmReturn(null);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Yes, return
              </button>
              <button
                onClick={() => setConfirmReturn(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <BackHomeButton />
    </div>
  );
}
