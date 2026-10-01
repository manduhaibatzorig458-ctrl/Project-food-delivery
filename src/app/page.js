"use client";

import { useEffect, useState } from "react";

import Header from "./_components/header.js";
import HeroBanner from "./_features/hero-banner";
import FoodGrid from "./_features/food-grid";
import Footer from "./_components/footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1000";

function toList(data, keys) {
  if (Array.isArray(data)) return data;
  for (const key of ["data", ...keys]) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
}

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch(`${API_URL}/food-category/get`);
        if (!response.ok) {
          console.log("CATEGORY API ERROR:", response.status);
          return;
        }
        const data = await response.json();

        const list = toList(data, ["categories", "foodCategories"]);

        setCategories(
          list.map((category) => ({
            id: category._id || category.id,
            label: category.categoryName || category.label,
          }))
        );
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

        const list = toList(data, ["dishes", "foodDishes"]);

        setDishes(
          list.map((dish) => {
            // populate хийсэн бол object, үгүй бол id string ирнэ
            const rawCategory =
              dish.categoryId || dish.category || dish.foodCategoryId;

            const categoryId =
              typeof rawCategory === "object" && rawCategory !== null
                ? rawCategory._id || rawCategory.id
                : rawCategory;

            return {
              id: dish._id || dish.id,
              name: dish.name || dish.dishName || dish.foodName,
              price: Number(dish.price) || 0,
              description: dish.description || dish.ingredients || "",
              emoji: dish.emoji || "🍽️",
              image: dish.image || dish.imageUrl || "",
              categoryId,
            };
          })
        );
      } catch (error) {
        console.error("DISH ERROR:", error);
      }
    }

    Promise.all([loadCategories(), loadDishes()]);
  }, []);

  return (
    <main className="bg-[#3d3d3d]">
      <Header />
      <HeroBanner />

      {categories.map((category) => (
        <FoodGrid
          key={category.id}
          dishes={dishes}
          activeCategory={category}
          hideEmpty
        />
      ))}

      <Footer categories={categories} />
    </main>
  );
}



