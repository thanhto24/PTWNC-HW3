import axios from "axios";

const BASE_URL = "https://ptwnc-hw3.onrender.com";

export interface RegisterData {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const res = await axios.post(`${BASE_URL}/user/register`, data);
  return res.data;
};

export const loginUser = async (data: RegisterData) => {
  const res = await axios.post(`${BASE_URL}/user/login`, data);
  return res.data;
};
