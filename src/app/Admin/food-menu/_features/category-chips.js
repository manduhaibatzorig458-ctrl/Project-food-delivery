"use client";

import { Plus, X } from "lucide-react";

export default function CategoryChips(props) {
  // Total dishes
  const totalCount = props.categories.reduce((sum, category) => {
    return sum + (category.count || 0);
  }, 0);

  // Chip style
  const getChipClasses = (selected) => {
    if (selected) {
      return "group flex items-center gap-2 rounded-full border border-[#E8503A] bg-white px-4 py-2 text-sm";
    }
    return "group flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm hover:border-neutral-300";
  };

  return (
    <section className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
      {/* Title */}
      <h2 className="mb-4 text-[20px] font-semibold">Dishes category</h2>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {/* All dishes */}
        <button
          type="button"
          onClick={() => props.onSelect("all")}
          className={getChipClasses(props.selectedId === "all")}
        >
          All Dishes
          <span className="rounded-full bg-black px-2 py-1 text-xs text-white">
            {totalCount}
          </span>
        </button>

        {/* Category list */}
        {props.categories.map((category) => (
          <div
            key={category.id}
            className={getChipClasses(props.selectedId === category.id)}
          >
            {/* Category button */}
            <button
              type="button"
              onClick={() => props.onSelect(category.id)}
              className="flex items-center gap-2"
            >
              {category.label}

              <span className="rounded-full bg-black px-2 py-1 text-xs text-white">
                {category.count || 0}
              </span>
            </button>

            {/* Delete button */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                props.onDeleteCategory(category.id);
              }}
              disabled={props.deleteLoading}
              className="ml-1 flex h-4 w-4 items-center justify-center rounded-full text-neutral-400 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {/* Add category */}
        <button
          type="button"
          onClick={props.onAddCategory}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8503A] text-white"
        >
          <Plus size={18} />
        </button>
      </div>
    </section>
  );
}
