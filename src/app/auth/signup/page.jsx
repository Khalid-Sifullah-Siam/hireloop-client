"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { Card, Input, Button } from "@heroui/react";

import {
  Person,
  Envelope,
  Eye,
  EyeSlash,
  ArrowRightFromSquare,
} from "@gravity-ui/icons";

import { authClient } from "@/lib/auth-client";

const initialSignupForm = {
  name: "",
  email: "",
  password: "",
  role: "seeker",
};

const getAuthErrorMessage = (response) =>
  response?.error?.message || "Something went wrong. Please try again.";

export default function SignupPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectTO = searchParams.get('redirect') || '/';


  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(initialSignupForm);

  const updateFormField = (fieldName, fieldValue) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [fieldName]: fieldValue || "",
    }));
  };

  const handleChange = (event) => {
    updateFormField(event.target.name, event.target.value);
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      if (response.error) {
        setError(getAuthErrorMessage(response));
        return;
      }

      setSuccess("Account created successfully!");
      router.push(redirectTO);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4">
      <Card className="w-10/11 max-w-md bg-[#161b22] border border-white/10">
        <div className="py-8">

          {/* TITLE */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Create Account
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Sign up to continue
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">

            {/* NAME */}
            <div className="w-[90%] mx-auto space-y-2">
              <label className="text-sm text-gray-300">Name</label>

              <div className="relative">
                <Person className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                <Input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full pl-10"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="w-[90%] mx-auto space-y-2">
              <label className="text-sm text-gray-300">Email</label>

              <div className="relative">
                <Envelope className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                <Input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full pl-10"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="w-[90%] mx-auto space-y-2">
              <label className="text-sm text-gray-300">Password</label>

              <div className="relative">
                <Input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeSlash className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* ROLE */}
            <div className="w-[90%] mx-auto flex flex-col gap-3">
              <p className="text-sm text-gray-300">
                Select Role
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateFormField("role", "seeker")}
                  aria-pressed={formData.role === "seeker"}
                  className={`rounded-lg border px-4 py-3 text-sm transition ${
                    formData.role === "seeker"
                      ? "border-white bg-white text-black"
                      : "border-white/20 text-gray-300 hover:border-white/50"
                  }`}
                >
                  Job Seeker
                </button>

                <button
                  type="button"
                  onClick={() => updateFormField("role", "recruiter")}
                  aria-pressed={formData.role === "recruiter"}
                  className={`rounded-lg border px-4 py-3 text-sm transition ${
                    formData.role === "recruiter"
                      ? "border-white bg-white text-black"
                      : "border-white/20 text-gray-300 hover:border-white/50"
                  }`}
                >
                  Recruiter
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="w-[90%] mx-auto text-red-400 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="w-[90%] mx-auto text-green-400 bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* BUTTON */}
            <div className="w-[90%] mx-auto">
              <Button
                type="submit"
                className="w-full"
                isLoading={loading}
              >
                Create Account
              </Button>
            </div>

          </form>

          {/* FOOTER */}
          <div className="text-center mt-6 text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href={`/auth/signin?redirect=${redirectTO}`}
              className="text-white inline-flex items-center gap-1 hover:underline"
            >
              Sign In
              <ArrowRightFromSquare className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </Card>
    </div>
  );
}
