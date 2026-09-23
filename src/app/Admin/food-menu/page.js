"use client";

import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
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
  const [showAddDishModal, setShowAddDishModal] = useState(false);

  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);
  const [highlightDishId, setHighlightDishId] = useState(null);

  // Хуудас нээгдэх үед categories болон dishes-ийг backend-ээс татна
  useEffect(() => {
    loadCategories();
    loadDishes();
  }, []);

  // Toast мессежийг 3 секундийн дараа автоматаар устгана
  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Highlight-ийг 3 секундийн дараа автоматаар устгана
  useEffect(() => {
    if (!highlightDishId) return;

    const timer = setTimeout(() => {
      setHighlightDishId(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [highlightDishId]);

  // --- BACKEND-ЭЭС МЭДЭЭЛЭЛ АВАХ ФУНКЦУУД ---
  // Категорийн жагсаалтыг backend-ээс авах
  async function loadCategories() {
    try {
      const response = await backend.get("/food-category/get");
      console.log("GET CATEGORIES:", response.data);

      // Backend ямар нэртэй буцаасан ч барьж авна
      const categoryList =
        response.data.categories ||
        response.data.foodCategories ||
        response.data;

      // Backend-ийн өгөгдлийг frontend-д хэрэгтэй хэлбэрт хөрвүүлнэ
      const newCategories = categoryList.map((item) => {
        return {
          id: item._id,
          label: item.categoryName,
          count: item.count || 0,
        };
      });

      setCategories(newCategories);
    } catch (error) {
      console.error("GET CATEGORY ERROR:", error);
      setError("Failed to load categories");
    }
  }

  // Хоолны жагсаалтыг backend-ээс авах
  async function loadDishes() {
    try {
      const response = await backend.get("/food-dish/get");
      console.log("GET DISHES:", response.data);

      // Backend "foodDishes" гэдэг нэрээр буцаадаг
      const dishList =
        response.data.dishes || response.data.foodDishes || response.data;

      // Backend-ийн field-ийн нэрс frontend-ийн field-ийн нэртэй адилгүй
      // тул энд хөрвүүлж байна:
      //   backend "category"  -> frontend "categoryId"
      //   backend "price"     -> frontend "price"
      const newDishes = dishList.map((item) => {
        return {
          id: item._id,
          categoryId: item.category,
          name: item.foodName,
          price: item.price,
          description: item.ingredients,
          image: item.image,
        };
      });

      setDishes(newDishes);
    } catch (error) {
      console.error("GET DISHES ERROR:", error);
    }
  }
  // --- КАТЕГОРИ НЭМЭХ ---
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

      const newCategory = response.data.category || response.data.foodCategory;

      const categoryToAdd = {
        id: newCategory._id,
        label: newCategory.categoryName,
        count: 0,
      };

      setCategories((prevCategories) => [...prevCategories, categoryToAdd]);

      setCategoryName("");
      setShowAddModal(false);
    } catch (error) {
      console.error("CREATE CATEGORY ERROR:", error);
      setError("Failed to add category");
    } finally {
      setLoading(false);
    }
  }

  // --- КАТЕГОРИ УСТГАХ ---
  function handleOpenDelete(id) {
    const category = categories.find((c) => c.id === id);

    if (!category) {
      console.error("Category not found:", id);
      return;
    }

    setCategoryToDelete(category);
    setShowDeleteModal(true);
  }

  async function handleDeleteCategory() {
    if (!categoryToDelete) return;

    const idToDelete = categoryToDelete.id;

    setDeleteLoading(true);
    console.log("DELETE CATEGORY ID:", idToDelete);

    try {
      const response = await backend.delete("/food-category/delete", {
        data: { id: idToDelete },
      });

      console.log("DELETE DATA:", response.data);

      // Устгасан категорийг жагсаалтаас хасна
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== idToDelete),
      );

      // Тухайн категорийн бүх хоолыг бас хасна
      setDishes((prevDishes) =>
        prevDishes.filter((dish) => dish.categoryId !== idToDelete),
      );

      setSelectedId("all");
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("DELETE CATEGORY ERROR:", error);
    } finally {
      setDeleteLoading(false);
    }
  }

  // --- ХООЛ НЭМЭХ ---
  function handleAddDish(category) {
    console.log("ADD DISH TO:", category);

    setSelectedCategory(category);
    setShowAddDishModal(true);
  }

  // AddDishDialog амжилттай хоол нэмсний дараа энэ функцийг дуудна
  function handleDishAdded(newDish) {
    console.log("NEW DISH:", newDish);

    const dishToAdd = {
      id: newDish._id,
      categoryId: newDish.category || selectedCategory?.id,
      name: newDish.foodName,
      price: newDish.price,
      description: newDish.ingredients,
      image: newDish.image,
    };

    setDishes((prevDishes) => [...prevDishes, dishToAdd]);

    setToastMessage("New dish is being added to the menu");
    setHighlightDishId(dishToAdd.id);

    setShowAddDishModal(false);
    setSelectedCategory(null);
  }

  function handleEditDish(dish) {
    console.log("EDIT DISH:", dish);
  }

  const categoriesToShow =
    selectedId === "all"
      ? categories
      : categories.filter((category) => category.id === selectedId);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 space-y-6 bg-gray-100 p-8">
        {/* ШИНЭ ХООЛ НЭМЭГДСЭН ТУХАЙ МЭДЭГДЭЛ */}
        {toastMessage && (
          <div className="fixed left-1/2 top-6 z-60 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
            <CheckCircle2 size={18} className="text-green-400" />
            {toastMessage}
          </div>
        )}

        <CategoryChips
          categories={categories}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAddCategory={() => setShowAddModal(true)}
          onDeleteCategory={handleOpenDelete}
          deleteLoading={deleteLoading}
        />

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-red-600">{error}</div>
        )}

        {/* КАТЕГОРИ БҮРИЙН ХООЛНЫ ЖАГСААЛТ */}
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

        {/* КАТЕГОРИ НЭМЭХ MODAL */}
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
                    if (e.key === "Enter") {
                      handleAddCategory();
                    }
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

        {/* КАТЕГОРИ УСТГАХ MODAL */}
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

        {/* ХООЛ НЭМЭХ MODAL */}
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
      </main>
    </div>
  );
}
