"use client";

import { useEffect, useState } from "react";
import Sidebar from "./_components/sidebar";
import CategoryChips from "./_features/category-chips";

const API_URL = "http://localhost:1000";

export default function FoodMenuPage() {
  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState("all");

  const [categoryName, setCategoryName] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [error, setError] = useState("");

//  Get categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        setError("");

        const response = await fetch(
          `${API_URL}/food-category/get`
        );

        const data = await response.json();

        console.log("GET CATEGORIES:", data);

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to get categories"
          );
        }

        const list = data.foodCategories || data;

        setCategories(
          list.map((category) => ({
            id: category._id,
            label: category.categoryName,
            count: category.count || 0,
          }))
        );
      } catch (error) {
        console.error("GET CATEGORY ERROR:", error);
        setError(error.message);
      }
    };

    getCategories();
  }, []);

// Create category
  const handleAddCategory = async () => {
    const name = categoryName.trim();

    if (!name) {
      setError("Category name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/food-category/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryName: name,
          }),
        }
      );

      const data = await response.json();

      console.log("CREATE CATEGORY:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create category"
        );
      }

      const category = data.foodCategory;

      setCategories((prev) => [
        ...prev,
        {
          id: category._id,
          label: category.categoryName,
          count: 0,
        },
      ]);

      setCategoryName("");
      setShowAddModal(false);
      setError("");
    } catch (error) {
      console.error("CREATE CATEGORY ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Open delete modal
  const handleOpenDelete = (id) => {
    const category = categories.find(
      (category) => category.id === id
    );

    if (!category) return;

    setCategoryToDelete(category);
    setShowDeleteModal(true);
    setError("");
  };

// Delete category
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    const id = categoryToDelete.id;

    try {
      setDeleteLoading(true);
      setError("");

      console.log("DELETE CATEGORY ID:", id);

      const response = await fetch(
        `${API_URL}/food-category/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      console.log("DELETE STATUS:", response.status);
      console.log("DELETE RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete category"
        );
      }

      // Remove from frontend
      setCategories((prev) =>
        prev.filter((category) => category.id !== id)
      );

      // Back to All
      setSelectedId("all");

      // Close modal
      setCategoryToDelete(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("DELETE CATEGORY ERROR:", error);

      alert(
        error.message || "Failed to delete category"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

//  Close add model
  const closeAddModal = () => {
    if (loading) return;

    setShowAddModal(false);
    setCategoryName("");
    setError("");
  };

  // Close delete model
  const closeDeleteModal = () => {
    if (deleteLoading) return;

    setShowDeleteModal(false);
    setCategoryToDelete(null);
    setError("");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8">
        <CategoryChips
          categories={categories}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAddCategory={() => {
            setShowAddModal(true);
            setError("");
          }}
          onDeleteCategory={handleOpenDelete}
          deleteLoading={deleteLoading}
        />

        {/* ADD CATEGORY MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold">
                  Add category
                </h2>

                <button
                  onClick={closeAddModal}
                  disabled={loading}
                  className="text-3xl text-neutral-500"
                >
                  ×
                </button>
              </div>

              <div className="mt-8">
                <label className="mb-3 block text-xl font-medium">
                  Category name
                </label>

                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddCategory();
                    }
                  }}
                  disabled={loading}
                  autoFocus
                  className="w-full rounded-2xl border-2 border-neutral-300 px-5 py-4 text-xl outline-none focus:border-[#E8503A]"
                />

                {error && (
                  <p className="mt-3 text-red-500">
                    {error}
                  </p>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={closeAddModal}
                  disabled={loading}
                  className="rounded-2xl border border-neutral-300 px-6 py-3 hover:bg-neutral-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddCategory}
                  disabled={loading}
                  className="rounded-2xl bg-[#E8503A] px-6 py-3 text-white hover:bg-[#d94330]"
                >
                  {loading
                    ? "Adding..."
                    : "Add category"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CATEGORY MODAL */}
        {showDeleteModal &&
          categoryToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-semibold">
                    Delete category
                  </h2>

                  <button
                    onClick={closeDeleteModal}
                    disabled={deleteLoading}
                    className="text-3xl text-neutral-500"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-8">
                  <p className="text-xl text-neutral-700">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-black">
                      `{categoryToDelete.label}`
                    </span>{" "}
                    category?
                  </p>

                  <p className="mt-3 text-neutral-500">
                    This action cannot be undone.
                  </p>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={closeDeleteModal}
                    disabled={deleteLoading}
                    className="rounded-2xl border border-neutral-300 px-6 py-3 hover:bg-neutral-100"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleDeleteCategory}
                    disabled={deleteLoading}
                    className="rounded-2xl bg-[#E8503A] px-6 py-3 text-white hover:bg-[#d94330]"
                  >
                    {deleteLoading
                      ? "Deleting..."
                      : "Delete category"}
                  </button>
                </div>
              </div>
            </div>
          )}
      </main>
    </div>
  );
}