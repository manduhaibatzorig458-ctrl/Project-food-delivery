"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StepOne from "./_features/step-one";
import StepTwo from "./_features/step-two";
import { backend } from "@/app/_api/api";
import { email } from "zod";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const processForm = async (data) => {
    const { confirmPassword, ...payload } = data;

    try {
      const response = await backend.post("/auth/sign-up", {
        email: data.email,
        password: data.password
      }); 
      console.log("Signup success:", response.data);

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      router.push("/admin");
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





// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// import StepOne from "./_features/step-one";
// import StepTwo from "./_features/step-two";

// import { backend } from "@/app/_api/api";
// import { useAuth } from "@/app/(provider)/authProvider.js";

// export default function SignupPage() {
//   const [step, setStep] = useState(1);

//   const router = useRouter();
//   const { login } = useAuth();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const processForm = async (data) => {
//     try {
//       const response = await backend.post("/auth/sign-up", {
//         email: data.email,
//         password: data.password,
//       });

//       console.log("Signup success:", response.data);

//       login(response.data.user, response.data.token);

//       router.push("/admin");
//     } catch (error) {
//       console.error("Signup failed:", error);
//     }
//   };

//   return (
//     <>
//       {step === 1 && (
//         <StepOne
//           formData={formData}
//           setFormData={setFormData}
//           nextStep={() => setStep(2)}
//         />
//       )}

//       {step === 2 && (
//         <StepTwo
//           formData={formData}
//           setFormData={setFormData}
//           previousStep={() => setStep(1)}
//           onSubmit={processForm}
//         />
//       )}
//     </>
//   );
// }