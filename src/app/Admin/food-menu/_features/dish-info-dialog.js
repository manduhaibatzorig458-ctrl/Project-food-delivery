// "use client";
// import { useState } from "react";
// import { X, Trash2, ChevronsUpDown } from "lucide-react";
// import { backend } from "@/app/_api/api";

// export default function EditDishDialog({
//   dish,
//   categories = [],
//   onClose,
//   onUpdated,
//   onDeleteRequest,
// }) {
//   const [foodName, setFoodName] = useState(dish.name || "");
//   const [categoryId, setCategoryId] = useState(dish.categoryId || "");
//   const [ingredients, setIngredients] = useState(dish.description || "");
//   const [price, setPrice] = useState(dish.price || "");
//   const [image, setImage] = useState(dish.image || "");
//   const [imageChanged, setImageChanged] = useState(false);

//   const [categoryOpen, setCategoryOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const activeCategoryLabel =
//     categories.find((c) => c.id === categoryId)?.label || "Select category";

//   function handleImageFile(e) {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       setImage(reader.result);
//       setImageChanged(true);
//     };
//     reader.readAsDataURL(file);
//   }

//   async function handleSave() {
//     if (!foodName.trim()) {
//       setError("Dish name is required");
//       return;
//     }
//     if (!categoryId) {
//       setError("Category is required");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const payload = {
//         foodName: foodName.trim(),
//         category: categoryId,
//         ingredients,
//         price,
//       };

//       // Зөвхөн зураг бодитоор солигдсон/устсан тохиолдолд л дамжуулна —
//       // ингэснээр өөрчлөгдөөгүй том base64 string-ийг дахин илгээхгүй.
//       if (imageChanged) {
//         payload.image = image;
//       }

//       const response = await backend.put(`/food-dish/${dish.id}`, payload);

//       console.log("UPDATE DISH:", response.data);

//       const updated =
//         response.data.dish || response.data.foodDish || response.data;

//       onUpdated({
//         id: updated._id || dish.id,
//         categoryId: updated.category || categoryId,
//         name: updated.foodName || foodName,
//         price: updated.price || price,
//         description: updated.ingredients || ingredients,
//         image: updated.image || image,
//       });
//     } catch (err) {
//       console.error("UPDATE DISH ERROR:", err);
//       setError("Failed to update dish");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
//       <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-bold text-gray-900">Dishes info</h2>
//           <button
//             onClick={onClose}
//             aria-label="Close"
//             className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         <div className="mt-6 space-y-4">
//           {/* Dish name */}
//           <Field label="Dish name">
//             <input
//               type="text"
//               value={foodName}
//               onChange={(e) => setFoodName(e.target.value)}
//               disabled={loading}
//               className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
//             />
//           </Field>

//           {/* Category */}
//           <Field label="Dish category">
//             <div className="relative">
//               <button
//                 type="button"
//                 onClick={() => setCategoryOpen((v) => !v)}
//                 disabled={loading}
//                 className="flex w-full items-center justify-between rounded-lg border border-gray-200 py-1 pl-1 pr-3"
//               >
//                 <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-900">
//                   {activeCategoryLabel}
//                 </span>
//                 <ChevronsUpDown size={14} className="text-gray-400" />
//               </button>

//               {categoryOpen && (
//                 <ul className="absolute z-10 mt-1.5 w-full space-y-1 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl">
//                   {categories.map((cat) => (
//                     <li key={cat.id}>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setCategoryId(cat.id);
//                           setCategoryOpen(false);
//                         }}
//                         className={`block w-full rounded-full px-3 py-2 text-left text-sm font-semibold ${
//                           cat.id === categoryId
//                             ? "bg-gray-200 text-gray-900"
//                             : "bg-gray-100 text-gray-900 hover:bg-gray-200"
//                         }`}
//                       >
//                         {cat.label}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </Field>

//           {/* Ingredients */}
//           <Field label="Ingredients">
//             <textarea
//               rows={2}
//               value={ingredients}
//               onChange={(e) => setIngredients(e.target.value)}
//               disabled={loading}
//               className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
//             />
//           </Field>

//           {/* Price */}
//           <Field label="Price">
//             <input
//               type="text"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               disabled={loading}
//               className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
//             />
//           </Field>

//           {/* Image */}
//           <Field label="Image">
//             {image ? (
//               <div className="relative overflow-hidden rounded-lg">
//                 <img
//                   src={image}
//                   alt={foodName}
//                   className="h-28 w-full object-cover"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setImage("");
//                     setImageChanged(true);
//                   }}
//                   aria-label="Remove image"
//                   disabled={loading}
//                   className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-600 shadow"
//                 >
//                   <X size={14} />
//                 </button>
//               </div>
//             ) : (
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageFile}
//                 disabled={loading}
//                 className="w-full rounded-lg border-2 border-dashed border-gray-300 px-3 py-4 text-xs text-gray-500"
//               />
//             )}
//           </Field>

