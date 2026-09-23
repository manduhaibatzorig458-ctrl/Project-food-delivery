import { Plus } from "lucide-react";
import DishCard from "./dish-card";

export default function CategorySection({
  category,
  dishes = [],
  onAddDish,
  onEditDish,
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">
        {category.label} ({dishes.length})
      </h3>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
  
        <button
          type="button"
          onClick={() => onAddDish(category)}
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-red-600 bg-white px-4 py-16 text-center transition-colors hover:bg-red-50/50"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-400 text-white">
            <Plus size={18} strokeWidth={2.5} />
          </span>

          <span className="text-sm font-medium text-gray-800">
            Add new Dish to
            <br />
            {category.label}
          </span>
        </button>

        {dishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            onEdit={onEditDish}
          />
        ))}
      </div>
    </div>
    );}