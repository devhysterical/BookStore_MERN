import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../context/useAuth";

const Login = () => {
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser, googleLogin } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);
      alert("Login successfully!");
      navigate("/");
    } catch (error) {
      setMessage("Invalid email or password. Please try again.");
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      alert("Login with Google successfully!");
      navigate("/");
    } catch (error) {
      setMessage("Login with Google failed");
      console.error(error);
    }
  };

  // Hàm xử lý đăng nhập bằng Facebook
  const handleFacebookLogin = () => {
    // Thực hiện các xử lý đăng nhập bằng Facebook tại đây
    // Hoàn thành trong tương lai
  };

  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:shadow"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:shadow"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center text-gray-500 mt-4">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error message */}
          {message && (
            <p className="text-red-500 text-xs italic mb-3">{message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow">
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-500 hover:text-blue-700">
            Register
          </Link>
        </p>

        {/* Login with Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center border border-gray-300 hover:border-blue-500 text-gray-700 font-medium py-2 px-4 rounded mt-4">
          <FcGoogle className="mr-2" />
          Login with Google
        </button>

        {/* Login with Facebook */}
        <button
          onClick={handleFacebookLogin}
          className="w-full flex items-center justify-center border border-gray-300 hover:border-blue-500 text-gray-700 font-medium py-2 px-4 rounded mt-4">
          <SiFacebook className="mr-2" />
          Login with Facebook
        </button>

        <p className="mt-5 text-center text-gray-500 text-xs">
          ©2025 Book Store. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