//           {error && <p className="text-sm text-red-500">{error}</p>}
//         </div>

//         {/* Footer */}
//         <div className="mt-6 flex items-center justify-between">
//           <button
//             type="button"
//             onClick={() => onDeleteRequest(dish)}
//             disabled={loading}
//             aria-label="Delete dish"
//             className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 text-red-400 hover:bg-red-50"
//           >
//             <Trash2 size={16} />
//           </button>

//           <button
//             onClick={handleSave}
//             disabled={loading}
//             className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-black"
//           >
//             {loading ? "Saving..." : "Save changes"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Field({ label, children }) {
//   return (
//     <div className="grid grid-cols-[100px_1fr] items-start gap-3">
//       <span className="pt-2 text-sm text-gray-400">{label}</span>
//       {children}
//     </div>
//   );
// }




"use client";

import { useState } from "react";
import { X, Trash2, ChevronsUpDown } from "lucide-react";
import { backend } from "@/app/_api/api";

export default function EditDishDialog({
  dish,
  categories = [],
  onClose,
  onUpdated,
  onDeleteRequest,
}) {
  const [foodName, setFoodName] = useState(dish.name || "");
  const [categoryId, setCategoryId] = useState(dish.categoryId || "");
  const [ingredients, setIngredients] = useState(
    dish.description || ""
  );
  const [price, setPrice] = useState(dish.price || "");
  const [image, setImage] = useState(dish.image || "");

  const [imageChanged, setImageChanged] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const category = categories.find(
    (item) => item.id === categoryId
  );

  const categoryName = category
    ? category.label
    : "Select category";

  // Image сонгох
  const handleImage = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
      setImageChanged(true);
    };

    reader.readAsDataURL(file);
  };

  // Save
  const handleSave = async () => {
    if (foodName.trim() === "") {
      setError("Dish name is required");
      return;
    }

    if (categoryId === "") {
      setError("Category is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const dishData = {
        foodName: foodName.trim(),
        category: categoryId,
        ingredients: ingredients,
        price: price,
      };

      if (imageChanged) {
        dishData.image = image;
      }

      const response = await backend.put(
        `/food-dish/${dish.id}`,
        dishData
      );

      console.log("UPDATE DISH:", response.data);

      const updatedDish =
        response.data.dish ||
        response.data.foodDish ||
        response.data;

      onUpdated({
        id: updatedDish._id || dish.id,
        categoryId: updatedDish.category || categoryId,
        name: updatedDish.foodName || foodName,
        price: updatedDish.price || price,
        description:
          updatedDish.ingredients || ingredients,
        image: updatedDish.image || image,
      });
    } catch (error) {
      console.log("UPDATE DISH ERROR:", error);
      setError("Failed to update dish");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold text-gray-900">
            Dishes info
          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600"
          >
            <X size={16} />
          </button>

        </div>

        <div className="mt-6 space-y-4">

          {/* Dish name */}
          <div>
            <label className="mb-2 block text-sm text-gray-500">
              Dish name
            </label>

            <input
              type="text"
              value={foodName}
              onChange={(event) =>
                setFoodName(event.target.value)
              }
              disabled={loading}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm text-gray-500">
              Dish category
            </label>

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setCategoryOpen(!categoryOpen)
                }
                disabled={loading}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-1"
              >
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold">
                  {categoryName}
                </span>

                <ChevronsUpDown
                  size={14}
                  className="text-gray-400"
                />
              </button>

              {categoryOpen && (
                <div className="absolute z-10 mt-2 w-full rounded-xl border bg-white p-2 shadow-lg">

                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        setCategoryId(category.id);
                        setCategoryOpen(false);
                      }}
                      className="mb-1 w-full rounded-lg bg-gray-100 px-3 py-2 text-left text-sm hover:bg-gray-200"
                    >
                      {category.label}
                    </button>
                  ))}

                </div>
              )}

            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="mb-2 block text-sm text-gray-500">
              Ingredients
            </label>

            <textarea
              rows={2}
              value={ingredients}
              onChange={(event) =>
                setIngredients(event.target.value)
              }
              disabled={loading}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="mb-2 block text-sm text-gray-500">
              Price
            </label>

            <input
              type="text"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value)
              }
              disabled={loading}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className="mb-2 block text-sm text-gray-500">
              Image
            </label>

            {image ? (
              <div className="relative">

                <img
                  src={image}
                  alt={foodName}
                  className="h-28 w-full rounded-lg object-cover"
                />

                <button
                  type="button"
                  onClick={() => {
                    setImage("");
                    setImageChanged(true);
                  }}
                  disabled={loading}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow"
                >
                  <X size={14} />
                </button>

              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                disabled={loading}
                className="w-full rounded-lg border-2 border-dashed border-gray-300 px-3 py-4 text-xs"
              />
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-between">

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDeleteRequest(dish)}
            disabled={loading}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 text-red-400 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>

        </div>

      </div>
    </div>
  );
}