"use client";

import { useState } from "react";
import Header from "@/components/Header";

export default function CreateAccountPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");
    }, 3000);
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

        {/* Create Account Content */}
        <div className="flex flex-col items-center px-6 pt-[88px] pb-16">
          <h1 className="text-[#161818] text-2xl font-semibold leading-[1.275] mb-4 w-full max-w-[345px]">
            Create Your Account
          </h1>
          <p className="text-[#414747] text-base font-normal leading-normal mb-4 w-full max-w-[345px]">
            Get started with ReachiBot and access care guidance anytime, anywhere.
          </p>
          
          {/* Login Link */}
          <div className="w-full max-w-[345px] mb-8">
            <p className="text-[#414747] text-base font-normal leading-normal">
              Already have an account?{" "}
              <a href="#" className="text-[#E87954] font-medium hover:underline">
                Log in
              </a>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-[344px]">
            <div className="flex flex-col gap-6">
              {/* First Name Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-[#161818] text-base font-normal leading-normal">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-6 py-4 rounded-[30px] border border-[#C2D6D4] text-[#0B2220] text-base font-normal focus:outline-none focus:border-[#E87954] focus:ring-2 focus:ring-[#E87954]/20 placeholder:text-[#9CA3AF]"
                />
              </div>

              {/* Last Name Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="text-[#161818] text-base font-normal leading-normal">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-6 py-4 rounded-[30px] border border-[#C2D6D4] text-[#0B2220] text-base font-normal focus:outline-none focus:border-[#E87954] focus:ring-2 focus:ring-[#E87954]/20 placeholder:text-[#9CA3AF]"
                />
              </div>

              {/* Email Address Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[#161818] text-base font-normal leading-normal">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-6 py-4 rounded-[30px] border border-[#C2D6D4] text-[#0B2220] text-base font-normal focus:outline-none focus:border-[#E87954] focus:ring-2 focus:ring-[#E87954]/20 placeholder:text-[#9CA3AF]"
                />
              </div>

              {/* Phone Number Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="phoneNumber" className="text-[#161818] text-base font-normal leading-normal">
                  Phone number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                  className="w-full px-6 py-4 rounded-[30px] border border-[#C2D6D4] text-[#0B2220] text-base font-normal focus:outline-none focus:border-[#E87954] focus:ring-2 focus:ring-[#E87954]/20 placeholder:text-[#9CA3AF]"
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-[#161818] text-base font-normal leading-normal">
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
                    className="w-full px-6 py-4 pr-14 rounded-[30px] border border-[#C2D6D4] text-[#0B2220] text-base font-normal focus:outline-none focus:border-[#E87954] focus:ring-2 focus:ring-[#E87954]/20 placeholder:text-[#9CA3AF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3.75C5.83333 3.75 2.27417 6.34167 0.833328 10C2.27417 13.6583 5.83333 16.25 10 16.25C14.1667 16.25 17.7258 13.6583 19.1667 10C17.7258 6.34167 14.1667 3.75 10 3.75ZM10 14.1667C7.69917 14.1667 5.83333 12.3008 5.83333 10C5.83333 7.69917 7.69917 5.83333 10 5.83333C12.3008 5.83333 14.1667 7.69917 14.1667 10C14.1667 12.3008 12.3008 14.1667 10 14.1667ZM10 7.5C8.61917 7.5 7.5 8.61917 7.5 10C7.5 11.3808 8.61917 12.5 10 12.5C11.3808 12.5 12.5 11.3808 12.5 10C12.5 8.61917 11.3808 7.5 10 7.5Z" fill="#9CA3AF"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 2.5L17.5 17.5M8.15833 8.15833C7.84167 8.475 7.5 9.20833 7.5 10C7.5 11.3808 8.61917 12.5 10 12.5C10.7917 12.5 11.525 12.1583 11.8417 11.8417M5.10833 5.10833C3.83333 6.01667 2.84167 7.18333 2.19167 8.51667C2.01667 8.875 2.01667 9.125 2.19167 9.48333C2.27417 9.65833 2.35833 9.825 2.45 9.99167M7.5 3.33333C8.08333 3.19167 8.66667 3.125 10 3.125C14.1667 3.125 17.7258 5.71667 19.1667 9.375C18.8083 10.2583 18.3333 11.0833 17.7583 11.8333M13.325 13.325C12.2583 13.9917 11.0083 14.375 9.58333 14.375C5.41667 14.375 1.8575 11.7833 0.416672 8.125C0.833339 7.01667 1.41667 6.00833 2.13333 5.13333" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-[#161818] text-base font-normal leading-normal">
                  Confirm your password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="w-full px-6 py-4 pr-14 rounded-[30px] border border-[#C2D6D4] text-[#0B2220] text-base font-normal focus:outline-none focus:border-[#E87954] focus:ring-2 focus:ring-[#E87954]/20 placeholder:text-[#9CA3AF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3.75C5.83333 3.75 2.27417 6.34167 0.833328 10C2.27417 13.6583 5.83333 16.25 10 16.25C14.1667 16.25 17.7258 13.6583 19.1667 10C17.7258 6.34167 14.1667 3.75 10 3.75ZM10 14.1667C7.69917 14.1667 5.83333 12.3008 5.83333 10C5.83333 7.69917 7.69917 5.83333 10 5.83333C12.3008 5.83333 14.1667 7.69917 14.1667 10C14.1667 12.3008 12.3008 14.1667 10 14.1667ZM10 7.5C8.61917 7.5 7.5 8.61917 7.5 10C7.5 11.3808 8.61917 12.5 10 12.5C11.3808 12.5 12.5 11.3808 12.5 10C12.5 8.61917 11.3808 7.5 10 7.5Z" fill="#9CA3AF"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 2.5L17.5 17.5M8.15833 8.15833C7.84167 8.475 7.5 9.20833 7.5 10C7.5 11.3808 8.61917 12.5 10 12.5C10.7917 12.5 11.525 12.1583 11.8417 11.8417M5.10833 5.10833C3.83333 6.01667 2.84167 7.18333 2.19167 8.51667C2.01667 8.875 2.01667 9.125 2.19167 9.48333C2.27417 9.65833 2.35833 9.825 2.45 9.99167M7.5 3.33333C8.08333 3.19167 8.66667 3.125 10 3.125C14.1667 3.125 17.7258 5.71667 19.1667 9.375C18.8083 10.2583 18.3333 11.0833 17.7583 11.8333M13.325 13.325C12.2583 13.9917 11.0083 14.375 9.58333 14.375C5.41667 14.375 1.8575 11.7833 0.416672 8.125C0.833339 7.01667 1.41667 6.00833 2.13333 5.13333" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#E87954] text-white px-6 py-4 rounded-[30px] text-base font-semibold leading-[1.275] w-full h-[60px] flex items-center justify-center hover:bg-[#d66a45] transition-colors mt-10"
              >
                {isSubmitted ? "Account Created!" : "Create account"}
              </button>
            </div>
          </form>

          {isSubmitted && (
            <p className="text-[#2D8E86] text-sm font-medium text-center mt-4">
              Welcome to ReachiWell!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

