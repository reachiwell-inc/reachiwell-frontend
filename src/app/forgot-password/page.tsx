"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMenuOpen(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await forgotPassword({ email });

      if (response.success) {
        // Redirect to forgot password verify code page on success
        router.push("/forgot-password-verify-code");
      } else {
        setError(response.error || response.message || "Failed to send password reset email. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F3FAF9]">
      {/* Hero Section */}
      <section className="relative w-full bg-[#F3FAF9]">
        <Header 
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          scrollToSection={scrollToSection}
        />

        {/* Forgot Password Content */}
        <div className="flex flex-col items-center px-6 pt-[88px] pb-16">
          <h1 className="text-[#161818] text-2xl font-semibold leading-[1.275] mb-4 w-full max-w-[345px]">
            Forgot Password
          </h1>
          <p className="text-[#414747] text-base font-normal leading-normal mb-8 w-full max-w-[345px]">
            Enter your email to reset your password.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-[344px]">
            <div className="flex flex-col gap-6">
              {/* Email Address Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[#161818] text-base font-normal leading-normal">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(""); // Clear error when user types
                  }}
                  placeholder="Email address"
                  required
                  className={`w-full px-6 py-4 rounded-[30px] border text-[#0B2220] text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#E87954]/20 placeholder:text-[#9CA3AF] ${
                    error ? "border-red-500 focus:border-red-500" : "border-[#C2D6D4] focus:border-[#E87954]"
                  }`}
                />
                {error && (
                  <p className="text-red-500 text-sm font-normal mt-1">{error}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#E87954] text-white px-6 py-4 rounded-[30px] text-base font-semibold leading-[1.275] w-full h-[60px] flex items-center justify-center hover:bg-[#d66a45] transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Reset password"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

