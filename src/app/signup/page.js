"use client";
import { useState } from "react";
import StepOne from "./_features/step-one";
import StepTwo from "./_features/step-two";

export default function SignupPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    terms: false,
  });

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
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
          />
        )}
      </div>
    </main>
  );
}
