// import { Plus } from "lucide-react";
// import DishCard from "./dish-card";

// export default function CategorySection(props) {
//   return (
//     <section className="rounded-2xl bg-white p-6 shadow-sm">
//       {/* Category title */}
//       <h2 className="mb-4 text-lg font-semibold text-gray-900">
//         {props.category.label}

//         <span className="font-normal text-black">
//           {" "}
//           ({props.dishes.length})
//         </span>
//       </h2>

//       {/* Dishes */}
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
//         {/* Add new dish */}
//         <button
//           type="button"
//           onClick={() => props.onAddDish(props.category)}
//           className="flex min-h-55 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-red-500 px-4 py-10 text-center transition-colors hover:bg-red-50"
//         >
//           {/* Plus icon */}
//           <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white">
//             <Plus size={18} />
//           </span>

//           {/* Text */}
//           <span className="text-sm font-medium text-gray-800">
//             Add new Dish to
//             <br />
//             {props.category.label}
//           </span>
//         </button>

//         {/* Dish cards */}
//         {props.dishes.map((dish, index) => {
//           if (!dish) {
//             return null;
//           }

//           return (
//             <DishCard
//               key={dish._id || dish.id || index}
//               dish={dish}
//               onEdit={props.onEditDish}
//             />
//           );
//         })}
//       </div>
//     </section>
//   );
// }



import { Plus } from "lucide-react";
import DishCard from "./dish-card";

export default function CategorySection(props) {
  const validDishes = props.dishes.filter(Boolean); // undefined/null-г эндээс шүүнэ

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        {props.category.label}
        <span className="font-normal text-black"> ({validDishes.length})</span>
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => props.onAddDish(props.category)}
          className="flex min-h-55 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-red-500 px-4 py-10 text-center transition-colors hover:bg-red-50"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white">
            <Plus size={18} />
          </span>
          <span className="text-sm font-medium text-gray-800">
            Add new Dish to
            <br />
            {props.category.label}
          </span>
        </button>

        {validDishes.map((dish, index) => (
          <DishCard
            key={dish._id || dish.id || index}
            dish={dish}
            onEdit={props.onEditDish}
          />
        ))}
      </div>
    </section>
  );
}