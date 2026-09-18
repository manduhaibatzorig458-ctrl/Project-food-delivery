"use client";

import { useState, useEffect } from "react";
import { backend } from "@/app/_api/api";

import Sidebar from "./_components/sidebar";
import CategoryChips from "./_features/category-chips";
import CategorySection from "./_components/category-section";

export default function FoodMenuPage() {
 
  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState("all");
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await backend.get("/food-category/get");

      console.log("GET CATEGORIES:", res.data);

      // Сервэр өгөгдлийг array эсвэл { categories: [...] } гэж буцааж болно, аль альд нь ажиллуулна
      const list = res.data.categories || res.data.foodCategories || res.data;

      const formatted = list.map((item) => ({
        id: item._id,
        label: item.categoryName,
        count: item.count || 0,
      }));

      setCategories(formatted);
    } catch (err) {
      console.error("GET CATEGORY ERROR:", err);
      setError("Failed to load categories");
    }
  }

// create category
  async function handleAddCategory() {
    const name = categoryName.trim();

    if (!name) {
      setError("Category name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await backend.post("/food-category/create", {
        categoryName: name,
      });

      console.log("CREATE CATEGORY:", res.data);

      const newCategory = res.data.category || res.data.foodCategory;

      setCategories((prev) => [
        ...prev,
        {
          id: newCategory._id,
          label: newCategory.categoryName,
          count: 0,
        },
      ]);

      setCategoryName("");
      setShowAddModal(false);
    } catch (err) {
      console.error("CREATE CATEGORY ERROR:", err);
      setError("Failed to add category");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenDelete(id) {
    const category = categories.find((c) => c.id === id);

    if (!category) {
      console.error("Category not found:", id);
      return;
    }

    setCategoryToDelete(category);
    setShowDeleteModal(true);
  }

// delete category
  async function handleDeleteCategory() {
    if (!categoryToDelete) return;

    const id = categoryToDelete.id;
    setDeleteLoading(true);

    console.log("DELETE CATEGORY ID:", id);

    try {
      const res = await backend.delete("/food-category/delete", {
        data: { id },
      });

      console.log("DELETE DATA:", res.data);

      setCategories((prev) => prev.filter((c) => c.id !== id));

      setSelectedId("all");
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error("DELETE CATEGORY ERROR:", err);
      alert("Failed to delete category");
    } finally {
      setDeleteLoading(false);
    }
  }

  const categoriesToShow =
    selectedId === "all"
      ? categories
      : categories.filter((c) => c.id === selectedId);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 space-y-6 bg-gray-100 p-8">
        <CategoryChips
          categories={categories}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAddCategory={() => setShowAddModal(true)}
          onDeleteCategory={handleOpenDelete}
          deleteLoading={deleteLoading}
        />

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {categoriesToShow.map((category) => (
          <CategorySection key={category.id} title={category.label} />
        ))}

        {/* ADD CATEGORY MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold">Add category</h2>
                <button
                  onClick={() => setShowAddModal(false)}
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
                  onChange={(e) => setCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddCategory();
                  }}
                  disabled={loading}
                  autoFocus
                  className="w-full rounded-2xl border-2 border-neutral-300 px-5 py-4 text-xl outline-none focus:border-[#E8503A]"
                />

                {error && <p className="mt-3 text-red-500">{error}</p>}
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
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
                  {loading ? "Adding..." : "Add category"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CATEGORY MODAL */}
        {showDeleteModal && categoryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold">Delete category</h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
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
                  onClick={() => setShowDeleteModal(false)}
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
                  {deleteLoading ? "Deleting..." : "Delete category"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}