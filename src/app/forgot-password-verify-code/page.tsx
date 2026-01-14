"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import VerifyCode from "@/components/VerifyCode";
import { validateResetCode } from "@/lib/api";

export default function ForgotPasswordVerifyCodePage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMenuOpen(false);
    }
  };

  const handleVerify = async (code: string) => {
    const response = await validateResetCode({ passwordResetCode: code });
    
    if (response.success) {
      // Store reset code in localStorage and redirect to reset password page
      localStorage.setItem("passwordResetCode", code);
      setTimeout(() => {
        router.push(`/reset-password?code=${code}`);
      }, 1000);
    }
    
    return {
      success: response.success,
      error: response.error,
      message: response.message,
    };
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

        {/* Verify Code Content */}
        <div className="flex flex-col items-center px-6 pt-[88px] pb-16">
          <h1 className="text-[#161818] text-2xl font-semibold leading-[1.275] mb-4 w-full max-w-[345px]">
            Verify your email.
          </h1>
          <p className="text-[#414747] text-base font-normal leading-normal mb-2 w-full max-w-[345px]">
            Enter the verification code sent to your email.
          </p>
          <p className="text-[#414747] text-base font-normal leading-normal mb-8 w-full max-w-[345px]">
            Please be sure to check your spam folder.
          </p>

          <VerifyCode
            buttonText="Submit"
            onSubmit={handleVerify}
            successMessage="Code verified successfully! Redirecting..."
          />
        </div>
      </section>
    </div>
  );
}

