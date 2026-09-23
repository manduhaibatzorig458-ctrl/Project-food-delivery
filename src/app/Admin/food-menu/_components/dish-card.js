import { Pencil } from "lucide-react";

export default function DishCard(props) {
  if (!props.dish) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-2">
      {/* Image */}
      <div className="relative h-32 w-full overflow-hidden rounded-lg">
        <img
          src={props.dish.image}
          alt={props.dish.name}
          className="h-full w-full object-cover"
        />

        {/* Edit button */}
        <button
          type="button"
          onClick={() => props.onEdit(props.dish)}
          aria-label="Edit dish"
          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-105"
        >
          <Pencil size={14} className="text-red-500" />
        </button>
      </div>

      {/* Dish information */}
      <div className="px-1 pb-0.5 pt-2">
        {/* Name and price */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold leading-snug text-red-500">
            {props.dish.name}
          </h4>

          <span className="shrink-0 text-sm font-semibold text-gray-900">
            ${props.dish.price}
          </span>
        </div>

        <p className="mt-1 text-xs leading-relaxed text-gray-600">
          {props.dish.description}
        </p>
      </div>
    </div>
  );
}
