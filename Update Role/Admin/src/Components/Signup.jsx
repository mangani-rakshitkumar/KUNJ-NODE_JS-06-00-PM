import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'

const Signup = () => {

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    })

    const handelSignup = ((e) => {
        e.preventDefault();

        axios.post("http://localhost:8080/signup", { user })
            .then((res) => {
                alert(res.data.message)

                setUser({
                    name: "",
                    email: "",
                    password: "",
                });
            })
            .catch((err) => {
                alert(err.response?.data?.message || "Signup failed!")
            })

    })

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C6E2FF] via-[#FFD6E8] to-[#C8F7C5] p-4">
            <div className="w-full max-w-md bg-white/85 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/60">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    Create Your Account
                </h2>

                <form className="space-y-5" onSubmit={handelSignup}>
                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Full Name</label>
                        <input
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                            type="text"
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A5D6A7]"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Email</label>
                        <input
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#81D4FA]"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Password</label>
                        <input
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CE93D8]"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full cursor-pointer py-2 rounded-lg bg-gradient-to-r from-[#81D4FA] via-[#A5D6A7] to-[#F48FB1] text-white font-semibold shadow-md hover:opacity-90 transition duration-200"
                    >
                        Sign Up
                    </button>

                    <p className="text-center text-gray-600 text-sm mt-4">
                        Already have an account?{" "}
                        <Link to="/" className="text-[#5C6BC0] hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
