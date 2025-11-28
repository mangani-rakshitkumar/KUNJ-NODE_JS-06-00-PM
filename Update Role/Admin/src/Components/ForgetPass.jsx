import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"

const ForgetPass = () => {
    const [forgetEmail, setForgetEmail] = useState("");
    const navigate = useNavigate()

    const handelSendOtp = ((e) => {
        e.preventDefault()

        axios.post("http://localhost:8080/forget", { forgetEmail })
            .then((res) => {
                alert(res.data.message)

                if (res.data.flag) {
                    Cookies.set("forgetEmail", res.data.forgetEmail, { expires: 1 / 24 })
                    navigate("/otpverify")
                }

            })
            .catch((err) => {
                alert(err.response?.data?.message || "Error sending OTP. Please try again.")
            })
    })

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C6E2FF] via-[#FFD6E8] to-[#C8F7C5] p-4">
            <div className="w-full max-w-md bg-white/85 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/60">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    Forgot Password
                </h2>

                <p className="text-center text-gray-600 text-sm mb-8">
                    Enter your registered email address below and we’ll send you a otp to reset your password.
                </p>

                <form className="space-y-5" onSubmit={handelSendOtp}>
                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Email</label>
                        <input
                            required
                            type="email"
                            value={forgetEmail}
                            onChange={(e) => setForgetEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#81D4FA]"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full cursor-pointer py-2 rounded-lg bg-gradient-to-r from-[#81D4FA] via-[#A5D6A7] to-[#F48FB1] text-white font-semibold shadow-md hover:opacity-90 transition duration-200"
                    >
                        Send Otp
                    </button>

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

export default ForgetPass;
