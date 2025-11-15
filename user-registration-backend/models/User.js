import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },

  password: { 
    type: String, 
    required: true 
  },

  refreshToken: {
    type: String,
    default: null, // sẽ lưu refresh token khi login
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.model("User", userSchema);
