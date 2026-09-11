import { Plus } from "lucide-react";
import DishCard from "./dish-card";

export default function CategorySection({
  title,
  dishes,
  onAddDish,
  onEditDish,
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm mt-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        {title} ({dishes.length})
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onAddDish?.(title)}
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-red-300 bg-white py-16 px-4 text-center hover:bg-red-50/50 transition-colors"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-400 text-white">
            <Plus size={18} strokeWidth={2.5} />
          </span>
          <span className="text-sm font-medium text-gray-800">
            Add new Dish to
            <br />
            {title}
          </span>
        </button>

        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} onEdit={onEditDish} />
        ))}
      </div>
    </div>
  );
}