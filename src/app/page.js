"use client";

import { useEffect, useState } from "react";

import Header from "./_components/header.js";
import HeroBanner from "./_features/hero-banner";
import CategoryTabs from "./_features/category-tabs";
import FoodGrid from "./_features/food-grid";


const API_URL = "http://localhost:1000";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch(
          `${API_URL}/food-category/get`
        );

        const data = await response.json();

        console.log("CATEGORY DATA:", data);

        const list = Array.isArray(data)
          ? data
          : data.data || data.categories || [];

        const formatted = list.map((category) => ({
          id: category._id || category.id,
          label: category.categoryName || category.label,
        }));

        setCategories(formatted);

        if (formatted.length > 0) {
          setActiveId(formatted[0].id);
        }
      } catch (error) {
        console.error("CATEGORY ERROR:", error);
      }
    }

    async function loadDishes() {
      try {
        const response = await fetch(
          `${API_URL}/food-dish/get`
        );

        if (!response.ok) {
          console.log("DISH API ERROR:", response.status);
          return;
        }

        const data = await response.json();

        console.log("DISH DATA:", data);

        const list = Array.isArray(data)
          ? data
          : data.data || data.dishes || [];

        const formatted = list.map((dish) => ({
          id: dish._id || dish.id,
          name: dish.name || dish.dishName,
          price: Number(dish.price) || 0,
          description: dish.description || "",
          emoji: dish.emoji || "🍽️",
          image: dish.image || dish.imageUrl || "",
          categoryId:
            dish.categoryId ||
            dish.category?._id ||
            dish.category?.id ||
            dish.foodCategoryId,
        }));

        setDishes(formatted);
      } catch (error) {
        console.error("DISH ERROR:", error);
      }
    }

    loadCategories();
    loadDishes();
  }, []);

  const activeCategory = categories.find(
    (category) => category.id === activeId
  );

  return (
    <main>
      <Header />

      <HeroBanner />

      {categories.length > 0 && (
        <CategoryTabs
          categories={categories}
          activeId={activeId}
          onChange={setActiveId}
        />
      )}

      {activeCategory && (
        <FoodGrid
          dishes={dishes}
          activeCategory={activeCategory}
        />
      )}

    </main>
  );
}