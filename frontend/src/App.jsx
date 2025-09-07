import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Books from "./components/Books.jsx";
import Students from "./components/Students.jsx";
import Borrowings from "./components/Borrowings.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Home />} />

        {/* Other pages */}
        <Route path="/books" element={<Books />} />
        <Route path="/students" element={<Students />} />
        <Route path="/borrowings" element={<Borrowings />} />
      </Routes>
    </BrowserRouter>
  );
}
