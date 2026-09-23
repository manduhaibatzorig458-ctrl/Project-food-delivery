"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { backend } from "@/app/_api/api";

import Sidebar from "./_components/sidebar.js";
import CategoryChips from "./_features/category-chips.js";
import CategorySection from "./_components/category-section.js";
import AddDishDialog from "./_features/add-dish-dialog.js";
import DishInfoDialog from "./_features/dish-info-dialog.js";

export default function FoodMenuPage() {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);

  const [selectedId, setSelectedId] = useState("all");

  const [categoryName, setCategoryName] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddDishModal, setShowAddDishModal] = useState(false);

  const [dishToEdit, setDishToEdit] = useState(null);
  const [showDishInfoModal, setShowDishInfoModal] = useState(false);

  const [dishToDelete, setDishToDelete] = useState(null);
  const [showDeleteDishModal, setShowDeleteDishModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteDishLoading, setDeleteDishLoading] = useState(false);

  const [error, setError] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [highlightDishId, setHighlightDishId] = useState(null);

  // ==========================================
  // GET CATEGORIES
  // ==========================================

  async function loadCategories() {
    try {
      const response = await backend.get("/food-category/get");

      console.log("GET CATEGORY:", response.data);

      const categoryList =
        response.data.categories ||
        response.data.foodCategories ||
        response.data;

      const newCategories = categoryList.map((item) => ({
        id: item._id,
        label: item.categoryName,
        count: item.count || 0,
      }));

      setCategories(newCategories);
    } catch (error) {
      console.log("GET CATEGORY ERROR:", error);
      console.log("GET CATEGORY ERROR RESPONSE:", error.response?.data);

      setError("Failed to load categories");
    }
  }

  // ==========================================
  // GET DISHES
  // ==========================================

  async function loadDishes() {
    try {
      const response = await backend.get("/food-dish/get");

      console.log("GET DISH:", response.data);

      const dishList =
        response.data.dishes || response.data.foodDishes || response.data;

      const newDishes = dishList.map((item) => ({
        id: item._id,
        categoryId: item.category,
        name: item.foodName,
        price: item.price,
        description: item.ingredients,
        image: item.image,
      }));

      setDishes(newDishes);
    } catch (error) {
      console.log("GET DISH ERROR:", error);
      console.log("GET DISH ERROR RESPONSE:", error.response?.data);

      setError("Failed to load dishes");
    }
  }

  // ==========================================
  // PAGE LOAD
  // ==========================================

  useEffect(() => {
    loadCategories();
    loadDishes();
  }, []);

  // ==========================================
  // TOAST
  // ==========================================

  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => {
      setToastMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toastMessage]);

  // ==========================================
  // HIGHLIGHT
  // ==========================================

  useEffect(() => {
    if (!highlightDishId) return;

    const timer = setTimeout(() => {
      setHighlightDishId(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [highlightDishId]);

  // ==========================================
  // ADD CATEGORY
  // ==========================================

  async function handleAddCategory() {
    const name = categoryName.trim();

    if (!name) {
      setError("Category name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await backend.post("/food-category/create", {
        categoryName: name,
      });

      console.log("CREATE CATEGORY:", response.data);

      const newCategory =
        response.data.category || response.data.foodCategory || response.data;

      const category = {
        id: newCategory._id,
        label: newCategory.categoryName,
        count: 0,
      };

      setCategories([...categories, category]);

      setCategoryName("");
      setShowAddModal(false);
    } catch (error) {
      console.log("CREATE CATEGORY ERROR:", error);

      console.log("CREATE CATEGORY ERROR RESPONSE:", error.response?.data);

      setError("Failed to add category");
    }

    setLoading(false);
  }

  // ==========================================
  // OPEN DELETE CATEGORY
  // ==========================================

  function handleOpenDelete(id) {
    console.log("OPEN DELETE CATEGORY:", id);

    const category = categories.find((item) => item.id === id);

    if (!category) {
      console.log("CATEGORY NOT FOUND:", id);
      return;
    }

    setCategoryToDelete(category);
    setShowDeleteModal(true);
  }

  // ==========================================
  // DELETE CATEGORY
  // ==========================================

  async function handleDeleteCategory() {
    if (!categoryToDelete) {
      console.log("NO CATEGORY TO DELETE");
      return;
    }

    console.log("DELETE CATEGORY ID:", categoryToDelete.id);

    setDeleteLoading(true);
    setError("");

    try {
      const response = await backend.delete("/food-category/delete", {
        data: {
          id: categoryToDelete.id,
        },
      });

      console.log("DELETE CATEGORY RESPONSE:", response.data);

      setCategories(
        categories.filter((category) => category.id !== categoryToDelete.id),
      );

      setDishes(
        dishes.filter((dish) => dish.categoryId !== categoryToDelete.id),
      );

      setSelectedId("all");

      setShowDeleteModal(false);
      setCategoryToDelete(null);

      setToastMessage("Category successfully deleted");
    } catch (error) {
      console.log("DELETE CATEGORY ERROR:", error);

      console.log("DELETE CATEGORY ERROR RESPONSE:", error.response?.data);

      setError("Failed to delete category");
    }

    setDeleteLoading(false);
  }

  // ==========================================
  // OPEN ADD DISH
  // ==========================================

  function handleAddDish(category) {
    console.log("ADD DISH TO:", category);

    setSelectedCategory(category);
    setShowAddDishModal(true);
  }

  // ==========================================
  // DISH ADDED
  // ==========================================

  function handleDishAdded(newDish) {
    console.log("NEW DISH:", newDish);

    const dish = {
      id: newDish._id,
      categoryId: newDish.category || selectedCategory?.id,
      name: newDish.foodName,
      price: newDish.price,
      description: newDish.ingredients,
      image: newDish.image,
    };

    setDishes([...dishes, dish]);

    setToastMessage("New dish is being added to the menu");

    setHighlightDishId(dish.id);

    setShowAddDishModal(false);
    setSelectedCategory(null);
  }

  // ==========================================
  // OPEN EDIT DISH
  // ==========================================

  function handleEditDish(dish) {
    console.log("EDIT DISH:", dish);

    setDishToEdit(dish);
    setShowDishInfoModal(true);
  }

  // ==========================================
  // DISH UPDATED
  // ==========================================

  function handleDishUpdated(updatedDish) {
    console.log("UPDATED DISH:", updatedDish);

    const newDishes = dishes.map((dish) => {
      if (dish.id === updatedDish.id) {
        return updatedDish;
      }

      return dish;
    });

    setDishes(newDishes);

    setToastMessage("Dish updated successfully");

    setHighlightDishId(updatedDish.id);

    setShowDishInfoModal(false);
    setDishToEdit(null);
  }

  // ==========================================
  // OPEN DELETE DISH
  // ==========================================

  function handleRequestDeleteDish(dish) {
    console.log("OPEN DELETE DISH:", dish);

    setShowDishInfoModal(false);
    setDishToEdit(null);

    setDishToDelete(dish);
    setShowDeleteDishModal(true);
  }

  // ==========================================
  // DELETE DISH
  // ==========================================

  async function handleDeleteDish() {
    if (!dishToDelete) {
      console.log("NO DISH TO DELETE");
      return;
    }

    console.log("DELETE DISH ID:", dishToDelete.id);

    setDeleteDishLoading(true);
    setError("");

    try {
      const response = await backend.delete(`/food-dish/${dishToDelete.id}`);

      console.log("DELETE DISH RESPONSE:", response.data);

      setDishes(dishes.filter((dish) => dish.id !== dishToDelete.id));

      setToastMessage("Dish successfully deleted");

      setShowDeleteDishModal(false);
      setDishToDelete(null);
    } catch (error) {
      console.log("DELETE DISH ERROR:", error);

      console.log("DELETE DISH ERROR RESPONSE:", error.response?.data);

      setError("Failed to delete dish");
    }

    setDeleteDishLoading(false);
  }

  // ==========================================
  // CATEGORY COUNT
  // ==========================================

  const categoriesWithCount = useMemo(() => {
    return categories.map((category) => {
      const count = dishes.filter(
        (dish) => dish.categoryId === category.id,
      ).length;

      return {
        ...category,
        count,
      };
    });
  }, [categories, dishes]);

  // ==========================================
  // CATEGORY TO SHOW
  // ==========================================

  let categoriesToShow = categoriesWithCount;

  if (selectedId !== "all") {
    categoriesToShow = categoriesWithCount.filter(
      (category) => category.id === selectedId,
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        {/* TOAST */}

        {toastMessage && (
          <div className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-lg">
            <CheckCircle2 size={20} className="text-green-500" />

            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-4 flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-500">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-semibold"
            >
              ×
            </button>
          </div>
        )}

        {/* CATEGORY CHIPS */}

        <CategoryChips
          categories={categoriesWithCount}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAddCategory={() => setShowAddModal(true)}
          onDeleteCategory={handleOpenDelete}
          deleteLoading={deleteLoading}
        />

        {/* CATEGORY SECTIONS */}

        <div className="mt-6 space-y-6">
          {categoriesToShow.map((category) => {
            const categoryDishes = dishes.filter(
              (dish) => dish.categoryId === category.id,
            );

            return (
              <CategorySection
                key={category.id}
                category={category}
                dishes={categoryDishes}
                onAddDish={handleAddDish}
                onEditDish={handleEditDish}
                highlightDishId={highlightDishId}
              />
            );
          })}
        </div>
      </main>

      {/* ========================================
          ADD CATEGORY
      ======================================== */}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Add Category</h2>

            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setCategoryName("");
                }}
                className="rounded-lg px-4 py-2 text-gray-600"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddCategory}
                disabled={loading}
                className="rounded-lg bg-red-500 px-5 py-2 text-white"
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          DELETE CATEGORY
      ======================================== */}

      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="text-xl font-semibold">Delete Category</h2>

            <p className="mt-3 text-gray-600">
              Are you sure you want to delete <b>{categoryToDelete.label}</b>?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCategoryToDelete(null);
                }}
                className="rounded-lg px-4 py-2 text-gray-600"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteCategory}
                disabled={deleteLoading}
                className="rounded-lg bg-red-500 px-5 py-2 text-white"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          ADD DISH
      ======================================== */}

      {showAddDishModal && selectedCategory && (
        <AddDishDialog
          categoryId={selectedCategory.id}
          categoryLabel={selectedCategory.label}
          onClose={() => {
            setShowAddDishModal(false);
            setSelectedCategory(null);
          }}
          onDishAdded={handleDishAdded}
        />
      )}

      {/* ========================================
          EDIT DISH
      ======================================== */}

      {showDishInfoModal && dishToEdit && (
        <DishInfoDialog
          dish={dishToEdit}
          categories={categories}
          onClose={() => {
            setShowDishInfoModal(false);
            setDishToEdit(null);
          }}
          onUpdated={handleDishUpdated}
          onDeleteRequest={handleRequestDeleteDish}
        />
      )}

      {/* ========================================
          DELETE DISH
      ======================================== */}

      {showDeleteDishModal && dishToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="text-xl font-semibold">Delete Dish</h2>

            <p className="mt-3 text-gray-600">
              Are you sure you want to delete <b>{dishToDelete.name}</b>?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteDishModal(false);
                  setDishToDelete(null);
                }}
                className="rounded-lg px-4 py-2 text-gray-600"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteDish}
                disabled={deleteDishLoading}
                className="rounded-lg bg-red-500 px-5 py-2 text-white"
              >
                {deleteDishLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
