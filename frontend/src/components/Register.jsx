import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";

const Register = () => {
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);
  const handleGoogleLogin = () => {};
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
              {...register("email", { required: true })}
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              placeholder="Enter your email address"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>
          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>
          {/* Confirm Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              placeholder="Re-enter your password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>
          {/* Error message */}
          {message && (
            <p className="text-red-500 text-xs italic mb-3">{message}</p>
          )}

          {/* Submit */}
          <div>
            <button
              type="submit"
              className=" flex w-full justify-center text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline">
              Login
            </button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm/6 text-gray-500 font-medium">
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
            className="w-full flex flex-wrap gap-1 justify-center items-center bg-white border border-gray-300 hover:border-blue-500 text-gray-700 font-medium py-2 px-4 rounded mt-4">
            <FcGoogle className="mr-2" />
            Login with Google
          </button>
        </div>
        {/* Login with Facebook */}
        <div className="mt-4">
          <button className="w-full flex flex-wrap gap-1 justify-center items-center bg-white border border-gray-300 hover:border-blue-500 text-gray-700 font-medium py-2 px-4 rounded mt-4">
            <SiFacebook />
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
