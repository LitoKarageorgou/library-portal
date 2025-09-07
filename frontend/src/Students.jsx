import { useEffect, useState } from "react";
import { fetchJSON } from "./api/client";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Students() {
  // State variables
  const [students, setStudents] = useState([]); // list of students
  const [editingStudent, setEditingStudent] = useState(null); // currently editing student id
  const [form, setForm] = useState({ name: "", email: "", class: "" }); // edit form state
  const [newStudent, setNewStudent] = useState({ name: "", email: "", class: "" }); // add form state
  const [confirmDelete, setConfirmDelete] = useState(null); // holds student id to delete

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Load students from API
  async function fetchStudents() {
    const data = await fetchJSON("/students");
    setStudents(data);
  }

  // Delete a student
  async function deleteStudent(id) {
    try {
      await fetchJSON(`/students/${id}`, { method: "DELETE" });
      fetchStudents();
    } catch (err) {
      alert("Error deleting student: " + err.message);
    }
  }

  // Start editing a student
  function startEdit(student) {
    setEditingStudent(student.id);
    setForm({ name: student.name, email: student.email, class: student.class });
  }

  // Cancel editing
  function cancelEdit() {
    setEditingStudent(null);
    setForm({ name: "", email: "", class: "" });
  }

  // Save edited student
  async function saveEdit(id) {
    try {
      await fetchJSON(`/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      fetchStudents();
      cancelEdit();
    } catch (err) {
      alert("Error updating student: " + err.message);
    }
  }

  // Add a new student
  async function addStudent(e) {
    e.preventDefault();
    try {
      await fetchJSON("/students", {
        method: "POST",
        body: JSON.stringify(newStudent),
      });
      setNewStudent({ name: "", email: "", class: "" }); // clear form
      fetchStudents();
    } catch (err) {
      alert("Error adding student: " + err.message);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Students</h2>

      {/* Add new student form */}
      <form
        onSubmit={addStudent}
        className="mb-6 flex gap-4 items-end bg-gray-100 p-4 rounded"
      >
        <input
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          placeholder="Name"
          className="border p-2 flex-1"
          required
        />
        <input
          type="email"
          value={newStudent.email}
          onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
          placeholder="Email"
          className="border p-2 flex-1"
          required
        />
        <input
          value={newStudent.class}
          onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
          placeholder="Class"
          className="border p-2 w-24"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Student
        </button>
      </form>

      {/* Students table */}
      <table className="table-auto w-full border-collapse border border-gray-300 shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Class</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="text-center">
              {editingStudent === student.id ? (
                // Edit mode row
                <>
                  <td className="border px-4 py-2">{student.id}</td>
                  <td className="border px-4 py-2">
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      value={form.class}
                      onChange={(e) =>
                        setForm({ ...form, class: e.target.value })
                      }
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="border px-4 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => saveEdit(student.id)}
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
                  <td className="border px-4 py-2">{student.id}</td>
                  <td className="border px-4 py-2">{student.name}</td>
                  <td className="border px-4 py-2">{student.email}</td>
                  <td className="border px-4 py-2">{student.class}</td>
                  <td className="border px-4 py-2 flex gap-2 justify-center">
                    <FaEdit
                      onClick={() => startEdit(student)}
                      className="text-blue-600 cursor-pointer hover:text-blue-800"
                    />
                    <FaTrash
                      onClick={() => setConfirmDelete(student.id)}
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
                  deleteStudent(confirmDelete);
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
