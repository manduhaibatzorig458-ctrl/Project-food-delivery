"use client";

import { useRef, useState } from "react";
import { X, ImageIcon } from "lucide-react";

const API_URL = "http://localhost:1000";

// Cloudinary
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function AddDishDialog({
  categoryId,
  categoryLabel,
  onClose,
  onDishAdded,
}) {
  // Food information
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [ingredients, setIngredients] = useState("");

  // Image
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // File input
  const fileInputRef = useRef(null);

  // =========================
  // IMAGE SELECT
  // =========================
  const handleImageChange = (file) => {
    if (!file) return;

    // Зураг мөн эсэх
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }

    // Зургийг хадгална
    setImage(file);

    // Preview харуулна
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);

    setError("");
  };

  // =========================
  // UPLOAD IMAGE TO CLOUDINARY
  // =========================
  const uploadImage = async () => {
    if (!image) {
      return "";
    }

    const formData = new FormData();

    formData.append("file", image);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    console.log("CLOUDINARY:", data);

    if (!response.ok) {
      throw new Error(data.error?.message || "Image upload failed");
    }

    // Cloudinary-аас image URL авна
    console.log("IMAGE URL:", data.secure_url);

    return data.secure_url;
  };

  // =========================
  // ADD DISH
  // =========================
  const handleAddDish = async () => {
    // Food name шалгах
    if (foodName.trim() === "") {
      setError("Food name is required");
      return;
    }

    // Food price шалгах
    if (foodPrice.trim() === "") {
      setError("Food price is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // =========================
      // 1. IMAGE UPLOAD
      // =========================

      let imageUrl = "";

      if (image) {
        imageUrl = await uploadImage();
      }

      // =========================
      // 2. SEND DISH TO BACKEND
      // =========================

      const dishData = {
        dishName: foodName,
        price: foodPrice,
        ingredients: ingredients,
        categoryId: categoryId,
        image: imageUrl,
      };

      console.log("DISH DATA:", dishData);

      const response = await fetch(`${API_URL}/food-dish/create`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(dishData),
      });

      const data = await response.json();

      console.log("CREATE DISH:", data);

      // Backend error
      if (!response.ok) {
        setError(data.message || "Failed to add dish");

        return;
      }

      // Dish нэмэгдсэн
      onDishAdded?.(data.foodDish || data);

      // Dialog хаана
      onClose?.();
    } catch (error) {
      console.log("ERROR:", error);

      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Add new Dish to {categoryLabel}</h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* FOOD NAME + PRICE */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {/* FOOD NAME */}
          <div>
            <label className="mb-2 block text-sm">Food name</label>

            <input
              type="text"
              value={foodName}
              onChange={(e) => {
                setFoodName(e.target.value);
                setError("");
              }}
              placeholder="Type food name"
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5"
            />
          </div>

          {/* FOOD PRICE */}
          <div>
            <label className="mb-2 block text-sm">Food price</label>

            <input
              type="text"
              value={foodPrice}
              onChange={(e) => {
                setFoodPrice(e.target.value);
                setError("");
              }}
              placeholder="Enter price..."
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5"
            />
          </div>
        </div>

        {/* INGREDIENTS */}
        <div className="mt-4">
          <label className="mb-2 block text-sm">Ingredients</label>

          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="List ingredients..."
            disabled={loading}
            rows={3}
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-2.5"
          />
        </div>

        {/* IMAGE */}
        <div className="mt-4">
          <label className="mb-2 block text-sm">Food image</label>

          <div
            onClick={() => fileInputRef.current.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-[#F5F5FC] px-4 py-12"
          >
            {/* IMAGE PREVIEW */}
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Food preview"
                className="h-32 w-32 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                <ImageIcon size={18} />
              </div>
            )}

            {/* FILE NAME */}
            <p className="text-sm">{image ? image.name : "Choose a file"}</p>

            {/* FILE INPUT */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files[0])}
            />
          </div>
        </div>

        {/* ERROR */}
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        {/* ADD BUTTON */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAddDish}
            disabled={loading}
            className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm text-white disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Add Dish"}
          </button>
        </div>
      </div>
    </div>
  );
}
