import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const SAdmin = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", roleId: "" });
  

  const superToken = Cookies.get("superToken");

  useEffect(() => {
    if (!superToken) {
      alert("Super Admin access required. Please login again.");
      window.location.href = "/";
      return;
    }
    fetchUsers();
    fetchRoles();
  }, [superToken]);

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${superToken}`
    }
  });

  const fetchUsers = () => {
    axios
      .get("http://localhost:8080/superAdmin", getAuthHeaders())
      .then((res) => setUsers(res.data.allUsers))
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("Authentication failed. Please login again.");
          Cookies.remove("superToken");
          window.location.href = "/";
        }
      });
  };

  const fetchRoles = () => {
    axios
      .get("http://localhost:8080/roles", getAuthHeaders())
      .then((res) => {
        const fetchedRoles = res.data.roles || [];
        setRoles(fetchedRoles);

        const userRole = fetchedRoles.find(role => role.name === "User");
        if (userRole) {
          setNewUser(prev => ({ ...prev, roleId: userRole._id }));
        }
      })
      .catch((err) => console.log("Error fetching roles:", err));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("All fields are required!");
      return;
    }

    const userRole = roles.find(r => r.name === "User");
    const roleToAssign = newUser.roleId || (userRole ? userRole._id : "");

    axios
      .post("http://localhost:8080/superAdmin/addUser", { ...newUser, roleId: roleToAssign }, getAuthHeaders())
      .then((res) => {
        alert(res.data.message);
        if (res.data.user) {
          fetchUsers();
          const defaultRole = roles.find(r => r.name === "User");
          setNewUser({ name: "", email: "", password: "", roleId: defaultRole ? defaultRole._id : "" });
          setShowAddForm(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleRoleChange = (userId, roleId) => {
    axios
      .put(`http://localhost:8080/users/${userId}/role`, { roleId }, getAuthHeaders())
      .then((res) => {
        alert(res.data.message);
        fetchUsers();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:8080/users/${userId}`, getAuthHeaders())
        .then((res) => {
          alert(res.data.message);
          fetchUsers();
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 text-white flex justify-center items-center p-6">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">

        {/* Header + Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#81D4FA] to-[#F48FB1] drop-shadow-lg">
              Super Admin Panel
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {roles.map((role) => (
                <span key={role._id} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs border border-blue-500/30">
                  {role.name}
                </span>
              ))}
              {roles.length === 0 && <span className="text-red-400 text-xs">No roles loaded</span>}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 transition text-white font-semibold"
            >
              {showAddForm ? "Cancel" : "Add User"}
            </button>

            <Link
              to="/admin/add"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition text-white font-semibold"
            >
              Add Product
            </Link>

            <Link
              to="/admin/products"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 hover:opacity-90 transition text-white font-semibold"
            >
              View Products
            </Link>
          </div>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <div className="mb-8 p-6 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-xl font-semibold mb-4 text-[#81D4FA]">Add New User</h3>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="px-4 py-2 rounded-lg bg-[#2e2e2e] border border-gray-500 text-white"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="px-4 py-2 rounded-lg bg-[#2e2e2e] border border-gray-500 text-white"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="px-4 py-2 rounded-lg bg-[#2e2e2e] border border-gray-500 text-white"
              />

              <div>
                <label className="block mb-1 text-gray-300">Select Role</label>
                <select
                  value={newUser.roleId}
                  onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-[#2e2e2e] border border-gray-500 text-white"
                >
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>{role.name}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="md:col-span-2 w-full px-6 py-2 rounded-lg bg-gradient-to-r from-[#81D4FA] to-[#F48FB1] text-gray-900">
                Create User
              </button>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-white/10 rounded-lg shadow-md">
            <thead className="bg-gradient-to-r from-[#424242] to-[#212121] text-[#F48FB1] uppercase text-sm">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 text-center">Current Role</th>
                <th className="px-4 py-3 text-center">Change Role</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className={`${index % 2 === 0 ? "bg-white/5" : "bg-white/10"}`}>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-3 py-1 rounded-full text-xs bg-green-600/20 text-green-300">
                      {user.role ? user.role.name : "User"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={user.role ? user.role._id : ""}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="px-3 py-2 rounded-lg bg-[#2e2e2e] border border-gray-500 text-white"
                    >
                      {roles.map((role) => (
                        <option key={role._id} value={role._id}>{role.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default SAdmin;