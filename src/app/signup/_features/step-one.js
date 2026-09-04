"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const stepOneSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email. Use a format like example@email.com."),
  address: z.string().trim().min(1, "Address is required"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^[0-9+\-\s]{8,15}$/, "Invalid phone number"),
});

const emptyErrors = {
  name: "",
  email: "",
  address: "",
  phone: "",
};

const FIELDS = [
  { id: "name", label: "Name", type: "text", placeholder: "Enter your name" },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "example@gmail.com",
  },
  {
    id: "address",
    label: "Address",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    id: "phone",
    label: "Phone",
    type: "tel",
    placeholder: "Enter your phone number",
  },
];

export default function StepOne({ formData, setFormData, nextStep }) {
  const [errors, setErrors] = useState(emptyErrors);

  const handleBack = () => {
    window.history.back();
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const validate = () => {
    const result = stepOneSchema.safeParse(formData);

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
      nextStep();
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] p-2 md:p-8">
      <div className="mx-auto flex w-full min-h-[calc(100vh-16px)] max-w-[1600px] overflow-hidden rounded-2xl bg-white md:min-h-[calc(100vh-64px)]">

        {/* LEFT SIDE */}
        <section className="flex w-full min-w-0 items-center justify-center px-8 py-10 md:w-[40%] lg:px-16">
          <div className="w-full max-w-105">

            {/* BACK BUTTON */}
            <button
              type="button"
              onClick={handleBack}
              className="mb-5 flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-100"
            >
              <ChevronLeft size={14} />
            </button>

            {/* TITLE */}
            <h1 className="text-lg font-semibold text-[#242428] md:text-xl">
              Create your account
            </h1>

            <p className="mt-1 text-xs text-gray-500 md:text-sm">
              Sign up to explore your favorite dishes.
            </p>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex w-full flex-col gap-4"
            >
              {FIELDS.map(({ id, label, type, placeholder }) => (
                <div key={id} className="flex flex-col gap-2">
                  <Label htmlFor={id}>{label}</Label>

                  <Input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={formData[id]}
                    onChange={(e) => handleChange(id, e.target.value)}
                    className={errors[id] ? "border-red-500" : ""}
                  />

                  {errors[id] && (
                    <p className="text-xs text-red-500">{errors[id]}</p>
                  )}
                </div>
              ))}

              {/* NEXT BUTTON */}
              <Button
                type="submit"
                className="mt-2 h-10 w-full bg-[#242428] text-white hover:bg-[#35353a]"
              >
                Let is go
              </Button>
            </form>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="relative hidden min-w-0 p-2 md:block md:w-[60%]">
          <div className="relative h-full min-h-162.5 overflow-hidden rounded-[14px]">
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