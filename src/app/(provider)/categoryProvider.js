"use client"

import { createContext, useContext, useEffect, useState} from "react"
import { backend } from "@/app/_api/api"

const CategoryContext = createContext()

export const CategoryProvider = ({ children }) => {
    const [data, setData] = useState ([]);
    const [loading, setLoading] = useState (true)

      async function loadCategories() {
    try {
      const response = await backend.get("/food-category/get");

      console.log("GET CATEGORY:", response.data);

      const categoryList =
        response.data.categories ||
        response.data.foodCategories ||
        response.data;

      const newCategories = categoryList.map((item) => ({
        id: item._id,
        label: item.categoryName,
        count: item.count || 0,
      }));

      setCategories(newCategories);
    } catch (error) {
      console.log("GET CATEGORY ERROR:", error);
      console.log("GET CATEGORY ERROR RESPONSE:", error.response?.data);

      setError("Failed to load categories");
    }
  }

  return (
    <CategoryContext.Provider value={(data, loading, loadCategories)}>
        {children}
    </CategoryContext.Provider>

  );
}