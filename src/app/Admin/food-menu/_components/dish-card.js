import { Pencil } from "lucide-react";

export default function DishCard({ dish, onEdit, highlighted = false }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white transition-all duration-500 ${
        highlighted
          ? "border-blue-500 ring-2 ring-blue-500"
          : "border-gray-100"
      }`}
    >
      <div className="relative h-32 w-full">
        <img
          src={dish.image}
          alt={dish.name}
          className="h-full w-full object-cover"
        />

        <button
          type="button"
          onClick={() => onEdit?.(dish)}
          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50"
        >
          <Pencil size={14} className="text-red-400" />
        </button>
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold leading-snug text-red-500">
            {dish.name}
          </h4>

          <span className="shrink-0 text-sm font-semibold text-gray-900">
            ${dish.price}
          </span>
        </div>

        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          {dish.description}
        </p>
      </div>
    </div>
  );
}