import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import getBaseUrl from "../utils/baseURL";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(
        `${getBaseUrl()}/api/auth/admin`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const auth = response.data;
      console.log(auth);
      if (auth.token) {
        localStorage.setItem("token", auth.token);
        setTimeout(() => {
          localStorage.removeItem("token");
          alert("Token expired. Please login again.");
          navigate("/");
        }, 3600000); // 1 hour in milliseconds (1s = 1000ms, 1h = 3600s => 1h 3600 * 1000 = 3600000ms)
      }
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      setMessage("Invalid email or password. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Admin Dashboard Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              {...register("username", { required: "Username is required" })}
              type="username"
              placeholder="Enter your username"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:shadow"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
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

        {/* <p className="mt-4 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-500 hover:text-blue-700">
            Register
          </Link>
        </p> */}

        {/* Login with Google */}
        {/* <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center border border-gray-300 hover:border-blue-500 text-gray-700 font-medium py-2 px-4 rounded mt-4">
          <FcGoogle className="mr-2" />
          Login with Google
        </button> */}

        {/* Login with Facebook */}
        {/* <button
          onClick={handleFacebookLogin}
          className="w-full flex items-center justify-center border border-gray-300 hover:border-blue-500 text-gray-700 font-medium py-2 px-4 rounded mt-4">
          <SiFacebook className="mr-2" />
          Login with Facebook
        </button> */}

        <p className="mt-5 text-center text-gray-500 text-xs">
          ©2025 Book Store. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
