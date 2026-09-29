"use client";

export default function FoodCard({ dish, onAdd }) {
  return (
    <div className="flex h-full w-full flex-col rounded-[14px] bg-white p-2.5 text-[#111]">
      <div className="relative aspect-[231/133] w-full shrink-0 overflow-hidden rounded-[10px] bg-neutral-200">
        {dish.image ? (
          <img
            src={dish.image}
            alt={dish.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            {dish.emoji || "🍽️"}
          </div>
        )}

        {/* Add button */}
        <button
          type="button"
          aria-label={`Add ${dish.name}`}
          onClick={() => onAdd?.(dish)}
          className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-base leading-none text-red-500 hover:bg-neutral-100"
        >
          +
        </button>
      </div>

      {/* Name and price */}
      <div className="mt-3.5 flex items-center justify-between gap-2">
        <h3 className="truncate text-base font-medium text-[#e0483d]">
          {dish.name}
        </h3>
        <span className="shrink-0 text-[13px] font-bold">
          ${Number(dish.price || 0).toFixed(2)}
        </span>
      </div>

      {/* Description (2 мөрийн зай үргэлж хадгалагдана) */}
      <p className="mb-0.5 mt-2 line-clamp-2 min-h-[2.7em] text-[10px] leading-[1.35] text-[#111]">
        {dish.description}
      </p>
    </div>
  );
}