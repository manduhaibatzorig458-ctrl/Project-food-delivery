import FoodCard from "../_components/food-card";

export default function FoodGrid({
  dishes,
  activeCategory,
  hideEmpty = false,
}) {
  const filteredDishes = dishes.filter(
    (dish) => dish.categoryId === activeCategory.id,
  );

  // Хоол байхгүй бол section-ийг нуух
  if (hideEmpty && filteredDishes.length === 0) {
    return null;
  }

  return (
    <section
      id={`category-${activeCategory.id}`}
      className="mx-auto w-full max-w-375 px-[7%] py-8"
    >
      {/* Category name */}
      <h2 className="mb-6 text-lg font-semibold text-white lg:text-2xl">
        {activeCategory.label}
      </h2>

      {/* Food list */}
      {filteredDishes.length === 0 ? (
        <p className="text-sm text-neutral-400">
          No dishes in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDishes.map((dish) => (
            <FoodCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </section>
  );
}
