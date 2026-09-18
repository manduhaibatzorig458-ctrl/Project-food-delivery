import { Pencil } from "lucide-react";

export default function DishCard({ dish, onEdit }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">

      <div className="relative">
        <img
          src={dish.image}
          alt={dish.name}
          className="h-32 w-full object-cover"
        />

        <button
          onClick={() => onEdit(dish)}
          className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white"
        >
          <Pencil size={14} />
        </button>
      </div>

      <div className="p-3">

        <div className="flex justify-between">
          <h4 className="text-sm font-semibold text-red-500">
            {dish.name}
          </h4>

          <p className="text-sm font-semibold">
            ${dish.price}
          </p>
        </div>

        <p className="mt-1 text-xs text-gray-500">
          {dish.description}
        </p>

      </div>
    </div>
  );
}

