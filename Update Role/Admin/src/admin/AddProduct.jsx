import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: ""
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const superToken = Cookies.get("superToken");

  useEffect(() => {
    if (!superToken) {
      alert("Super Admin access required. Please login again.");
      navigate("/");
      return;
    }
  }, [superToken, navigate]);

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${superToken}`
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Project-Preset"); // Replace with your Cloudinary upload preset
    formData.append("cloud_name", "df8c3slcb"); // Replace with your Cloudinary cloud name

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/df8c3slcb/image/upload`, // Replace with your cloud name
        formData
      );
      return {
        secure_url: response.data.secure_url,
        public_id: response.data.public_id
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!product.name || !product.price || !product.description || !product.category) {
      alert("All fields are required!");
      return;
    }

    if (!image) {
      alert("Please select an image!");
      return;
    }

    setUploading(true);

    try {
      // Upload image to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(image);
      
      // Prepare product data with image URL
      const productData = {
        ...product,
        image: cloudinaryResult.secure_url,
        imagePublicId: cloudinaryResult.public_id
      };

      // Send to backend
      const response = await axios.post(
        "http://localhost:8080/products",
        productData,
        getAuthHeaders()
      );

      alert(response.data.message);
      navigate("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 text-white flex justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#81D4FA] to-[#F48FB1]">
            Add New Product
          </h2>
          <Link
            to="/superadmin"
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition text-white"
          >
            Back to Admin
          </Link>
        </div>

        {/* Add Product Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Product Name */}
          <div>
            <label className="block mb-2 text-gray-300">Product Name</label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#2e2e2e] border border-gray-500 text-white focus:border-blue-400 focus:outline-none"
              placeholder="Enter product name"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-2 text-gray-300">Price (₹)</label>
            <input
              type="number"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#2e2e2e] border border-gray-500 text-white focus:border-blue-400 focus:outline-none"
              placeholder="Enter price"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 text-gray-300">Category</label>
            <input
              type="text"
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#2e2e2e] border border-gray-500 text-white focus:border-blue-400 focus:outline-none"
              placeholder="Enter category"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-gray-300">Description</label>
            <textarea
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              className="w-full px-4 py-3 h-32 rounded-lg bg-[#2e2e2e] border border-gray-500 text-white focus:border-blue-400 focus:outline-none resize-none"
              placeholder="Enter product description"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-2 text-gray-300">Product Image</label>
            <input
              type="file"
              accept="image/*"
              capture="camera"
              onChange={handleImageChange}
              className="w-full px-4 py-3 rounded-lg bg-[#2e2e2e] border border-gray-500 text-white focus:border-blue-400 focus:outline-none"
            />
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-gray-300 mb-2">Image Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-500"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition ${
              uploading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
            } text-white`}
          >
            {uploading ? "Adding Product..." : "Add Product"}
          </button>

        </form>

        {/* Navigation Links */}
        <div className="flex gap-4 mt-6">
          <Link
            to="/admin/products"
            className="flex-1 text-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white"
          >
            View All Products
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AddProduct;