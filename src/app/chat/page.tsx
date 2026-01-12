"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";

export default function ChatPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("LO");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check for authentication token and redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setIsCheckingAuth(false);
  }, [router]);

  // Get user initials from localStorage
  useEffect(() => {
    const firstName = localStorage.getItem("userFirstName") || "";
    const lastName = localStorage.getItem("userLastName") || "";
    if (firstName && lastName) {
      const initials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
      setUserInitials(initials);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // No token, just clear storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("userFirstName");
      localStorage.removeItem("userLastName");
      router.push("/login");
      return;
    }

    setIsLoggingOut(true);
    try {
      await logout(token);
    } catch (error) {
      // Even if logout fails, clear local storage and redirect
      console.error("Logout error:", error);
    } finally {
      // Clear all stored data
      localStorage.removeItem("token");
      localStorage.removeItem("userFirstName");
      localStorage.removeItem("userLastName");
      setIsLoggingOut(false);
      router.push("/login");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle message submission here
    setMessage("");
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-white items-center justify-center">
        <div className="text-[#0B2220] text-base font-normal">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 w-full border-b border-[#E0EEEC]">
        <div className="flex items-center gap-1">
          <Image
            src="/images/reachiwell-logo.png"
            alt="ReachiWell Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-[#0B2220] text-base font-medium leading-[1.275]">ReachiWell</span>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full bg-[#F3FAF9] border border-[#E0EEEC] flex items-center justify-center text-[#0B2220] text-sm font-medium hover:bg-[#E0EEEC] transition-colors"
            aria-label="User menu"
          >
            {userInitials}
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E0EEEC] z-50">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full px-4 py-3 text-left text-[#0B2220] text-base font-normal hover:bg-[#F3FAF9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-[120px]">
        <div className="flex flex-col items-center max-w-[345px] mx-auto">
          {/* Greeting */}
          <h1 className="text-[#333333] text-2xl font-medium leading-[1.275] mb-3 text-center">
            Hi, there!
          </h1>
          <h2 className="text-[#333333] text-xl leading-[1.275] mb-4 text-center">
            I&apos;m ReachiBot, your health guide.
          </h2>
          <p className="text-[#4F4F4F] text-base font-normal leading-normal mb-8 text-center">
            I can help you check your symptoms, find the right care nearby, and even arrange a ride to get you there. Let&apos;s get started!
          </p>

          {/* Action Buttons */}
          <div className="w-full space-y-4 mb-8">
            <button 
              onClick={() => router.push("/chat/check-symptoms")}
              className="w-full bg-[#E0EEEC] text-[#545858] px-6 py-4 rounded-full text-base font-medium leading-[1.275] flex items-center justify-between hover:bg-[#D0DEDC] transition-colors active:bg-[#C0CECC]"
            >
              <span>Check my symptoms</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="w-full bg-[#E0EEEC] text-[#545858] px-6 py-4 rounded-full text-base font-medium leading-[1.275] flex items-center justify-between hover:bg-[#D0DEDC] transition-colors active:bg-[#C0CECC]">
              <span>Find a service</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="w-full bg-[#E0EEEC] text-[#545858] px-6 py-4 rounded-full text-base font-medium leading-[1.275] flex items-center justify-between hover:bg-[#D0DEDC] transition-colors active:bg-[#C0CECC]">
              <span>Talk to a human</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Input Field - Fixed 64px from bottom */}
      <div className="px-6 pb-[64px]">
        <div className="max-w-[345px] mx-auto">
          <form onSubmit={handleSubmit} className="w-full relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me a question"
              className="w-full px-6 py-4 pr-14 rounded-[30px] border border-[#E0EEEC] bg-white text-[#0B2220] text-base font-normal focus:outline-none focus:border-[#2D8E86] focus:ring-2 focus:ring-[#2D8E86]/20 placeholder:text-[#9CA3AF]"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center cursor-pointer"
              aria-label="Send message"
            >
              <Image
                src="/icons/send-message.svg"
                alt="Send Message Icon"
                width={40}
                height={40}
                className="object-contain"
              />
            </button>
          </form>
        </div>
      </div>

      
    </div>
  );
}

