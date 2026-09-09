"use client";

import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import LoginForm from "./_features/login-form";

export default function LoginPage() {
  const router = useRouter();

  const handleBack = () => {
    window.history.back();
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] p-2 md:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-16px)] max-w-360 overflow-hidden bg-white md:min-h-[calc(100vh-64px)]">
        {/* LOGIN */}
        <section className="flex w-full items-center justify-center px-8 py-10 md:w-[40%] lg:px-16">
          <div className="w-full max-w-105">
            {/* BACK BUTTON */}
            <button
              type="button"
              onClick={handleBack}
              className="mb-5 flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-100"
              aria-label="Go back"
            >
              <ChevronLeft size={14} />
            </button>

            {/* TITLE */}
            <h1 className="text-lg font-semibold text-[#242428]">Log in</h1>

            <p className="mt-1 text-xs text-gray-500">
              Log in to enjoy your favorite dishes.
            </p>

            {/* FORM */}
            <LoginForm />

            {/* SIGN UP */}
            <div className="mt-5 flex justify-center gap-2 text-xs">
              <span className="text-gray-500">Do not have an account?</span>

              <button
                type="button"
                onClick={() => router.push("/auth/signup")}
                className="text-[#315c9b] hover:underline"
              >
                Sign up
              </button>
            </div>
          </div>
        </section>

        {/* IMAGE */}
        <section className="relative hidden w-[60%] p-2 md:block">
          <div className="relative h-full min-h-162 overflow-hidden rounded-[14px]">
            <Image
              src="/login-image.png"
              alt="Delivery rider"
              fill
              priority
              sizes="60vw"
              className="object-cover"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
