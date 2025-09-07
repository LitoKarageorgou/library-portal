import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Books from "./Books";
import Students from "./Students";
import Borrowings from "./Borrowings";

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
