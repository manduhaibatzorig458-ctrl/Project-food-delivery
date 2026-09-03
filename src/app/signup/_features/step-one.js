"use client";

import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StepOne({
  formData,
  setFormData,
  nextStep,
}) {
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const handleBack = () => {
    window.history.back();
  };

  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      address: "",
      phone: "",
    };

    // NAME
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // EMAIL
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email =
        "Invalid email. Use a format like example@email.com.";
    }

    // ADDRESS
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // PHONE
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s]{8,15}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);

    return (
      !newErrors.name &&
      !newErrors.email &&
      !newErrors.address &&
      !newErrors.phone
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      nextStep();
    }
  };

  return (
    <main className="bg-[#f5f5f5] p-2">
      <div className="flex overflow-hidden bg-white ">

        {/* LEFT SIDE */}
        <section className="flex w-full items-center justify-center px-8 py-10 md:w-[40%] lg:px-16">
          <div className="w-full max-w-105">

            {/* BACK BUTTON */}
            <button
              type="button"
              onClick={handleBack}
              className="
                mb-5
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-md
                border
                border-gray-200
                text-gray-500
                transition
                hover:bg-gray-100
              "
            >
              <ChevronLeft size={14} />
            </button>

            {/* TITLE */}
            <h1 className="text-lg font-semibold text-[#242428]">
              Create your account
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Sign up to explore your favorite dishes.
            </p>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex w-full flex-col gap-4"
            >

              {/* NAME */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">
                  Name
                </Label>

                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      name: "",
                    });
                  }}
                  className={
                    errors.name ? "border-red-500" : ""
                  }
                />

                {errors.name && (
                  <p className="text-xs text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      email: "",
                    });
                  }}
                  className={
                    errors.email ? "border-red-500" : ""
                  }
                />

                {errors.email && (
                  <p className="text-xs text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* ADDRESS */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="address">
                  Address
                </Label>

                <Input
                  id="address"
                  type="text"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      address: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      address: "",
                    });
                  }}
                  className={
                    errors.address ? "border-red-500" : ""
                  }
                />

                {errors.address && (
                  <p className="text-xs text-red-500">
                    {errors.address}
                  </p>
                )}
              </div>

              {/* PHONE */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">
                  Phone
                </Label>

                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      phone: "",
                    });
                  }}
                  className={
                    errors.phone ? "border-red-500" : ""
                  }
                />

                {errors.phone && (
                  <p className="text-xs text-red-500">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* NEXT BUTTON */}
              <Button
                type="submit"
                className="
                  mt-2
                  h-10
                  w-full
                  bg-[#242428]
                  text-white
                  hover:bg-[#35353a]
                "
              >
                Let is go
              </Button>
            </form>
          </div>
        </section>

        {/* RIGHT SIDE IMAGE */}
        <section className="relative hidden w-[50%] p-2 md:block">
          <div className="relative h-full min-h-125 overflow-hidden rounded-[14px]">
            <Image
              src="/login-image.png"
              alt="Delivery rider"
              fill
              priority
              className="object-cover"
            />
          </div>
        </section>

      </div>
    </main>
  );
}