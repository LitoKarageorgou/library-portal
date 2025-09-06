import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Books() {
  return <h2>Books page</h2>;
}
function Students() {
  return <h2>Students page</h2>;
}
function Borrowings() {
  return <h2>Borrowings page</h2>;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Navigation bar */}
      <nav className="flex gap-4 mb-6 p-4 bg-gray-100 shadow rounded">
  <Link
    to="/books"
    className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
  >
    Books
  </Link>
  <Link
    to="/students"
    className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
  >
    Students
  </Link>
  <Link
    to="/borrowings"
    className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition"
  >
    Borrowings
  </Link>
</nav>


      {/* Routes */}
      <Routes>
        <Route path="/books" element={<Books />} />
        <Route path="/students" element={<Students />} />
        <Route path="/borrowings" element={<Borrowings />} />
      </Routes>
    </BrowserRouter>
  );
}
