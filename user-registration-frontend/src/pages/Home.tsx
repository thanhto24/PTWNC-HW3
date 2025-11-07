export default function Home() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold text-blue-700">Welcome to UserApp</h1>
      {user ? (
        <p className="text-gray-700 mt-3">Xin chào, <b>{user.email}</b> 👋</p>
      ) : (
        <p className="text-gray-600 mt-2">Bạn chưa đăng nhập</p>
      )}
    </div>
  );
}
