"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ClipboardList, LogOut, Utensils } from "lucide-react";

const OPTIONS = [
  {
    href: "/admin/food-menu",
    title: "Food menu",
    description: "Add and manage dishes and categories.",
    Icon: Utensils,
  },
  {
    href: "/admin/orders",
    title: "Orders",
    description: "View orders and change delivery state.",
    Icon: ClipboardList,
  },
];

const AdminPage = () => {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [email, setEmail] = useState("");

  // Zuvhun admin l ene huudasd orno. Busad ni nuur huudas / login ruu shiljine.
  useEffect(() => {
    const token = localStorage.getItem("token");
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      user = null;
    }

    if (!token) {
      router.replace("/auth/login");
    } else if (user?.role !== "admin") {
      router.replace("/");
    } else {
      setEmail(user.email || "");
      setAllowed(true);
    }
  }, [router]);

  function signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/auth/login");
  }

  if (!allowed) return null;

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,#ffd9d2_0%,#fff1ee_40%,#ffffff_100%)] text-neutral-900">
      {/* Top bar */}
      <header className="sticky top-4 z-10 mx-4 mt-4 flex items-center justify-between rounded-full border border-white bg-white/70 px-5 py-3 shadow-lg shadow-[#e0483d]/10 backdrop-blur-md md:mx-12">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Logo.png" alt="NomNom" className="h-9 w-9 object-contain" />
          <div className="leading-tight">
            <p className="text-sm font-semibold">
              Nom<span className="text-[#e0483d]">Nom</span>
            </p>
            <p className="text-[10px] text-neutral-500">Admin panel</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {email && <span className="hidden text-neutral-600 sm:inline">{email}</span>}
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 rounded-full bg-[#e0483d] px-4 py-1.5 font-medium text-white transition hover:bg-[#c93e34]"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-neutral-500">What would you like to manage today?</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {OPTIONS.map(({ href, title, description, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-3xl bg-white p-6 shadow-md shadow-[#e0483d]/10 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#e0483d]/20"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e0483d]/10 text-[#e0483d] transition group-hover:bg-[#e0483d] group-hover:text-white">
                <Icon className="size-7" />
              </span>
              <span className="mt-6 text-xl font-semibold">{title}</span>
              <span className="mt-1 text-sm text-neutral-500">{description}</span>
              <span className="mt-8 flex items-center gap-2 text-sm font-medium text-[#e0483d]">
                Open
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AdminPage;