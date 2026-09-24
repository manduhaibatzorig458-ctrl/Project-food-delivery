// export default function FoodCard({ dish }) {
//   return (
//     <article className="bg-white rounded-2xl overflow-hidden text-[#1a1a1a]">
//       <div className="relative h-[140px] bg-gradient-to-br from-[#efe6d8] to-[#d9cdb8] grid place-items-center">
//         <span className="text-5xl" role="img" aria-label={dish.name}>
//           {dish.emoji}
//         </span>
//         <button
//           type="button"
//           aria-label={`Add ${dish.name}`}
//           className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full border-none bg-white text-[#1a1a1a] text-base leading-none cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
//         >
//           +
//         </button>
//       </div>

//       <div className="px-4 pt-3.5 pb-4.5">
//         <div className="flex items-baseline justify-between gap-2">
//           <h3 className="m-0 text-[15px] font-bold text-[#e8543d]">{dish.name}</h3>
//           <span className="text-sm font-bold text-[#1a1a1a] whitespace-nowrap">
//             ${dish.price.toFixed(2)}
//           </span>
//         </div>
//         <p className="mt-1.5 mb-0 text-xs leading-relaxed text-neutral-500">
//           {dish.description}
//         </p>
//       </div>
//     </article>
//   );
// }


"use client";

export default function FoodCard({ dish }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden text-[#1a1a1a]">
      <div className="relative h-[140px] bg-gradient-to-br from-[#efe6d8] to-[#d9cdb8] grid place-items-center">
        {dish.image ? (
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className="text-5xl"
            role="img"
            aria-label={dish.name}
          >
            {dish.emoji || "🍽️"}
          </span>
        )}

        <button
          type="button"
          aria-label={`Add ${dish.name}`}
          className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full border-none bg-white text-[#1a1a1a] text-base leading-none cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
        >
          +
        </button>
      </div>

      <div className="px-4 pt-3.5 pb-4.5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="m-0 text-[15px] font-bold text-[#e8543d]">
            {dish.name}
          </h3>

          <span className="text-sm font-bold text-[#1a1a1a] whitespace-nowrap">
            ${Number(dish.price || 0).toFixed(2)}
          </span>
        </div>

        <p className="mt-1.5 mb-0 text-xs leading-relaxed text-neutral-500">
          {dish.description}
        </p>
      </div>
    </article>
  );
}