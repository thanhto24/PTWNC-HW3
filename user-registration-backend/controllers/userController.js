import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password) {
      return res.status(400).json({ message: "Email và password là bắt buộc" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải ít nhất 6 ký tự" });
    }

    // check existing email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }

    // hash password
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ email, password: hashed });
    await newUser.save();

    return res.status(201).json({
      message: "Đăng ký thành công",
      user: { email: newUser.email, createdAt: newUser.createdAt },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra có email không
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    // So sánh password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    // Sau này có thể thêm JWT ở đây
    res.status(200).json({ message: "Đăng nhập thành công", user: { email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};