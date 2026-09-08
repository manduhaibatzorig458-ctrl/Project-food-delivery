"use client";

export default function CategorySidebar({ categories, activeId, onSelect, onAddCategory }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-base font-semibold text-gray-900">Dishes category</h2>
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const active = cat.id === activeId;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={[
                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 text-gray-700 hover:border-gray-300",
              ].join(" ")}
            >
              {cat.name}
              <span
                className={[
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                  active ? "bg-white text-gray-900" : "bg-gray-900 text-white",
                ].join(" ")}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
        <button
          onClick={onAddCategory}
          aria-label="Add category"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}