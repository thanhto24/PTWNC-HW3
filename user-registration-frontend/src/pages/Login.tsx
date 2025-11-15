import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginUser, type AuthData } from "../api/userApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<AuthData>();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setMessage("✅ Đăng nhập thành công!");

      // lưu user và token
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("refreshToken", data.refreshToken);

      // Redirect sau 1.5s
      setTimeout(() => navigate("/", { replace: true }), 1500);
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message: string }>;
      setMessage("❌ " + (err.response?.data?.message || "Lỗi không xác định"));
    },
  });

  const onSubmit = (data: AuthData) => {
    setMessage("");
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 p-2 rounded"
            {...register("email", { required: "Email là bắt buộc" })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 p-2 rounded"
            {...register("password", { required: "Password là bắt buộc" })}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}
