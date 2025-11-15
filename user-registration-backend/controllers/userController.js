import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =========================
// Helpers
// =========================
const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" } // 15 minutes
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // 7 days
  );
};

// =========================
// Register
// =========================
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password)
      return res.status(400).json({ message: "Email và password là bắt buộc" });

    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ message: "Email không hợp lệ" });

    if (password.length < 6)
      return res.status(400).json({ message: "Mật khẩu phải ít nhất 6 ký tự" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email đã tồn tại" });

    // Hash password
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// =========================
// Login
// =========================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email không tồn tại" });

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Sai mật khẩu" });

    // Tạo token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // (Optional) lưu refreshToken vào DB
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      message: "Đăng nhập thành công",
      accessToken,
      refreshToken,
      user: { email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// =========================
// Refresh Token
// =========================
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "Thiếu refresh token" });

  try {
    // Kiểm tra token có hợp lệ
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user)
      return res.status(401).json({ message: "User không tồn tại" });

    // So khớp token DB (optional)
    if (user.refreshToken !== refreshToken)
      return res.status(401).json({ message: "Refresh token không hợp lệ" });

    const newAccessToken = generateAccessToken(user._id);

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    return res.status(403).json({ message: "Refresh token hết hạn hoặc không hợp lệ" });
  }
};

// =========================
// Logout
// =========================
export const logoutUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId)
      return res.status(400).json({ message: "Thiếu userId" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(400).json({ message: "User không tồn tại" });

    user.refreshToken = null;
    await user.save();

    return res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
