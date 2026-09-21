"use client";

import { useState, useEffect } from "react";
import { backend } from "@/app/_api/api";

import Sidebar from "./_components/sidebar.js";
import CategoryChips from "./_features/category-chips.js";
import CategorySection from "./_components/category-section.js";
import AddDishDialog from "./_features/add-dish-dialog.js";

export default function FoodMenuPage() {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);

  const [selectedId, setSelectedId] = useState("all");

  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showAddDishModal, setShowAddDishModal] =
    useState(false);

  const [categoryToDelete, setCategoryToDelete] =
    useState(null);

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] =
    useState(false);

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    loadCategories();
    loadDishes();
  }, []);

  // =========================
  // GET CATEGORIES
  // =========================

  async function loadCategories() {
    try {
      const res = await backend.get(
        "/food-category/get"
      );

      console.log("GET CATEGORIES:", res.data);

      const list =
        res.data.categories ||
        res.data.foodCategories ||
        res.data;

      const formatted = list.map((item) => ({
        id: item._id,
        label: item.categoryName,
        count: item.count || 0,
      }));

      setCategories(formatted);
    } catch (err) {
      console.error(
        "GET CATEGORY ERROR:",
        err
      );

      setError("Failed to load categories");
    }
  }

  // =========================
  // GET DISHES
  // =========================

  async function loadDishes() {
    try {
      const res = await backend.get("/food/get");

      console.log("GET DISHES:", res.data);

      const list =
        res.data.dishes ||
        res.data.foods ||
        res.data;

      const formatted = list.map((item) => ({
        id: item._id,
        categoryId: item.categoryId,
        name: item.foodName,
        price: item.foodPrice,
        description: item.ingredients,
        image: item.image,
      }));

      setDishes(formatted);
    } catch (err) {
      console.error(
        "GET DISHES ERROR:",
        err
      );
    }
  }

  // =========================
  // ADD CATEGORY
  // =========================

  async function handleAddCategory() {
    const name = categoryName.trim();

    if (!name) {
      setError("Category name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await backend.post(
        "/food-category/create",
        {
          categoryName: name,
        }
      );

      console.log(
        "CREATE CATEGORY:",
        res.data
      );

      const newCategory =
        res.data.category ||
        res.data.foodCategory;

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
      console.error(
        "CREATE CATEGORY ERROR:",
        err
      );

      setError("Failed to add category");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // OPEN DELETE CATEGORY
  // =========================

  function handleOpenDelete(id) {
    const category = categories.find(
      (c) => c.id === id
    );

    if (!category) {
      console.error(
        "Category not found:",
        id
      );
      return;
    }

    setCategoryToDelete(category);
    setShowDeleteModal(true);
  }

  // =========================
  // DELETE CATEGORY
  // =========================

  async function handleDeleteCategory() {
    if (!categoryToDelete) return;

    const id = categoryToDelete.id;

    setDeleteLoading(true);

    console.log(
      "DELETE CATEGORY ID:",
      id
    );

    try {
      const res = await backend.delete(
        "/food-category/delete",
        {
          data: { id },
        }
      );

      console.log(
        "DELETE DATA:",
        res.data
      );

      setCategories((prev) =>
        prev.filter(
          (category) =>
            category.id !== id
        )
      );

      setDishes((prev) =>
        prev.filter(
          (dish) =>
            dish.categoryId !== id
        )
      );

      setSelectedId("all");
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error(
        "DELETE CATEGORY ERROR:",
        err
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  // =========================
  // ADD DISH
  // =========================

  function handleAddDish(category) {
    console.log(
      "ADD DISH TO:",
      category
    );

    setSelectedCategory(category);
    setShowAddDishModal(true);
  }

  // =========================
  // DISH CREATED
  // =========================

  function handleDishAdded(newDish) {
    console.log(
      "NEW DISH:",
      newDish
    );

    const formattedDish = {
      id: newDish._id,
      categoryId:
        newDish.categoryId ||
        selectedCategory?.id,
      name: newDish.foodName,
      price: newDish.foodPrice,
      description:
        newDish.ingredients,
      image: newDish.image,
    };

    setDishes((prev) => [
      ...prev,
      formattedDish,
    ]);

    setShowAddDishModal(false);
    setSelectedCategory(null);
  }

  // =========================
  // EDIT DISH
  // =========================

  function handleEditDish(dish) {
    console.log(
      "EDIT DISH:",
      dish
    );
  }

  // =========================
  // FILTER CATEGORY
  // =========================

  const categoriesToShow =
    selectedId === "all"
      ? categories
      : categories.filter(
          (category) =>
            category.id === selectedId
        );

  // =========================
  // UI
  // =========================

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 space-y-6 bg-gray-100 p-8">
        {/* CATEGORY CHIPS */}

        <CategoryChips
          categories={categories}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAddCategory={() =>
            setShowAddModal(true)
          }
          onDeleteCategory={
            handleOpenDelete
          }
          deleteLoading={
            deleteLoading
          }
        />

        {/* ERROR */}

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* CATEGORY SECTIONS */}

        {categoriesToShow.map(
          (category) => {
            const categoryDishes =
              dishes.filter(
                (dish) =>
                  dish.categoryId ===
                  category.id
              );

            return (
              <CategorySection
                key={category.id}
                category={category}
                dishes={categoryDishes}
                onAddDish={
                  handleAddDish
                }
                onEditDish={
                  handleEditDish
                }
              />
            );
          }
        )}

        {/* ADD CATEGORY MODAL */}

        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold">
                  Add category
                </h2>

                <button
                  onClick={() =>
                    setShowAddModal(
                      false
                    )
                  }
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
                  onChange={(e) =>
                    setCategoryName(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter"
                    ) {
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
                  onClick={() =>
                    setShowAddModal(
                      false
                    )
                  }
                  disabled={loading}
                  className="rounded-2xl border border-neutral-300 px-6 py-3 hover:bg-neutral-100"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    handleAddCategory
                  }
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
                    onClick={() =>
                      setShowDeleteModal(
                        false
                      )
                    }
                    className="text-3xl text-neutral-500"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-8">
                  <p className="text-xl text-neutral-700">
                    Are you sure you want
                    to delete{" "}
                    <span className="font-semibold text-black">
                      `{categoryToDelete.label}`
                    </span>{" "}
                    category?
                  </p>

                  <p className="mt-3 text-neutral-500">
                    This action cannot be
                    undone.
                  </p>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={() =>
                      setShowDeleteModal(
                        false
                      )
                    }
                    disabled={
                      deleteLoading
                    }
                    className="rounded-2xl border border-neutral-300 px-6 py-3 hover:bg-neutral-100"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={
                      handleDeleteCategory
                    }
                    disabled={
                      deleteLoading
                    }
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

        {/* ADD DISH MODAL */}

        {showAddDishModal &&
          selectedCategory && (
            <AddDishDialog
              categoryId={
                selectedCategory.id
              }
              categoryLabel={
                selectedCategory.label
              }
              onClose={() => {
                setShowAddDishModal(
                  false
                );
                setSelectedCategory(
                  null
                );
              }}
              onDishAdded={
                handleDishAdded
              }
            />
          )}
      </main>
    </div>
  );
}