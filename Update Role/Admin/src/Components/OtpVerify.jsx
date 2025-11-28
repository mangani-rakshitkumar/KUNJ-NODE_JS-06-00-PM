import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"

const OtpVerify = () => {
    const [otp, setOtp] = useState("");

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();

        const forgetEmail = Cookies.get("forgetEmail")

        axios.post("http://localhost:8080/otpverify", { otp, forgetEmail })
            .then((res) => {
                alert(res.data.message)

                if (res.data.flag) {
                    navigate("/resetpass")
                }
                else {
                    navigate("/forget")
                }
            })
            .catch((err) => {
                alert(err)
            })

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C6E2FF] via-[#FFD6E8] to-[#C8F7C5] p-4">
            <div className="w-full max-w-md bg-white/85 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/60">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    OTP Verification
                </h2>

                <p className="text-center text-gray-600 text-sm mb-8">
                    Enter the 6-digit OTP sent to your registered email address.
                </p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Enter OTP</label>
                        <input
                            required
                            type="number"
                            value={otp}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,6}$/.test(value)) {
                                    setOtp(value);
                                }
                            }}
                            maxLength={6}
                            placeholder="Enter 6-digit OTP"
                            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#81D4FA] tracking-widest text-center font-semibold text-lg"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full cursor-pointer py-2 rounded-lg bg-gradient-to-r from-[#81D4FA] via-[#A5D6A7] to-[#F48FB1] text-white font-semibold shadow-md hover:opacity-90 transition duration-200"
                    >
                        Verify OTP
                    </button>

                    <p className="text-center text-gray-600 text-sm mt-4">
                        Didn’t receive the code?{" "}
                        <Link to="/forget" className="text-[#5C6BC0] hover:underline">
                            Resend OTP
                        </Link>
                    </p>

                    <p className="text-center text-gray-600 text-sm mt-1">
                        <Link to="/" className="text-[#5C6BC0] hover:underline">
                            Back to Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default OtpVerify;
