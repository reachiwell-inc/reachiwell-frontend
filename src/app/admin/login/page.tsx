"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = useMemo(() => {
    const n = (searchParams?.get("next") || "").trim();
    if (!n) return "/admin";
    // basic safety: only allow internal paths
    if (!n.startsWith("/")) return "/admin";
    return n;
  }, [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json?.error || json?.message || "Login failed. Please try again.");
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-[460px] flex flex-col items-center">
        <div className="flex items-center gap-2 mb-8">
          <Image
            src="/images/reachiwell-logo.png"
            alt="ReachiWell Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-[#161818] text-lg font-medium leading-[1.275]">ReachiWell</span>
        </div>

        <div className="w-full bg-white border border-[#E0EEEC] rounded-2xl px-6 py-8 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <h1 className="text-[#161818] text-xl font-semibold leading-[1.275] text-center">
            Login to Reachiwell Admin
          </h1>
          <p className="text-[#6B7280] text-sm leading-normal text-center mt-2">
            Enter the required credentials below
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[#161818] text-sm font-medium leading-normal">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-5 py-4 rounded-xl border border-[#C2D6D4] bg-white text-[#0B2220] text-base font-normal focus:outline-none focus:border-[#2D8E86] focus:ring-2 focus:ring-[#2D8E86]/20 placeholder:text-[#9CA3AF]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-[#161818] text-sm font-medium leading-normal">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-5 py-4 pr-14 rounded-xl border border-[#C2D6D4] bg-white text-[#0B2220] text-base font-normal focus:outline-none focus:border-[#2D8E86] focus:ring-2 focus:ring-[#2D8E86]/20 placeholder:text-[#9CA3AF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10 3.75C5.83333 3.75 2.27417 6.34167 0.833328 10C2.27417 13.6583 5.83333 16.25 10 16.25C14.1667 16.25 17.7258 13.6583 19.1667 10C17.7258 6.34167 14.1667 3.75 10 3.75ZM10 14.1667C7.69917 14.1667 5.83333 12.3008 5.83333 10C5.83333 7.69917 7.69917 5.83333 10 5.83333C12.3008 5.83333 14.1667 7.69917 14.1667 10C14.1667 12.3008 12.3008 14.1667 10 14.1667ZM10 7.5C8.61917 7.5 7.5 8.61917 7.5 10C7.5 11.3808 8.61917 12.5 10 12.5C11.3808 12.5 12.5 11.3808 12.5 10C12.5 8.61917 11.3808 7.5 10 7.5Z"
                          fill="#161818"
                        />
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5.05499 3.24563C4.98913 3.17138 4.90918 3.11095 4.81979 3.06783C4.7304 3.02471 4.63334 2.99976 4.53423 2.99443C4.43513 2.9891 4.33595 3.00349 4.24245 3.03677C4.14895 3.07005 4.06298 3.12156 3.98953 3.18831C3.91608 3.25506 3.85661 3.33572 3.81457 3.42562C3.77252 3.51552 3.74874 3.61288 3.7446 3.71204C3.74045 3.8112 3.75603 3.9102 3.79043 4.00329C3.82483 4.09639 3.87737 4.18173 3.94499 4.25438L5.74874 6.23906C2.34374 8.32875 0.879366 11.55 0.814679 11.6963C0.772035 11.7922 0.75 11.896 0.75 12.0009C0.75 12.1059 0.772035 12.2097 0.814679 12.3056C0.847491 12.3797 1.64155 14.1403 3.40687 15.9056C5.75905 18.2569 8.72999 19.5 12 19.5C13.6806 19.5096 15.3442 19.1636 16.8816 18.4847L18.9441 20.7544C19.0099 20.8286 19.0899 20.8891 19.1793 20.9322C19.2686 20.9753 19.3657 21.0002 19.4648 21.0056C19.5639 21.0109 19.6631 20.9965 19.7566 20.9632C19.8501 20.93 19.9361 20.8784 20.0095 20.8117C20.083 20.7449 20.1424 20.6643 20.1845 20.5744C20.2265 20.4845 20.2503 20.3871 20.2544 20.288C20.2586 20.1888 20.243 20.0898 20.2086 19.9967C20.1742 19.9036 20.1217 19.8183 20.0541 19.7456L5.05499 3.24563ZM12 18C9.11437 18 6.59343 16.9509 4.50655 14.8828C3.64997 14.0315 2.92145 13.0605 2.34374 12C2.78343 11.1759 4.18687 8.86969 6.7828 7.37063L15.8194 17.3034C14.6006 17.771 13.3053 18.0072 12 18Z"
                          fill="#161818"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#E87954] text-white px-6 py-4 rounded-full text-base font-semibold leading-[1.275] w-full h-[56px] flex items-center justify-center hover:bg-[#d66a45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-6 py-10">
          <div className="text-[#414747] text-base">Loading...</div>
        </div>
      }
    >
      <AdminLoginInner />
    </Suspense>
  );
}

