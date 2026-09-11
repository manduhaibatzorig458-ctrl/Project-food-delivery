"use client";

import { useEffect, useState } from "react";
import Sidebar from "./_components/sidebar";
import CategoryChips from "./_features/category-chips";
import CategorySection from "./_components/category-section";
import AddDishDialog from "./_features/add-dish-dialog"

const API_URL = "http://localhost:1000";

export default function FoodMenuPage() {
  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState("all");

  const [categoryName, setCategoryName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // dish states
  const [dishes, setDishes] = useState([]);
  const [dishesLoading, setDishesLoading] = useState(false);

  // GET CATEGORIES
  useEffect(() => {
    async function getCategories() {
      try {
        const response = await fetch(`${API_URL}/food-category/get`);
        const data = await response.json();

        console.log("GET CATEGORIES:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to get categories");
        }
        const list = data.foodCategories || data;

        setCategories(
          list.map((item) => ({
            id: item._id,
            label: item.categoryName,
            count: item.count || 0,
          }))
        );
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    }

    getCategories();
  }, []);

  // ADD CATEGORY
  async function handleAddCategory() {
    const name = categoryName.trim();

    if (!name) {
      setError("Category name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/food-category/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryName: name,
        }),
      });

      const data = await response.json();
      console.log("CREATE CATEGORY:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create category");
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
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // OPEN DELETE MODAL
  function handleOpenDelete(id) {
    const category = categories.find((item) => item.id === id);

    if (!category) return;

    setCategoryToDelete(category);
    setShowDeleteModal(true);
  }
  // add dish dialog


  // DELETE CATEGORY
  async function handleDeleteCategory() {
    if (!categoryToDelete) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/food-category/delete/${categoryToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      console.log("DELETE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete category");
      }

      setCategories((prev) =>
        prev.filter((item) => item.id !== categoryToDelete.id)
      );

      setSelectedId("all");
      setCategoryToDelete(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 bg-[#F5F5F4]">
        <CategoryChips
          categories={categories}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAddCategory={() => {
            setCategoryName("");
            setError("");
            setShowAddModal(true);
          }}
          onDeleteCategory={handleOpenDelete}
        />

        {error && (
          <p className="mt-4 text-red-500">
            {error}
          </p>
        )}

        {categories
          .filter(
            (category) =>
              selectedId === "all" || category.id === selectedId
          )
          .map((category) => (
            <CategorySection
              key={category.id}
              title={category.label}
              dishes={[]}
            />
          ))}

        {/* ADD CATEGORY */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6">
              <h2 className="text-2xl font-semibold">
                Add category
              </h2>

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
                placeholder="Category name"
                className="mt-6 w-full rounded-xl border px-4 py-3 outline-none focus:border-[#E8503A]"
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setCategoryName("");
                    setError("");
                  }}
                  className="rounded-xl border px-5 py-2"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddCategory}
                  disabled={loading}
                  className="rounded-xl bg-[#E8503A] px-5 py-2 text-white"
                >
                  {loading ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CATEGORY */}
        {showDeleteModal && categoryToDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6">
              <h2 className="text-2xl font-semibold">
                Delete category
              </h2>

              <p className="mt-5 text-neutral-700">
                Delete{" "}
                <b>{categoryToDelete.label}</b>?
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCategoryToDelete(null);
                  }}
                  disabled={loading}
                  className="rounded-xl border px-5 py-2"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteCategory}
                  disabled={loading}
                  className="rounded-xl bg-[#E8503A] px-5 py-2 text-white"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}






 
 