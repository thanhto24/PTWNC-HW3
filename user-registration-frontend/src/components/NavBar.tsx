import { Link, useNavigate } from "react-router-dom";
import { setAccessToken } from "../api/axiosInstance";

export default function NavBarComponent() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    // Xóa token và user
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    setAccessToken(null); // reset token trong memory
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-lg">UserApp</Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span>Hi, {user.email}</span>
            <button
              onClick={handleLogout}
              className="hover:underline bg-red-500 px-3 py-1 rounded text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
