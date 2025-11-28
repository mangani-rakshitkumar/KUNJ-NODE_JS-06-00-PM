import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"

const ResetPass = () => {
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPass) {
            const forgetEmail = Cookies.get("forgetEmail")
            axios.post("http://localhost:8080/resetpassword", { password , forgetEmail })
                .then((res) => {
                    alert(res.data.message)

                    if (res.data.flag) {
                        navigate("/")
                    }
                
                })
                .catch((err) => {
                    alert(err)
                })
        }
        else {
            alert("Password does not match !");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C6E2FF] via-[#FFD6E8] to-[#C8F7C5] p-4">
            <div className="w-full max-w-md bg-white/85 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/60">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    Reset Password
                </h2>

                <p className="text-center text-gray-600 text-sm mb-8">
                    Enter your new password below to regain access to your account.
                </p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* New Password */}
                    <div>
                        <label className="block text-gray-600 text-sm mb-2">
                            New Password
                        </label>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#81D4FA]"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-gray-600 text-sm mb-2">
                            Confirm Password
                        </label>
                        <input
                            required
                            type="password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#81D4FA]"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full cursor-pointer py-2 rounded-lg bg-gradient-to-r from-[#81D4FA] via-[#A5D6A7] to-[#F48FB1] text-white font-semibold shadow-md hover:opacity-90 transition duration-200"
                    >
                        Reset Password
                    </button>

                    {/* Links */}
                    <p className="text-center text-gray-600 text-sm mt-4">
                        Remembered your password?{" "}
                        <Link to="/" className="text-[#5C6BC0] hover:underline">
                            Back to Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ResetPass;
