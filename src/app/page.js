"use client";

import { useEffect, useState } from "react";

import Header from "./_components/header.js";
import HeroBanner from "./_features/hero-banner";
import FoodGrid from "./_features/food-grid";

const API_URL = "http://localhost:1000";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch(`${API_URL}/food-category/get`);
        const data = await response.json();

        console.log("CATEGORY DATA:", data);

        const list = Array.isArray(data)
          ? data
          : data.data || data.categories || data.foodCategories || [];

        const formatted = list.map((category) => ({
          id: category._id || category.id,
          label: category.categoryName || category.label,
        }));

        setCategories(formatted);
      } catch (error) {
        console.error("CATEGORY ERROR:", error);
      }
    }

    async function loadDishes() {
      try {
        const response = await fetch(`${API_URL}/food-dish/get`);

        if (!response.ok) {
          console.log("DISH API ERROR:", response.status);
          return;
        }

        const data = await response.json();

        console.log("DISH DATA:", data);

        const list = Array.isArray(data)
          ? data
          : data.data || data.dishes || data.foodDishes || [];

        const formatted = list.map((dish) => ({
          id: dish._id || dish.id,
          name: dish.name || dish.dishName || dish.foodName,
          price: Number(dish.price) || 0,
          description: dish.description || dish.ingredients || "",
          emoji: dish.emoji || "🍽️",
          image: dish.image || dish.imageUrl || "",
          categoryId:
            dish.categoryId ||
            dish.category?._id ||
            dish.category?.id ||
            dish.category ||
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

  return (
    <main>
      <Header />
      <HeroBanner />

      {categories.map((category) => (
        <FoodGrid
          key={category.id}
          dishes={dishes}
          activeCategory={category}
        />
      ))}
    </main>
  );
}