import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const superToken = Cookies.get("superToken");

  useEffect(() => {
    if (!superToken) {
      alert("Super Admin access required. Please login again.");
      navigate("/");
      return;
    }
    fetchProducts();
  }, [superToken, navigate]);

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${superToken}`
    }
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/products", getAuthHeaders());
      setProducts(response.data.products || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products");
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        const response = await axios.delete(
          `http://localhost:8080/products/${productId}`,
          getAuthHeaders()
        );
        alert(response.data.message);
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 text-white flex justify-center items-center">
        <div className="text-2xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 text-white p-6">
      <div className="w-full max-w-6xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#81D4FA] to-[#F48FB1]">
            All Products ({products.length})
          </h2>
          <div className="flex gap-3">
            <Link
              to="/admin/add"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 transition text-white font-semibold"
            >
              Add New Product
            </Link>
            <Link
              to="/superadmin"
              className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition text-white font-semibold"
            >
              Back to Admin
            </Link>
          </div>
        </div>

        {/* Products Display */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-300 mb-4">No products found</p>
            <Link
              to="/admin/add"
              className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition text-white font-semibold"
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full border border-white/10 rounded-lg shadow-md">
                <thead className="bg-gradient-to-r from-[#424242] to-[#212121] text-[#F48FB1] uppercase text-sm">
                  <tr>
                    <th className="px-4 py-3 text-left">Image</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product._id} className={`${index % 2 === 0 ? "bg-white/5" : "bg-white/10"}`}>
                      <td className="px-4 py-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-400">No Image</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#81D4FA]">{product.name}</td>
                      <td className="px-4 py-3 text-gray-300">{product.category || "N/A"}</td>
                      <td className="px-4 py-3 font-bold text-green-400">₹{product.price}</td>
                      <td className="px-4 py-3 text-gray-300 max-w-xs truncate">{product.description}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <Link
                            to={`/admin/edit/${product._id}`}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product._id, product.name)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product._id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                  {/* Product Image */}
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-600 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  
                  {/* Product Info */}
                  <h4 className="text-lg font-semibold text-[#81D4FA] mb-2">{product.name}</h4>
                  {product.category && (
                    <p className="text-sm text-gray-400 mb-1">Category: {product.category}</p>
                  )}
                  <p className="text-2xl font-bold text-green-400 mb-2">₹{product.price}</p>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{product.description}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/edit/${product._id}`}
                      className="flex-1 text-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product._id, product.name)}
                      className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default ProductList;