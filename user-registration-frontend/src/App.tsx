import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4 flex justify-between">
        <Link to="/" className="font-bold text-lg">UserApp</Link>
        <div className="flex gap-4">
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/signup" className="hover:underline">Sign Up</Link>
        </div>
      </nav>

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}
