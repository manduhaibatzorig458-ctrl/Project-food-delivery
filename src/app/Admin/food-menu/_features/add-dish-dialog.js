"use client";

import { useRef, useState } from "react";
import { X, ImageIcon } from "lucide-react";

const API_URL = "http://localhost:1000";

const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function AddDishDialog({
  categoryId,
  categoryLabel,
  onClose,
  onDishAdded,
}) {
  // Food мэдээлэл
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [ingredients, setIngredients] = useState("");

  // Зураг
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Loading болон error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // File input
  const fileInputRef = useRef(null);

  // =================================
  // ЗУРАГ СОНГОХ
  // =================================
  const pickFile = (event) => {
    const image = event.target.files[0];

    if (!image) return;

    // Console дээр зураг харуулах
    console.log("Selected image:", image);

    // Зураг мөн эсэхийг шалгах
    if (!image.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }

    // Зургийг хадгалах
    setImage(image);

    // Preview хийх
    const preview = URL.createObjectURL(image);

    setImagePreview(preview);

    setError("");
  };

  // =================================
  // CLOUDINARY РУУ ЗУРАГ UPLOAD
  // =================================
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
      }
    );

    const data = await response.json();

    console.log("Cloudinary response:", data);

    if (!response.ok) {
      throw new Error(
        data.error?.message || "Image upload failed"
      );
    }

    // Cloudinary image URL
    console.log("Image URL:", data.secure_url);

    return data.secure_url;
  };

  // =================================
  // DISH НЭМЭХ
  // =================================
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

      // -----------------------------
      // 1. ЗУРГИЙГ CLOUDINARY РУУ UPLOAD
      // -----------------------------

      let imageUrl = "";

      if (image) {
        imageUrl = await uploadImage();
      }

      // -----------------------------
      // 2. DISH DATA
      // -----------------------------

      const dishData = {
        dishName: foodName,
        price: foodPrice,
        ingredients: ingredients,
        categoryId: categoryId,
        image: imageUrl,
      };

      console.log("Dish data:", dishData);

      // -----------------------------
      // 3. BACKEND РҮҮ ИЛГЭЭХ
      // -----------------------------

      const response = await fetch(
        `${API_URL}/food-dish/create`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(dishData),
        }
      );

      const data = await response.json();

      console.log("CREATE DISH:", data);

      // Backend error
      if (!response.ok) {
        setError(
          data.message || "Failed to add dish"
        );

        return;
      }

      // Dish нэмэгдсэн
      onDishAdded?.(
        data.foodDish || data
      );

      // Dialog хаах
      onClose?.();

    } catch (error) {
      console.log("ERROR:", error);

      setError(
        error.message || "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-lg rounded-2xl bg-white p-6">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex items-center justify-between">

          <h2 className="text-lg font-bold text-gray-900">
            Add new Dish to {categoryLabel}
          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
          >
            <X size={16} />
          </button>

        </div>


        {/* =========================
            FOOD NAME + PRICE
        ========================= */}

        <div className="mt-6 grid grid-cols-2 gap-4">

          {/* Food name */}

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


          {/* Food price */}

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


        {/* =========================
            INGREDIENTS
        ========================= */}

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


        {/* =========================
            FOOD IMAGE
        ========================= */}

        <div className="mt-4">

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Food image
          </label>

          <div
            onClick={() => {
              fileInputRef.current.click();
            }}
            className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-[#F5F5FC] px-4 py-12"
          >

            {/* Зураг сонгосон бол preview */}

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


            {/* File name */}

            <p className="text-sm text-gray-700">
              {image
                ? image.name
                : "Choose a file"}
            </p>


            {/* File input */}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={pickFile}
            />

          </div>

        </div>


        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <p className="mt-3 text-sm text-red-500">
            {error}
          </p>
        )}


        {/* =========================
            ADD BUTTON
        ========================= */}

        <div className="mt-6 flex justify-end">

          <button
            onClick={handleAddDish}
            disabled={loading}
            className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading
              ? "Uploading..."
              : "Add Dish"}
          </button>

        </div>

      </div>

    </div>
  );
}



// const pickFile = (event) => {
//   const image = event.target.file[0]
//   setPreview(URL.createObjectURL(image)) 
// }