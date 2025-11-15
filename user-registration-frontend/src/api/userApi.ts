import { api, setAccessToken } from "./axiosInstance";

export interface AuthData {
  email: string;
  password: string;
}

// =========================
// REGISTER
// =========================
export const registerUser = async (data: AuthData) => {
  const res = await api.post("/user/register", data);
  return res.data;
};

// =========================
// LOGIN → lưu token
// =========================
export const loginUser = async (data: AuthData) => {
  const res = await api.post("/user/login", data);

  // lưu access token vào memory (React sẽ giữ until refresh page)
  setAccessToken(res.data.accessToken);

  // lưu refresh token vào localStorage (persist)
  localStorage.setItem("refreshToken", res.data.refreshToken);

  return res.data;
};

// =========================
// LOGOUT
// =========================
export const logoutUser = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    await api.post("/user/logout");
  }

  localStorage.removeItem("refreshToken");
  setAccessToken(null);
};

// =========================
// Protected Route Example
// =========================
export const getMe = async () => {
  const res = await api.get("/user/me");
  return res.data;
};
