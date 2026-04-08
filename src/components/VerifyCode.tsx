"use client";

import { useState, useRef, useEffect } from "react";

interface VerifyCodeProps {
  buttonText: string;
  onSubmit: (code: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  onSuccess?: () => void;
  successMessage?: string;
  codeLength?: number;
}

export default function VerifyCode({
  buttonText,
  onSubmit,
  onSuccess,
  successMessage = "Verification successful!",
  codeLength = 6,
}: VerifyCodeProps) {
  const [codes, setCodes] = useState<string[]>(Array(codeLength).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    if (value && index < codeLength - 1) {
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
    const pastedData = e.clipboardData.getData("text").slice(0, codeLength);
    const digits = pastedData.split("").filter(char => /^\d$/.test(char));
    
    if (digits.length > 0) {
      const newCodes = [...codes];
      digits.forEach((digit, i) => {
        if (i < codeLength) {
          newCodes[i] = digit;
        }
      });
      setCodes(newCodes);
      
      // Focus the last filled input or the first empty one
      const lastFilledIndex = Math.min(digits.length - 1, codeLength - 1);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = codes.join("");
    
    if (code.length !== codeLength) {
      setError(`Please enter the complete ${codeLength}-digit code`);
      return;
    }

    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await onSubmit(code);

      if (response.success) {
        setSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.error || response.message || "Verification failed. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[30px] text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-[30px] text-sm">
            {successMessage}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={codes.join("").length !== codeLength || isLoading}
          className="bg-[#E87954] text-white px-6 py-4 rounded-[30px] text-base font-semibold leading-[1.275] w-full h-[60px] flex items-center justify-center hover:bg-[#d66a45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isLoading ? "Verifying..." : success ? "Verified!" : buttonText}
        </button>
      </div>
    </form>
  );
}

