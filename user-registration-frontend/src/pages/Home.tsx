import { useEffect, useState } from "react";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch {
      console.error("Invalid user JSON");
    }
  }, []);

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold text-blue-700">Welcome to UserApp</h1>

      {user ? (
        <p className="text-gray-700 mt-3">
          Xin chào, <b>{user.email}</b> 👋
        </p>
      ) : (
        <p className="text-gray-600 mt-2">Bạn chưa đăng nhập</p>
      )}
    </div>
  );
}
