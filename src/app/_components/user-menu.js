"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

export default function UserMenu({
  loginHref = "/auth/login",
  signupHref = "/auth/signup",
}) {
  const router = useRouter();
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(null); // null = nevtreegui

  // Neeh burt localStorage-aas nevtersen esehiig shinechilne.
  function readSession() {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") {
      setEmail(null);
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      setEmail(user?.email || "");
    } catch {
      setEmail("");
    }
  }

  useEffect(() => {
    readSession();
  }, []);

  // Gadna darahad ba Esc darahad haana.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggle() {
    if (!open) readSession();
    setOpen((prev) => !prev);
  }

  function go(href) {
    setOpen(false);
    router.push(href);
  }

  function signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setEmail(null);
    setOpen(false);
    router.refresh();
  }

  const loggedIn = email !== null;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ec5b48] text-white transition hover:bg-[#ec5b48]/90"
      >
        <User className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-3 w-max min-w-44 rounded-2xl bg-white p-4 text-center text-neutral-900 shadow-xl"
        >
          {loggedIn ? (
            <>
              <p className="text-base font-semibold">{email}</p>
              <button
                type="button"
                onClick={signOut}
                className="mt-3 rounded-full bg-neutral-100 px-5 py-1.5 text-sm transition hover:bg-neutral-200"
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">Welcome to NomNom</p>
              <button
                type="button"
                onClick={() => go(loginHref)}
                className="h-9 rounded-md bg-neutral-900 px-6 text-sm text-white transition hover:bg-neutral-800"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => go(signupHref)}
                className="h-9 rounded-md border border-neutral-200 px-6 text-sm transition hover:bg-neutral-100"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}