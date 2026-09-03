"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FieldError } from "../_components/field-error";


const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email. Use a format like example@gmail.com."),

  password: z
    .string()
    .min(1, "Password is required.")
    .min(6, "Password must be at least 6 characters.")
    .max(20, "Password must be at most 20 characters."),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  /* SUBMIT */
  const onSubmit = (data) => {
    console.log("Login successful");

    console.log({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 flex flex-col gap-4"
    >
      {/* EMAIL */}
      <div>
        <input
          type="email"
          placeholder="Enter your email address"
          autoComplete="email"
          {...register("email")}
          className={`h-12 w-full rounded-md border bg-white px-4 text-sm text-[#242428] outline-none transition placeholder:text-gray-400 focus:ring-1
            ${ errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:border-gray-400 focus:ring-gray-300"
            }`}/>

        {/* EMAIL ERROR */}
        <FieldError message={errors.email?.message} />
      </div>

      {/* PASSWORD */}
      <div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            {...register("password")}
            className={`h-12 w-full rounded-md border bg-white px-4 pr-12 text-sm text-[#242428] outline-none transition placeholder:text-gray-400 focus:ring-1
              ${ errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:border-gray-400 focus:ring-gray-300"
              }`}/>

          {/* SHOW / HIDE PASSWORD */}
          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => !prev)
            }
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600">
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {/* PASSWORD ERROR */}
        <FieldError message={errors.password?.message} />
      </div>

      {/* FORGOT PASSWORD */}
      <button
        type="button"
        onClick={() => {
          console.log("Forgot password clicked");
        }}
        className="w-fit text-xs text-gray-600 underline transition hover:text-black">
        Forgot password?
      </button>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={!isValid}
        className={`h-12 w-full rounded-md text-sm font-medium text-white transition
         ${
            isValid
              ? "bg-[#242428] hover:bg-[#35353a]"
              : "cursor-not-allowed bg-gray-300"
          }`} >
        Let is Go
      </button>
    </form>
  );
}