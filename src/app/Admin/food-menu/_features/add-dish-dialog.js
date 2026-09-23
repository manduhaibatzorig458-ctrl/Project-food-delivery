"use client";

import { useRef, useState } from "react";
import { X, ImageIcon } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:1000";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function AddDishDialog(props) {
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [ingredients, setIngredients] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // Choose image
  const pickFile = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }

    setImage(file);

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setError("");
  };

  // Upload image to Cloudinary
  const uploadImage = () => {
    if (!image) {
      return Promise.resolve("");
    }

    const formData = new FormData();

    formData.append("file", image);
    formData.append("upload_preset", UPLOAD_PRESET);

    return axios
      .post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
      )
      .then((response) => {
        return response.data.secure_url;
      });
  };

  // Add dish
  const handleAddDish = () => {
    if (foodName.trim() === "") {
      setError("Food name is required");
      return;
    }

    if (foodPrice.trim() === "") {
      setError("Food price is required");
      return;
    }

    setLoading(true);
    setError("");

    uploadImage()
      .then((imageUrl) => {
        const dishData = {
          dishName: foodName,
          price: foodPrice,
          ingredients: ingredients,
          categoryId: props.categoryId,
          image: imageUrl,
        };

        return axios.post(`${API_URL}/food-dish/create`, dishData);
      })

      .then((response) => {
        console.log("Dish created:", response.data);

        props.onDishAdded?.(response.data.foodDish || response.data);

        props.onClose?.();
      })

      .catch((error) => {
        console.log("Error:", error);

        setError(error.response?.data?.message || "Something went wrong");
      })

      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Add new Dish to {props.categoryLabel}
          </h2>

          <button
            onClick={props.onClose}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
          >
            <X size={16} />
          </button>
        </div>

        {/* Name and price */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Food name
            </label>

            <input
              type="text"
              value={foodName}
              onChange={(event) => {
                setFoodName(event.target.value);
                setError("");
              }}
              placeholder="Type food name"
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Food price
            </label>

            <input
              type="text"
              value={foodPrice}
              onChange={(event) => {
                setFoodPrice(event.target.value);
                setError("");
              }}
              placeholder="Enter price..."
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none"
            />
          </div>
        </div>

        {/* Ingredients */}
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Ingredients
          </label>

          <textarea
            value={ingredients}
            onChange={(event) => {
              setIngredients(event.target.value);
            }}
            placeholder="List ingredients..."
            disabled={loading}
            rows={3}
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-2.5 outline-none"
          />
        </div>

        {/* Image */}
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Food image
          </label>

          <div
            onClick={() => fileInputRef.current.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-[#F5F5FC] px-4 py-12"
          >
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

            <p className="text-sm text-gray-700">
              {image ? image.name : "Choose a file"}
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={pickFile}
            />
          </div>
        </div>

        {/* Error */}
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        {/* Add button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAddDish}
            disabled={loading}
            className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Add Dish"}
          </button>
        </div>
      </div>
    </div>
  );
}
