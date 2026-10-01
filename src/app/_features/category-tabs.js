"use client";

export default function CategoryTabs({ categories, activeId, onChange }) {
  return (
    <nav className="mx-auto flex max-w-6xl flex-wrap gap-2.5 px-6 pb-2 pt-8">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={
            category.id === activeId
              ? "cursor-pointer rounded-full border border-[#e8543d] bg-[#e8543d] px-5 py-2.5 text-sm font-semibold text-white"
              : "cursor-pointer rounded-full border border-white/[0.14] bg-transparent px-5 py-2.5 text-sm font-semibold text-neutral-400 hover:border-[#e8543d] hover:text-white"
          }
        >
          {category.label}
        </button>
      ))}
    </nav>
  );
}
