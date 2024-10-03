"use client";

import { useState } from "react";
import LoginForm, { FormInput } from "@/components/loginForm";
import { useRouter } from "next/navigation";

export default function Home() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: FormInput) => {
    setLoading(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Add a 2-second delay
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.message === "Logged in successfully") {
        // Login successful, redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      setError("An error occurred");
    } finally {
      setLoading(false);
      setError("");
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>

        {error && (
          <p className="my-5 bg-red-300 rounded-none p-1.5  text-xs">{error}</p>
        )}

        <LoginForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
}
