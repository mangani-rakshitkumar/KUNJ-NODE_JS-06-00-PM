import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const EditProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
    imagePublicId: ""
  });
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const superToken = Cookies.get("superToken");

  useEffect(() => {
    if (!superToken) {
      alert("Super Admin access required. Please login again.");
      navigate("/");
      return;
    }
    fetchProduct();
  }, [id, superToken, navigate]);

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${superToken}`
    }
  });

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/products/${id}`,
        getAuthHeaders()
      );
      setProduct(response.data.product);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Failed to fetch product details");
      navigate("/admin/products");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
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
    formData.append("upload_preset", "myProjectPreset"); // Replace with your actual upload preset
    
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/drnll4as8/image/upload`, // Replace with your cloud name
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

  const deleteFromCloudinary = async (publicId) => {
    try {
      // Note: Deleting from Cloudinary requires server-side implementation
      // This is just a placeholder - implement on your backend
      await axios.delete(
        `http://localhost:8080/cloudinary/delete/${publicId}`,
        getAuthHeaders()
      );
    } catch (error) {
      console.error("Error deleting old image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!product.name || !product.price || !product.description || !product.category) {
      alert("All fields are required!");
      return;
    }

    setUpdating(true);

    try {
      let updatedProduct = { ...product };

      // If new image is selected, upload it
      if (newImage) {
        const cloudinaryResult = await uploadToCloudinary(newImage);
        
        // Delete old image if exists
        if (product.imagePublicId) {
          await deleteFromCloudinary(product.imagePublicId);
        }
        
        updatedProduct.image = cloudinaryResult.secure_url;
        updatedProduct.imagePublicId = cloudinaryResult.public_id;
      }

      // Send update request to backend
      const response = await axios.put(
        `http://localhost:8080/products/${id}`,
        updatedProduct,
        getAuthHeaders()
      );

      alert(response.data.message);
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 text-white flex justify-center items-center">
        <div className="text-2xl">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 text-white flex justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#81D4FA] to-[#F48FB1]">
            Edit Product
          </h2>
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition text-white"
          >
            Back to Products
          </Link>
        </div>

        {/* Edit Product Form */}
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

          {/* Current Image */}
          {product.image && (
            <div>
              <label className="block mb-2 text-gray-300">Current Image</label>
              <img
                src={product.image}
                alt="Current product"
                className="w-32 h-32 object-cover rounded-lg border border-gray-500"
              />
            </div>
          )}

          {/* New Image Upload */}
          <div>
            <label className="block mb-2 text-gray-300">Change Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 rounded-lg bg-[#2e2e2e] border border-gray-500 text-white focus:border-blue-400 focus:outline-none"
            />
            
            {/* New Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-gray-300 mb-2">New Image Preview:</p>
                <img
                  src={imagePreview}
                  alt="New preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-500"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={updating}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition ${
              updating
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
            } text-white`}
          >
            {updating ? "Updating Product..." : "Update Product"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default EditProduct;