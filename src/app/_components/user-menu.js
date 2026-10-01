"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

export default function UserMenu({
  loginHref = "/auth/login",
  signupHref = "/auth/signup",
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(null);

  const menuRef = useRef(null);

  // Login хийсэн хэрэглэгчийг шалгана
  function checkUser() {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined") {
      setEmail(null);
      return;
    }

    const user = localStorage.getItem("user");

    if (user) {
      const data = JSON.parse(user);
      setEmail(data.email || "");
    }
  }

  // Page нээгдэхэд хэрэглэгчийг шалгана
  useEffect(() => {
    checkUser();
  }, []);

  // Menu-ийн гадна дарвал хаана
  useEffect(() => {
    function closeMenu(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeMenu);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  // Login / Sign up руу шилжих
  function goToPage(page) {
    setOpen(false);
    router.push(page);
  }

  // Logout
  function signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setEmail(null);
    setOpen(false);

    router.refresh();
  }

  return (
    <div ref={menuRef} className="relative">
      {/* User button */}
      <button
        type="button"
        onClick={() => {
          checkUser();
          setOpen(!open);
        }}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ec5b48] text-white hover:bg-[#ec5b48]/90"
      >
        <User className="h-5 w-5" />
      </button>

      {/* Menu */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-44 rounded-2xl bg-white p-4 text-center text-neutral-900 shadow-xl">
          {email ? (
            <>
              {/* Logged in */}
              <p className="text-base font-semibold">{email}</p>

              <button
                type="button"
                onClick={signOut}
                className="mt-3 rounded-full bg-neutral-100 px-5 py-1.5 text-sm hover:bg-neutral-200"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              {/* Not logged in */}
              <p className="text-sm font-semibold">Welcome to NomNom</p>

              <button
                type="button"
                onClick={() => goToPage(loginHref)}
                className="mt-3 h-9 w-full rounded-md bg-neutral-900 text-sm text-white hover:bg-neutral-800"
              >
                Log in
              </button>

              <button
                type="button"
                onClick={() => goToPage(signupHref)}
                className="mt-2 h-9 w-full rounded-md border border-neutral-200 text-sm hover:bg-neutral-100"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
