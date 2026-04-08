"use client";

import { useState } from "react";
import Header from "@/components/Header";

export default function EarlyAccessPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMenuOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    setIsSubmitted(true);
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFirstName("");
      setLastName("");
      setEmail("");
    }, 3000);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full bg-white">
        <Header 
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          scrollToSection={scrollToSection}
        />

        {/* Early Access Content */}
        <div className="flex flex-col items-center px-6 pt-[88px] pb-16">
          <h1 className="text-[#161818] text-2xl font-semibold leading-[1.275] mb-4 w-full max-w-[345px]">
            Get Early Access
          </h1>
          <p className="text-[#414747] text-base font-normal leading-normal mb-8 w-full max-w-[345px]">
            Be among the first to try AI-powered healthcare guidance
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-[344px]">
            <div className="flex flex-col gap-6">
              {/* First Name Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-[#0B2220] text-base font-normal leading-normal">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  required
                  className="w-full px-6 py-4 rounded-[30px] border border-[#E0EEEC] bg-white text-[#0B2220] text-base font-normal focus:outline-none focus:border-[#E87954] focus:ring-2 focus:ring-[#E87954]/20 placeholder:text-[#9CA3AF]"
                />
              </div>

              {/* Last Name Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="text-[#0B2220] text-base font-normal leading-normal">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  required
                  className="w-full px-6 py-4 rounded-[30px] border border-[#E0EEEC] bg-white text-[#0B2220] text-base font-normal focus:outline-none focus:border-[#E87954] focus:ring-2 focus:ring-[#E87954]/20 placeholder:text-[#9CA3AF]"
                />
              </div>

              {/* Email Address Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[#0B2220] text-base font-normal leading-normal">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-6 py-4 rounded-[30px] border border-[#E0EEEC] bg-white text-[#0B2220] text-base font-normal focus:outline-none focus:border-[#E87954] focus:ring-2 focus:ring-[#E87954]/20 placeholder:text-[#9CA3AF]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#E87954] text-white px-6 py-4 rounded-[30px] text-base font-semibold leading-[1.275] w-full h-[60px] flex items-center justify-center hover:bg-[#d66a45] transition-colors mt-4"
              >
                {isSubmitted ? "Thank You!" : "Join the Beta"}
              </button>
            </div>
          </form>

          {isSubmitted && (
            <p className="text-[#2D8E86] text-sm font-medium text-center mt-4">
              We&apos;ll be in touch soon!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

