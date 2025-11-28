import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handelLogin = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8080/login", { email, password })
      .then((res) => {
        alert(res.data.message);
        console.log("LOGIN RESPONSE:", res.data);

        // Check for superadmin first
        if (res.data.superToken && res.data.role === 'superadmin') {
          Cookies.set("superToken", res.data.superToken, { expires: 1 / 24 });
          localStorage.setItem("userRole", "superadmin");
          setEmail("");
          setPassword("");
          navigate("/superadmin");
          return; // Exit here to prevent normal user login logic
        }

        // Normal user login
        if (res.data.token) {
          const token = res.data.token;
          localStorage.setItem("userName", res.data.userName);
          localStorage.setItem("userRole", res.data.role?.name || "User");
          Cookies.set("token", token, { expires: 1 / 24 });
          setEmail("");
          setPassword("");
          navigate("/user");
        }
      })
      .catch((err) => {
        alert(
          err.response?.data?.message ||
            "Server connection failed. Please ensure the backend is running on port 8080."
        );
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C6E2FF] via-[#FFD6E8] to-[#C8F7C5] p-4">
      <div className="w-full max-w-md bg-white/85 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/60">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        <form className="space-y-5" onSubmit={handelLogin}>
          <div>
            <label className="block text-gray-600 text-sm mb-2">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#81D4FA]"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-2">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CE93D8]"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link to="/forget" className="text-[#5C6BC0] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer py-2 rounded-lg bg-gradient-to-r from-[#81D4FA] via-[#A5D6A7] to-[#F48FB1] text-white font-semibold shadow-md hover:opacity-90 transition duration-200"
          >
            Login
          </button>

          <p className="text-center text-gray-600 text-sm mt-4">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[#5C6BC0] hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
