// "use client";

// import { useRef, useState } from "react";
// import { X, ImageIcon } from "lucide-react";

// const API_URL = "http://localhost:1000";

// export default function AddDishDialog({
//   categoryId,
//   categoryLabel,
//   onClose,
//   onDishAdded,
// }) {
//   const [foodName, setFoodName] = useState("");
//   const [foodPrice, setFoodPrice] = useState("");
//   const [ingredients, setIngredients] = useState("");

//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fileInputRef = useRef(null);

//   const handleFile = (file) => {
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       setError("Please choose an image file");
//       return;
//     }

//     setImage(file);
//     setImagePreview(URL.createObjectURL(file));
//     setError("");
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     handleFile(e.dataTransfer.files?.[0]);
//   };

//   const closeDialog = () => {
//     if (loading) return;
//     onClose?.();
//   };

//   const handleAddDish = async () => {
//     const name = foodName.trim();
//     const price = foodPrice.trim();

//     if (!name) {
//       setError("Food name is required");
//       return;
//     }

//     if (!price) {
//       setError("Food price is required");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const formData = new FormData();
//       formData.append("dishName", name);
//       formData.append("price", price);
//       formData.append("ingredients", ingredients.trim());
//       formData.append("categoryId", categoryId);
//       if (image) formData.append("image", image);

//       const response = await fetch(`${API_URL}/food-dish/create`, {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       console.log("CREATE DISH:", data);

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to add dish");
//       }

//       onDishAdded?.(data.foodDish || data);
//       onClose?.();
//     } catch (error) {
//       console.error("CREATE DISH ERROR:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
//       <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-bold text-gray-900">
//             Add new Dish to {categoryLabel}
//           </h2>

//           <button
//             onClick={closeDialog}
//             disabled={loading}
//             className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         {/* Name + Price */}
//         <div className="mt-6 grid grid-cols-2 gap-4">
//           <div>
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Food name
//             </label>
//             <input
//               type="text"
//               value={foodName}
//               onChange={(e) => {
//                 setFoodName(e.target.value);
//                 setError("");
//               }}
//               disabled={loading}
//               placeholder="Type food name"
//               className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-400"
//             />
//           </div>

//           <div>
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Food price
//             </label>
//             <input
//               type="text"
//               value={foodPrice}
//               onChange={(e) => {
//                 setFoodPrice(e.target.value);
//                 setError("");
//               }}
//               disabled={loading}
//               placeholder="Enter price..."
//               className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-400"
//             />
//           </div>
//         </div>

//         {/* Ingredients */}
//         <div className="mt-4">
//           <label className="mb-2 block text-sm font-medium text-gray-700">
//             Ingredients
//           </label>
//           <textarea
//             value={ingredients}
//             onChange={(e) => setIngredients(e.target.value)}
//             disabled={loading}
//             placeholder="List ingredients..."
//             rows={3}
//             className="w-full resize-none rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-400"
//           />
//         </div>

//         {/* Image dropzone */}
//         <div className="mt-4">
//           <label className="mb-2 block text-sm font-medium text-gray-700">
//             Food image
//           </label>

//           <div
//             onClick={() => fileInputRef.current?.click()}
//             onDragOver={(e) => {
//               e.preventDefault();
//               setIsDragging(true);
//             }}
//             onDragLeave={() => setIsDragging(false)}
//             onDrop={handleDrop}
//             className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-colors ${
//               isDragging
//                 ? "border-red-400 bg-red-50/50"
//                 : "border-gray-300 bg-gray-50 hover:bg-gray-100"
//             }`}
//           >
//             {imagePreview ? (
//               <img
//                 src={imagePreview}
//                 alt="Preview"
//                 className="h-24 w-24 rounded-lg object-cover"
//               />
//             ) : (
//               <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm">
//                 <ImageIcon size={16} />
//               </span>
//             )}

//             <p className="text-sm text-gray-700">
//               {imagePreview
//                 ? image?.name
//                 : "Choose a file or drag & drop it here"}
//             </p>

//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleFile(e.target.files?.[0])}
//               className="hidden"
//             />
//           </div>
//         </div>

//         {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

//         {/* Submit */}
//         <div className="mt-6 flex justify-end">
//           <button
//             onClick={handleAddDish}
//             disabled={loading}
//             className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
//           >
//             {loading ? "Adding..." : "Add Dish"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }