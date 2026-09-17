// "use client";

// import { useRef, useState } from "react";
// import { X, ImageIcon } from "lucide-react";

// const API_URL = "http://localhost:1000";

// const cloudname = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
// const uploud_present = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOUD_PRESENT;

// export default function AddDishDialog(props) {
//   const categoryId = props.categoryId;
//   const categoryLabel = props.categoryLabel;
//   const onClose = props.onClose;
//   const onDishAdded = props.onDishAdded;

//   const [foodName, setFoodName] = useState("");
//   const [foodPrice, setFoodPrice] = useState("");
//   const [ingredients, setIngredients] = useState("");

//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fileInput = useRef(null);

//   // function chooseImage(file) {
//   //   if (!file) return;

//   //   if (!file.type.startsWith("image/")) {
//   //     setError("Please choose an image");
//   //     return;
//   //   }

//   //   setImage(file);
//   //   setImagePreview(URL.createObjectURL(file));
//   //   setError("");
//   // }

//   function handleImage(event) {
//     const file = event.target.files[0];
//     console.log(image)
//     // chooseImage(file);
//   }

//   const uploud = async() => {}
//   async function addDish() {
//     if (foodName.trim() === "") {
//       setError("Food name is required");
//       return;
//     }

//     if (foodPrice.trim() === "") {
//       setError("Food price is required");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     const formData = new FormData();

//     formData.append("dishName", foodName);
//     formData.append("price", foodPrice);
//     formData.append("ingredients", ingredients);
//     formData.append("categoryId", categoryId);

//     if (image) {
//       formData.append("image", image);
//     }

//     try {
//       const response = await fetch(API_URL + "/food-dish/create", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       console.log("CREATE DISH:", data);

//       if (!response.ok) {
//         setError(data.message || "Failed to add dish");
//         setLoading(false);
//         return;
//       }

//       onDishAdded(data.foodDish || data);
//       onClose();
//     } catch (error) {
//       console.log(error);
//       setError("Something went wrong");
//     }

//     setLoading(false);
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
//       <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-bold text-gray-900">
//             Add new Dish to {categoryLabel}
//           </h2>

//           <button
//             onClick={onClose}
//             disabled={loading}
//             className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         {/* Name and Price */}
//         <div className="mt-6 grid grid-cols-2 gap-4">
//           <div>
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Food name
//             </label>

//             <input
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

//         {/* Image */}
//         <div className="mt-4">
//           <label className="mb-2 block text-sm font-medium text-gray-700">
//             Food image
//           </label>

//           <div
//             onClick={() => fileInput.current.click()}
//             className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center hover:bg-gray-100"
//           >
//             {imagePreview ? (
//               <img
//                 src={imagePreview}
//                 alt="Food"
//                 className="h-24 w-24 rounded-lg object-cover"
//               />
//             ) : (
//               <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm">
//                 <ImageIcon size={16} />
//               </span>
//             )}

//             <p className="text-sm text-gray-700">
//               {imagePreview
//                 ? image.name
//                 : "Choose a file or drag & drop it here"}
//             </p>

//             <input
//               ref={fileInput}
//               type="file"
//               accept="image/*"
//               onChange={handleImage}
//               className="hidden"
//             />
//           </div>
//         </div>

//         {/* Error */}
//         {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

//         {/* Button */}
//         <div className="mt-6 flex justify-end">
//           <button
//             onClick={addDish}
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




"use client";

import { useRef, useState } from "react";
import axios from "axios";
import { X, ImageIcon } from "lucide-react";

const API_URL = "http://localhost:1000";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function AddDishDialog(props) {
  const categoryId = props.categoryId;
  const categoryLabel = props.categoryLabel;
  const onClose = props.onClose;
  const onDishAdded = props.onDishAdded;

  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [ingredients, setIngredients] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInput = useRef(null);

  function handleImage(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  }

  async function uploadImage() {
    if (!image) {
      console.log("NO IMAGE SELECTED");
      return "";
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error(
        "Cloudinary is not configured (missing cloud name or upload preset)",
      );
    }

    console.log("START CLOUDINARY UPLOAD...");
    console.log("CLOUD NAME:", CLOUD_NAME);
    console.log("UPLOAD PRESET:", UPLOAD_PRESET);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", UPLOAD_PRESET);

    // axios throws automatically on non-2xx responses, so we don't need
    // to manually check response.ok like we did with fetch.
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
    );

    // This logs the FULL axios response object (data, status, headers,
    // config, request, ...) — this is what you see in the screenshot.
    console.log("CLOUDINARY RESPONSE:", response);

    const secureUrl = response.data.secure_url;

    console.log("CLOUDINARY IMAGE URL:", secureUrl);

    return secureUrl;
  }

  async function addDish() {
    console.log("FOOD NAME:", foodName);
    console.log("FOOD PRICE:", foodPrice);
    console.log("INGREDIENTS:", ingredients);
    console.log("CATEGORY ID:", categoryId);
    console.log("IMAGE:", image);

    if (foodName.trim() === "") {
      setError("Food name is required");
      return;
    }

    if (foodPrice.trim() === "") {
      setError("Food price is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Cloudinary
      const imageUrl = await uploadImage();
      console.log("FINAL IMAGE URL:", imageUrl);

      // 2. Backend data
      const dishData = {
        dishName: foodName,
        price: foodPrice,
        ingredients: ingredients,
        categoryId: categoryId,
        image: imageUrl,
      };

      console.log("DATA SENT TO BACKEND:", dishData);

      // 3. Backend request
      const response = await axios.post(
        `${API_URL}/food-dish/create`,
        dishData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("BACKEND RESPONSE:", response);

      const createdDish = response.data.foodDish || response.data;
      console.log("DISH CREATED SUCCESSFULLY!", createdDish);

      onDishAdded(createdDish);
      onClose();
    } catch (err) {
      console.log("ERROR:", err);

      // axios errors carry the server's response (if any) on err.response
      const serverMessage = err.response?.data?.message;
      setError(serverMessage || err.message || "Failed to add dish");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Add new Dish to {categoryLabel}
          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Food name
            </label>

            <input
              value={foodName}
              onChange={(e) => {
                setFoodName(e.target.value);
                setError("");
              }}
              disabled={loading}
              placeholder="Type food name"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Food price
            </label>

            <input
              value={foodPrice}
              onChange={(e) => {
                setFoodPrice(e.target.value);
                setError("");
              }}
              disabled={loading}
              placeholder="Enter price..."
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-400"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Ingredients
          </label>

          <textarea
            value={ingredients}
            onChange={(e) => {
              setIngredients(e.target.value);
              setError("");
            }}
            disabled={loading}
            placeholder="List ingredients..."
            rows={3}
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-400"
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Food image
          </label>

          <div
            onClick={() => fileInput.current.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center hover:bg-gray-100"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Food"
                className="h-24 w-24 rounded-lg object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm">
                <ImageIcon size={16} />
              </span>
            )}

            <p className="text-sm text-gray-700">
              {imagePreview
                ? image.name
                : "Choose a file or drag & drop it here"}
            </p>

            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex justify-end">
          <button
            onClick={addDish}
            disabled={loading}
            className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Add Dish"}
          </button>
        </div>
      </div>
    </div>
  );
}







