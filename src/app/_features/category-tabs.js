"use client";

export default function CategoryTabs({ categories, activeId, onChange }) {
  return (
    <nav
      className="flex gap-2.5 flex-wrap px-6 sm:px-10 pt-8 pb-2 max-w-6xl mx-auto"
      aria-label="Menu categories"
    >
      {categories.map((category) => {
        const active = category.id === activeId;
        return (
          <button
            key={category.id}
            type="button"
            aria-current={active ? "true" : undefined}
            onClick={() => onChange(category.id)}
            className={
              active
                ? "px-5 py-2.5 rounded-full border border-[#e8543d] bg-[#e8543d] text-white text-sm font-semibold cursor-pointer"
                : "px-5 py-2.5 rounded-full border border-white/[0.14] bg-transparent text-neutral-400 text-sm font-semibold cursor-pointer hover:border-[#e8543d] hover:text-white"
            }
          >
            {category.label}
          </button>
        );
      })}
    </nav>
  );
}