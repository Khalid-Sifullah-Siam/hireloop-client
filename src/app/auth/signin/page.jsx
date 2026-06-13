"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { Card, Input, Button } from "@heroui/react";

import {
  Envelope,
  Eye,
  EyeSlash,
  ArrowRightFromSquare,
} from "@gravity-ui/icons";

import { authClient } from "@/lib/auth-client";

const initialSigninForm = {
  email: "",
  password: "",
};

const getAuthErrorMessage = (response) =>
  response?.error?.message || "Something went wrong. Please try again.";

export default function SigninPage() {

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(initialSigninForm);

  const handleChange = (event) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [event.target.name]: event.target.value || "",
    }));
  };

  const handleSignin = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await authClient.signIn.email({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response.error) {
        setError(getAuthErrorMessage(response));
        return;
      }

      setSuccess("Login successful!");
      router.replace("/");
      router.refresh();
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

          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Welcome Back
            </h1>

            <p className="text-gray-400 text-sm mt-2">
              Sign in to continue
            </p>
          </div>

          <form onSubmit={handleSignin} className="space-y-5">

            {/* EMAIL */}
            <div className="w-[90%] mx-auto space-y-2">
              <label className="text-sm text-gray-300">
                Email
              </label>

              <div className="relative">
                <Envelope className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />

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
              <label className="text-sm text-gray-300">
                Password
              </label>

              <div className="relative">
                <Input
                  required
                  minLength={8}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full pr-10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                >
                  {showPassword ? (
                    <EyeSlash className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
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
                Sign In
              </Button>
            </div>
          </form>

          {/* FOOTER */}
          <div className="text-center mt-6 text-sm text-gray-400">
            Don&apos;t have an account?{" "}

            <Link
              href="/auth/signup"
              className="text-white inline-flex items-center gap-1 hover:underline"
            >
              Create Account

              <ArrowRightFromSquare className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

