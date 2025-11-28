import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { LogOut, User } from "lucide-react";

const UserDash = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const userName = localStorage.getItem("userName");


  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-green-100 p-6">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-white/60 transition-all duration-300 hover:shadow-3xl">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10 border-b pb-5 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-400 to-green-400 rounded-full shadow-md">
              <User className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500">{userName}</span> 👋
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold shadow-md hover:opacity-90 transition-all duration-200"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 border border-gray-100">
            <h3 className="text-lg font-semibold mb-2 text-blue-600">Profile Overview</h3>
            <p className="text-sm text-gray-600">View and edit your personal details.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 border border-gray-100">
            <h3 className="text-lg font-semibold mb-2 text-green-600">Orders</h3>
            <p className="text-sm text-gray-600">Check your order history and track new ones.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 border border-gray-100">
            <h3 className="text-lg font-semibold mb-2 text-pink-600">Support</h3>
            <p className="text-sm text-gray-600">Need help? Contact our support team anytime.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDash;
