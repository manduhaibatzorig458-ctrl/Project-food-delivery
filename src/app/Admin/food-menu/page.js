// "use client";

// import Sidebar from "./_components/sidebar";
// import CategoryChips from "./_features/category-chips";

// export default function FoodMenuPage() {
//   return (
//     <div className="flex min-h-screen">
//       <Sidebar />

//       <main className="flex-1 p-8">
//        <CategoryChips/>
//       </main>
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import Sidebar from "./_components/sidebar";
// import CategoryChips from "./_features/category-chips";

// const CATEGORIES = [
//   { id: "appetizers", label: "Appetizers", count: 6 },
//   { id: "salads", label: "Salads", count: 3 },
//   { id: "pizzas", label: "Pizzas", count: 5 },
//   { id: "lunch-favorites", label: "Lunch favorites", count: 5 },
//   { id: "main-dishes", label: "Main dishes", count: 5 },
//   { id: "fish-sea-foods", label: "Fish & Sea foods", count: 5 },
//   { id: "brunch", label: "Brunch", count: 5 },
//   { id: "side-dish", label: "Side dish", count: 5 },
//   { id: "desserts", label: "Desserts", count: 5 },
//   { id: "beverages", label: "Beverages", count: 5 },
// ];

// export default function FoodMenuPage() {
//   const [selectedId, setSelectedId] = useState("all");

//   return (
//     <div className="flex min-h-screen">
//       <Sidebar />

//       <main className="flex-1 p-8">
//         <CategoryChips
//           categories={CATEGORIES}
//           selectedId={selectedId}
//           onSelect={setSelectedId}
//           onAddCategory={() => {
//             // жишээ нь: modal нээх logic энд бичнэ
//             console.log("Add category clicked");
//           }}
//         />
//       </main>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import Sidebar from "./_components/sidebar";
import CategoryChips from "./_features/category-chips";

const INITIAL_CATEGORIES = [
  { id: "appetizers", label: "Appetizers", count: 6 },
  { id: "salads", label: "Salads", count: 3 },
  { id: "pizzas", label: "Pizzas", count: 5 },
  { id: "lunch-favorites", label: "Lunch favorites", count: 5 },
  { id: "main-dishes", label: "Main dishes", count: 5 },
  { id: "fish-sea-foods", label: "Fish & Sea foods", count: 5 },
  { id: "brunch", label: "Brunch", count: 5 },
  { id: "side-dish", label: "Side dish", count: 5 },
  { id: "desserts", label: "Desserts", count: 5 },
  { id: "beverages", label: "Beverages", count: 5 },
];

export default function FoodMenuPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  const [selectedId, setSelectedId] = useState("all");

  const [showModal, setShowModal] = useState(false);

  const [categoryName, setCategoryName] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // Backend-оос categories авах
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:1000/api/categories");

        if (!response.ok) {
          throw new Error("Categories fetch failed");
        }

        const data = await response.json();

        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  // Category нэмэх
  const handleAddCategory = async () => {
    const name = categoryName.trim();

    if (!name) {
      setError("Category name оруулна уу");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:1000/api/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Category нэмэхэд алдаа гарлаа");
      }

      // Шинээр нэмэгдсэн category-г шууд UI-д харуулах
      setCategories((prev) => [
        ...prev,
        {
          id: data._id,
          label: data.name,
          count: data.count || 0,
        },
      ]);

      // Modal хаах
      setShowModal(false);

      // Input цэвэрлэх
      setCategoryName("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar />

      <main className="flex-1 p-8">
        <CategoryChips
          categories={categories}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAddCategory={() => {
            setShowModal(true);
            setError("");
          }}
        />

        {/* Add Category Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Add category
                </h2>

                <button
                  onClick={() => {
                    setShowModal(false);
                    setCategoryName("");
                    setError("");
                  }}
                  className="rounded-full p-2 hover:bg-neutral-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Input */}
              <div>
                <label className="mb-2 block text-sm font-medium">
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
                  placeholder="e.g. Breakfast"
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-[#E8503A]"
                />

                {error && (
                  <p className="mt-2 text-sm text-red-500">
                    {error}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setCategoryName("");
                    setError("");
                  }}
                  className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddCategory}
                  disabled={loading}
                  className="rounded-xl bg-[#E8503A] px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add category"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}