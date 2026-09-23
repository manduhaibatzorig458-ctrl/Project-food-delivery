import FoodCard from "../_components/food-card";

export default function FoodGrid({ dishes, activeCategory }) {
  const filtered = dishes.filter((dish) => dish.categoryId === activeCategory.id);

  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-10 pt-4 pb-14">
      <h2 className="font-serif text-[22px] font-bold my-2 mb-5 text-white">
        {activeCategory.label}
      </h2>

      {filtered.length === 0 ? (
        <p className="text-neutral-400 text-sm">No dishes in this category yet.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
          {filtered.map((dish) => (
            <FoodCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </section>
  );
}