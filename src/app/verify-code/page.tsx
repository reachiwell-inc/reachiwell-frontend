"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";

export default function VerifyCodePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [codes, setCodes] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMenuOpen(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }
    
    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const digits = pastedData.split("").filter(char => /^\d$/.test(char));
    
    if (digits.length > 0) {
      const newCodes = [...codes];
      digits.forEach((digit, i) => {
        if (i < 6) {
          newCodes[i] = digit;
        }
      });
      setCodes(newCodes);
      
      // Focus the last filled input or the first empty one
      const lastFilledIndex = Math.min(digits.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = codes.join("");
    if (code.length === 6) {
      // Handle form submission here
      setIsSubmitted(true);
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setCodes(["", "", "", "", "", ""]);
      }, 3000);
    }
  };

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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
            Check your email.
          </h1>
          <p className="text-[#414747] text-base font-normal leading-normal mb-2 w-full max-w-[345px]">
            Enter the verification code sent to your email.
          </p>
          <p className="text-[#414747] text-base font-normal leading-normal mb-8 w-full max-w-[345px]">
            Please be sure to check your spam folder.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-[344px]">
            <div className="flex flex-col gap-6">
              {/* Verification Code Inputs */}
              <div className="flex gap-3 justify-center mb-4">
                {codes.map((code, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={code}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-[#0B2220] text-xl font-semibold rounded-lg border border-[#C2D6D4] bg-white focus:outline-none focus:border-[#E87954] focus:ring-2 focus:ring-[#E87954]/20"
                  />
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={codes.join("").length !== 6}
                className="bg-[#E87954] text-white px-6 py-4 rounded-[30px] text-base font-semibold leading-[1.275] w-full h-[60px] flex items-center justify-center hover:bg-[#d66a45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isSubmitted ? "Verified!" : "Reset password"}
              </button>
            </div>
          </form>

          {isSubmitted && (
            <p className="text-[#2D8E86] text-sm font-medium text-center mt-4">
              Code verified successfully!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

