import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import useAuth from "../context/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [message, setMessage] = useState("");
  const { registerUser, googleLogin } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Watch the password field
  const password = watch("password", "");
  // Quản lý trạng thái hiển thị mật khẩu cho từng trường
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Xử lý chuyển đổi hiển thị mật khẩu
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Register user
  const onSubmit = async (data) => {
    try {
      await registerUser(data.email, data.password);
      alert("User registered successfully!");
    } catch (error) {
      setMessage("Please provide a valid email and password");
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      alert("Login with Google successfully!");
    } catch (error) {
      setMessage("Login with Google failed");
      console.error(error);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Create an account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2">
              Email address
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              id="email"
              placeholder="Enter your email address"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* Password */}
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must have at least 8 characters",
                },
              })}
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center text-gray-500 mt-4">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs italic">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Re-enter your password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center text-gray-500 mt-4">
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs italic">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Error message */}
          {message && (
            <p className="text-red-500 text-xs italic mb-3">{message}</p>
          )}
          {/* Submit */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline">
              Register
            </button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm text-gray-500 font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-500 hover:text-blue-700">
            Login
          </Link>
        </p>
        {/* Login with Google */}
        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center bg-white border border-gray-300 hover:border-blue-500 text-gray-700 font-medium py-2 px-4 rounded mt-4">
            <FcGoogle className="mr-2" />
            Login with Google
          </button>
        </div>
        {/* Login with Facebook */}
        <div className="mt-4">
          <button className="w-full flex items-center justify-center bg-white border border-gray-300 hover:border-blue-500 text-gray-700 font-medium py-2 px-4 rounded mt-4">
            <SiFacebook className="mr-2" />
            Login with Facebook
          </button>
        </div>
        <p className="mt-5 text-center text-gray-500 text-xs">
          ©2025 Book Store. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;
