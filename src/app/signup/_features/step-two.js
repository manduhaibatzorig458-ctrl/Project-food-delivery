"use client";

import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function StepOne({
  formData,
  setFormData,
  nextStep,
}) {
  const [errors, setErrors] = useState({
    Password: "",
    ConfirmPassword: "",
  });

  // Show password state
  const [showPassword, setShowPassword] = useState(false);

  const handleBack = () => {
    window.history.back();
  };

  const validate = () => {
    const newErrors = {
      Password: "",
      ConfirmPassword: "",
    };

    // PASSWORD VALIDATION
    if (!formData.Password) {
      newErrors.Password = "Password is required";
    } else if (formData.Password.length < 8) {
      newErrors.Password =
        "Password must be at least 8 characters";
    }

    // CONFIRM PASSWORD VALIDATION
    if (!formData.ConfirmPassword) {
      newErrors.ConfirmPassword =
        "Confirm Password is required";
    } else if (
      formData.ConfirmPassword !== formData.Password
    ) {
      newErrors.ConfirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return (
      !newErrors.Password &&
      !newErrors.ConfirmPassword
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
      <div className="flex overflow-hidden bg-white">

        {/* LEFT SIDE */}
        <section className="flex w-full items-center justify-center px-8 py-10 md:w-[50%]">
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
              Create a strong password
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Create a strong password with letters, numbers.
            </p>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex w-full flex-col gap-4"
            >

              {/* PASSWORD */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Password"
                  className="text-sm text-[#242428]"
                >
                  Password
                </Label>

                <Input
                  id="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.Password || ""}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      Password: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      Password: "",
                    });
                  }}
                  className={
                    errors.Password
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />

                {errors.Password && (
                  <p className="text-xs text-red-500">
                    {errors.Password}
                  </p>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="ConfirmPassword"
                  className="text-sm text-[#242428]"
                >
                  Confirm Password
                </Label>

                <Input
                  id="ConfirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.ConfirmPassword || ""}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      ConfirmPassword: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      ConfirmPassword: "",
                    });
                  }}
                  className={
                    errors.ConfirmPassword
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />

                {errors.ConfirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.ConfirmPassword}
                  </p>
                )}
              </div>

              {/* SHOW PASSWORD */}
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

              {/* NEXT BUTTON */}
              <Button
                type="submit"
                className="
                  mt-1
                  h-10
                  w-full
                  bg-[#242428]
                  text-white
                  hover:bg-[#35353a]
                "
              >
                Let is Go
              </Button>
            </form>

            {/* LOGIN LINK */}
            <p className="mt-4 text-center text-xs text-gray-500">
              Already have an account?{" "}
              <button
                type="button"
                className="ml-1 text-blue-500 hover:underline"
              >
                Log in
              </button>
            </p>
          </div>
        </section>

        {/* RIGHT SIDE */}
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
