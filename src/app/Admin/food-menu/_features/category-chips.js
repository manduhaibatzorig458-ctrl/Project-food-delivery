// "use client";

// import { Plus } from "lucide-react";

// export default function CategoryChips({
//   categories = [],
//   selectedId = "all",
//   onSelect = () => {},
//   onAddCategory = () => {},
// }) {
//   const totalCount = categories.reduce(
//     (sum, category) => sum + (category.count || 0),
//     0
//   );

//   const getChipClasses = (isSelected) =>
//     `flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm transition-colors ${
//       isSelected
//         ? "border-[#E8503A]"
//         : "border-neutral-200 hover:border-neutral-300"
//     }`;

//   return (
//     <section className="rounded-2xl bg-white p-6 shadow-sm">
//       <h2 className="mb-4 text-[20px] font-semibold">Dishes category</h2>

//       <div className="flex flex-wrap gap-2">
//         {/* All Dishes */}
//         <button
//           onClick={() => onSelect("all")}
//           className={getChipClasses(selectedId === "all")}
//         >
//           All Dishes
//           <span className="rounded-full bg-black px-2 py-1 text-xs text-white">
//             {totalCount}
//           </span>
//         </button>

//         {/* Categories */}
//         {categories.map((category) => (
//           <button
//             key={category.id}
//             onClick={() => onSelect(category.id)}
//             className={getChipClasses(selectedId === category.id)}
//           >
//             {category.label}
//             <span className="rounded-full bg-black px-2 py-1 text-xs text-white">
//               {category.count || 0}
//             </span>
//           </button>
//         ))}

//         {/* Add */}
//         <button
//           onClick={onAddCategory}
//           className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8503A] text-white"
//         >
//           <Plus size={18} />
//         </button>
//       </div>
//     </section>
//   );
// }


"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

export default function CategoryChips({
  categories = [],
  selectedId = "all",
  onSelect = () => {},
  onAddCategory = () => {},
}) {
  const totalCount = categories.reduce(
    (sum, category) => sum + (category.count || 0),
    0
  );

  const getChipClasses = (isSelected) =>
    `flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm transition-colors ${
      isSelected
        ? "border-[#E8503A]"
        : "border-neutral-200 hover:border-neutral-300"
    }`;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-[20px] font-semibold">Dishes category</h2>

      <div className="flex flex-wrap gap-2">
        {/* All Dishes */}
        <button
          onClick={() => onSelect("all")}
          className={getChipClasses(selectedId === "all")}
        >
          All Dishes

          <span className="rounded-full bg-black px-2 py-1 text-xs text-white">
            {totalCount}
          </span>
        </button>

        {/* Categories */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={getChipClasses(selectedId === category.id)}
          >
            {category.label}

            <span className="rounded-full bg-black px-2 py-1 text-xs text-white">
              {category.count || 0}
            </span>
          </button>
        ))}

        {/* Add Category */}
        <button
          onClick={onAddCategory}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8503A] text-white transition hover:bg-[#d94330]"
        >
          <Plus size={18} />
        </button>
      </div>
    </section>
  );
}