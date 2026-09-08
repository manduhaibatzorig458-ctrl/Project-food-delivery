"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const stepTwoSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const emptyErrors = {
  password: "",
  confirmPassword: "",
};

const PASSWORD_FIELDS = [
  { id: "password", label: "Password", placeholder: "Password" },
  {
    id: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Confirm Password",
  },
];

export default function StepTwo({
  formData,
  setFormData,
  previousStep,
  onSubmit,
}) {
  const [errors, setErrors] = useState(emptyErrors);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const validate = () => {
    const result = stepTwoSchema.safeParse(formData);

    if (result.success) {
      setErrors(emptyErrors);
      return true;
    }

    const newErrors = { ...emptyErrors };

    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (field in newErrors && !newErrors[field]) {
        newErrors[field] = issue.message;
      }
    }

    setErrors(newErrors);
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] p-2 md:p-8">
      <div className="mx-auto flex w-full min-h-[calc(100vh-16px)] max-w-[1600px] overflow-hidden rounded-2xl bg-white md:min-h-[calc(100vh-64px)]">
        <section className="flex w-full min-w-0 items-center justify-center px-8 py-10 md:w-[40%] lg:px-16">
          <div className="w-full max-w-105">
            <button
              type="button"
              onClick={previousStep}
              className="mb-5 flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-100"
            >
              <ChevronLeft size={14} />
            </button>

            <h1 className="text-lg font-semibold text-[#242428] md:text-xl">
              Create a strong password
            </h1>

            <p className="mt-1 text-xs text-gray-500 md:text-sm">
              Create a strong password with letters and numbers.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 flex w-full flex-col gap-4"
            >
              {PASSWORD_FIELDS.map(({ id, label, placeholder }) => (
                <div key={id} className="flex flex-col gap-2">
                  <Label htmlFor={id} className="text-sm text-[#242428]">
                    {label}
                  </Label>

                  <Input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    value={formData[id] || ""}
                    onChange={(e) => handleChange(id, e.target.value)}
                    className={
                      errors[id]
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />

                  {errors[id] && (
                    <p className="text-xs text-red-500">{errors[id]}</p>
                  )}
                </div>
              ))}

              <div className="flex items-center gap-2">
                <Checkbox
                  id="show-password"
                  checked={showPassword}
                  onCheckedChange={(checked) =>
                    setShowPassword(checked === true)
                  }
                />

                <Label
                  htmlFor="show-password"
                  className="cursor-pointer text-xs font-normal text-gray-500"
                >
                  Show password
                </Label>
              </div>

              <Button
                type="submit"
                className="mt-1 h-10 w-full bg-[#242428] text-white hover:bg-[#35353a]"
              >
                Let is go
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="ml-1 text-blue-500 hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </section>

        <section className="relative hidden min-w-0 p-2 md:block md:w-[60%]">
          <div className="relative h-full min-h-165.2 overflow-hidden rounded-[14px]">
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