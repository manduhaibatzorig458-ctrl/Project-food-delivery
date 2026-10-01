"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StepOne from "./_features/step-one";
import StepTwo from "./_features/step-two";
import { backend } from "@/app/_api/api";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const processForm = async (data) => {
    try {
      const response = await backend.post("/auth/sign-up", {
        email: data.email,
        password: data.password,
      });

      const { token, user } = response.data;
      if (!token) {
        console.error("Token irsengui:", response.data);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Home page ruu shuud butsna. replace ni signup huudsiig history-s hasna.
      router.replace("/");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <>
      {step === 1 && (
        <StepOne
          formData={formData}
          setFormData={setFormData}
          nextStep={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <StepTwo
          formData={formData}
          setFormData={setFormData}
          previousStep={() => setStep(1)}
          onSubmit={processForm}
        />
      )}
    </>
  );
}