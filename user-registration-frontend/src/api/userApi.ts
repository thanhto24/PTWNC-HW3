import axios from "axios";

const BASE_URL = "https://ptwnc-hw-3.vercel.app";

export interface RegisterData {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const res = await axios.post(`${BASE_URL}/register`, data);
  return res.data;
};

export const loginUser = async (data: RegisterData) => {
  const res = await axios.post(`${BASE_URL}/login`, data);
  return res.data;
};
