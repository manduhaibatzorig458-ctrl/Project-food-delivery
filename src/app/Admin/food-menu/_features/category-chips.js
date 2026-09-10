"use client";

import { Plus, X } from "lucide-react";

export default function CategoryChips({
  categories = [],
  selectedId = "all",
  onSelect = () => {},
  onAddCategory = () => {},
  onDeleteCategory = () => {},
  deleteLoading = false,
}) {
  const totalCount = categories.reduce(
    (sum, category) => sum + (category.count || 0),
    0
  );

  const getChipClasses = (isSelected) =>
    `group flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm transition-colors ${
      isSelected
        ? "border-[#E8503A]"
        : "border-neutral-200 hover:border-neutral-300"
    }`;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-[20px] font-semibold">
        Dishes category
      </h2>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect("all")}
          className={getChipClasses(selectedId === "all")}
        >
          All Dishes

          <span className="rounded-full bg-black px-2 py-1 text-xs text-white">
            {totalCount}
          </span>
        </button>

        {categories.map((category) => (
          <div
            key={category.id}
            className={getChipClasses(selectedId === category.id)}
          >
            <button
              type="button"
              onClick={() => onSelect(category.id)}
              className="flex items-center gap-2"
            >
              {category.label}

              <span className="rounded-full bg-black px-2 py-1 text-xs text-white">
                {category.count || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCategory(category.id);
              }}
              disabled={deleteLoading}
              aria-label={`Delete ${category.label}`}
              className="ml-1 flex h-4 w-4 items-center justify-center rounded-full text-neutral-400 opacity-0 transition hover:text-red-500 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <button
          onClick={onAddCategory}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8503A] text-white"
        >
          <Plus size={18} />
        </button>
      </div>
    </section>
  );
}