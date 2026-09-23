"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import HeroBanner from "./_features/hero-banner";
import CategoryTabs from "./_features/category-tabs";
import FoodGrid from "./_features/food-grid";

export default function HomePage() {

      const [categories, setCategories] = useState([]);
      const [dishes, setDishes] = useState([]);
      const [activeId, setActiveId] = useState(null);

        useEffect(() => {
        let cancelled = false;

     async function load() {
      const [categoryList, dishList] = await Promise.all([getCategories(), getDishes()]);
      if (cancelled) return;
      setCategories(categoryList);
      setDishes(dishList);
      setActiveId(categoryList[0]?.id ?? null);
     }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeCategory = categories.find((c) => c.id === activeId);

  return (
      <>
      <HeroBanner />
      {categories.length > 0 && (
        <CategoryTabs categories={categories} activeId={activeId} onChange={setActiveId} />
      )}

      {activeCategory && <FoodGrid dishes={dishes} activeCategory={activeCategory} />}
  
      </>
  );
}
