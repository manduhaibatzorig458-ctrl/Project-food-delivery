"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// /admin dor baigaa BUH huudas (admin, admin/food-menu, admin/orders ...) ene layout-aar dawhardana.
// Admin bish hereglegch URL-aar shuud orj irehed huudas ni ergej haragdahgui, nuur / login ruu shiljine.
export default function AdminLayout({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      user = null;
    }

    if (!token || token === "undefined") {
      router.replace("/auth/login");
    } else if (user?.role !== "admin") {
      router.replace("/");
    } else {
      setAllowed(true);
    }
  }, [router]);

  // Shalgaj duustal yu ch haruulahgui.
  if (!allowed) return null;

  return children;
}
