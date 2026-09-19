
"use client";

import { useState } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { backend } from "@/app/_api/api";

export default function AddDishDialog({
  categoryId,
  categoryLabel,
  onClose,
  onDishAdded,
}) {
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [ingredients, setIngredients] = useState("");

  // Image
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    // File type check
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");

    setImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!foodName.trim()) {
      setError("Food name is required");
      return;
    }

    if (!foodPrice) {
      setError("Food price is required");
      return;
    }

    if (!ingredients.trim()) {
      setError("Ingredients are required");
      return;
    }

    if (!categoryId) {
      setError("Category is missing");
      return;
    }

    if (!image) {
      setError("Food image is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * Одоохондоо backend-ийн /food/create endpoint
       * JSON хүлээж байгаа гэж үзэж байна.
       *
       * File upload backend-ийг FormData болгож тохируулсны дараа
       * энд image-г FormData руу оруулна.
       */

      const formData = new FormData();

      formData.append("foodName", foodName.trim());
      formData.append("foodPrice", String(Number(foodPrice)));
      formData.append("ingredients", ingredients.trim());
      formData.append("categoryId", categoryId);
      formData.append("image", image);

      const res = await backend.post("/food/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("CREATE DISH:", res.data);

      const newDish =
        res.data.dish ||
        res.data.food ||
        res.data;

      onDishAdded?.(newDish);

      onClose?.();
    } catch (err) {
      console.error("CREATE DISH ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to add dish"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Add new dish
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Category:{" "}
              <span className="font-medium text-[#E8503A]">
                {categoryLabel}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >

          {/* Food name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Food name
            </label>

            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g. Cheese Pizza"
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#E8503A]"
            />
          </div>

          {/* Price */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Price
            </label>

            <input
              type="number"
              min="0"
              value={foodPrice}
              onChange={(e) => setFoodPrice(e.target.value)}
              placeholder="e.g. 12"
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#E8503A]"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Ingredients
            </label>

            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g. Cheese, tomato sauce, chicken..."
              rows={4}
              disabled={loading}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#E8503A]"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Food image
            </label>

            <div className="flex items-center gap-4">

              {/* Image Preview */}
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Food preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <ImageIcon size={32} strokeWidth={1.5} />
                  </div>
                )}

              </div>

              {/* Upload */}
              <div>
                <label
                  htmlFor="food-image"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-[#E8503A] hover:text-[#E8503A]"
                >
                  <Upload size={18} />

                  Upload image
                </label>

                <input
                  id="food-image"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={loading}
                />

                <p className="mt-2 text-xs text-gray-400">
                  JPG, JPEG or PNG · Max 5MB
                </p>

                {image && (
                  <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                    {image.name}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#E8503A] px-6 py-3 font-medium text-white transition hover:bg-[#d94330] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add dish"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
