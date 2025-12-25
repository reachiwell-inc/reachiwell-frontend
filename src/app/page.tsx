"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F3FAF9]">
      {/* Hero Section */}
      <section className="relative w-full bg-[#F3FAF9]">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 w-full relative z-50">
          <div className="flex items-center gap-1">
        <Image
              src="/images/logo-6d6ced.png"
              alt="ReachiWell Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-[#0B2220] text-base font-medium leading-[1.275]">ReachiWell</span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-6 h-6 text-[#000000] z-50"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </header>

        {/* Full Screen Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-[#F3FAF9] z-50 flex flex-col">
            {/* Menu Header with Logo and Close Button */}
            <div className="flex items-center justify-between px-6 py-4 w-full">
              <div className="flex items-center gap-1">
                <Image
                  src="/images/logo-6d6ced.png"
                  alt="ReachiWell Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <span className="text-[#0B2220] text-base font-medium leading-[1.275]">ReachiWell</span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-6 h-6 text-[#000000] cursor-pointer"
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col px-6 pt-8">
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-left text-[#0B2220] text-base font-medium leading-[1.275] py-3 hover:text-[#E87954] transition-colors cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("about-us")}
                className="text-left text-[#0B2220] text-base font-medium leading-[1.275] py-3 hover:text-[#E87954] transition-colors cursor-pointer"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection("our-services")}
                className="text-left text-[#0B2220] text-base font-medium leading-[1.275] py-3 hover:text-[#E87954] transition-colors cursor-pointer"
              >
                Our Services
              </button>

              {/* Login and Signup */}
              <div className="mt-auto pb-8 flex flex-col gap-4">
                <a
                  href="#"
                  className="text-[#0B2220] text-base font-medium leading-[1.275] py-3 hover:text-[#E87954] transition-colors"
                >
                  Login
                </a>
                <button className="bg-[#E87954] text-white px-6 py-3 rounded-[30px] text-base font-semibold leading-[1.275] w-full h-[60px] flex items-center justify-center hover:bg-[#d66a45] transition-colors cursor-pointer">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Content */}
        <div className="flex flex-col items-center px-6 pt-[88px]">
          <h1 className="text-[#161818] text-2xl font-semibold leading-[1.275] text-center mb-6 w-[345px]">
            Your AI Health Guide — Fast, Simple, Anywhere
          </h1>
          <p className="text-[#414747] text-base font-normal leading-normal text-center mb-8 w-[345px]">
            Get triaged, find care, and arrange transport in minutes.
          </p>
          <button className="bg-[#E87954] text-white px-6 py-4 rounded-[30px] text-base font-semibold leading-[1.275] w-[344px] h-[60px] flex items-center justify-center">
            Try the Chatbot
          </button>
          
          {/* Phone Mockup - 75% height */}
          <div className="mt-6 w-[345px] h-[500px] overflow-hidden relative">
            <Image
              src="/images/phone-mockup.png"
              alt="ReachiWell App Preview"
              width={345}
              height={714}
              className="w-full h-full object-cover object-top"
              priority
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full bg-[#F3FAF9] py-16">
        <div className="flex flex-col items-center px-6">
          <h2 className="text-[#161818] text-xl font-medium leading-[1.275] text-center mb-2 w-[345px]">
            How It Works
          </h2>
          <p className="text-[#414747] text-base font-normal leading-normal text-center mb-6 w-[345px]">
            Get started with 3 easy steps.
          </p>

          {/* Step 1 */}
          <div className="bg-[#FDFEFD] border border-[#E0EEEC] rounded-[20px] w-[345px] h-[375px] mb-6 flex flex-col items-center pt-8">
            <h3 className="text-[#161818] text-base font-medium leading-[1.275] text-center">Chat with AI</h3>
            <div className="w-[265px] h-[265px] relative mb-4">
              <Image
                src="/images/step1-chat.png"
                alt="Chat with AI"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#FDFEFD] border border-[#E0EEEC] rounded-[20px] w-[345px] h-[375px] mb-6 flex flex-col items-center pt-8">
            <h3 className="text-[#161818] text-base font-medium leading-[1.275] text-center">Get Options</h3>
            <div className="w-[265px] h-[265px] relative mb-4">
              <Image
                src="/images/step2-options.png"
                alt="Get Options"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#FDFEFD] border border-[#E0EEEC] rounded-[20px] w-[345px] h-[375px] flex flex-col items-center pt-8">
            <h3 className="text-[#161818] text-base font-medium leading-[1.275] text-center">Arrange Care</h3>
            <div className="w-[265px] h-[265px] relative mb-4">
              <Image
                src="/images/step3-care.png"
                alt="Arrange Care"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Live Chat Interface Section */}
      <section className="w-full bg-[#FEFEFE] py-16">
        <div className="flex flex-col items-center px-6">
          <h2 className="text-[#161818] text-xl font-medium leading-[1.275] text-center mb-4 w-[345px]">
            Live Chat Interface
          </h2>
          <p className="text-[#414747] text-base font-normal leading-normal text-center mb-10 w-[345px]">
            Our AI chatbot helps you check symptoms, find nearby care, and book rides, all in one chat.
          </p>

          <button className="bg-[#E87954] text-white px-6 py-4 rounded-[30px] text-base font-semibold leading-[1.275] w-[344px] h-[60px] flex items-center justify-center mb-6">
            Start Chat
          </button>

          {/* Features */}
          <div className="w-full max-w-[345px] space-y-6">
            {/* Feature 1 - LockKey icon */}
            <div className="bg-[#F3FAF9] border border-[#E0EEEC] rounded-[20px] p-6 flex flex-col items-start gap-4">
              <div className="w-6 h-6 shrink-0">
                <Image
                  src="/icons/lock-key.svg"
                  alt="Lock Key Icon"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <p className="text-[#0B2220] text-base font-medium leading-[1.275]">Safe, privacy-protected</p>
            </div>

            {/* Feature 2 - ClockClockwise icon */}
            <div className="bg-[#F3FAF9] border border-[#E0EEEC] rounded-[20px] p-6 flex flex-col items-start gap-4">
              <div className="w-6 h-6 shrink-0">
                <Image
                  src="/icons/clock-clockwise.svg"
                  alt="Clock Clockwise Icon"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <p className="text-[#0B2220] text-base font-medium leading-[1.275]">Available 24/7</p>
            </div>

            {/* Feature 3 - Toolbox icon */}
            <div className="bg-[#F3FAF9] border border-[#E0EEEC] rounded-[20px] p-6 mb-10 flex flex-col items-start gap-4">
              <div className="w-6 h-6 shrink-0">
                <Image
                  src="/icons/toolbox.svg"
                  alt="Toolbox Icon"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <p className="text-[#0B2220] text-base font-medium leading-[1.275]">
                Covers multiple services: medical, dental, pharmacy, physiotherapy
              </p>
            </div>

            {/* Chat Image */}
            <div className="max-w-[345px] h-[345px] relative mb-8">
              <Image
                src="/images/chat-interface.png"
                alt="Live Chat Interface"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="w-full bg-[#F9F9F9] py-16">
        <div className="flex flex-col items-center px-6">
          <h2 className="text-[#161818] text-2xl font-medium leading-[1.275] text-center mb-8 w-[345px]">
            About Us
          </h2>

          <div className="w-full max-w-[345px] space-y-6">
            {/* Mission */}
            <div className="bg-[#F3FAF9] border border-[#E0EEEC] rounded-[20px] p-6">
              <h3 className="text-[#0B2220] text-base font-medium leading-[1.275] mb-4">Mission</h3>
              <p className="text-[#414747] text-base font-normal leading-normal">
                Making healthcare access and navigation effortless
              </p>
            </div>

            {/* The Problem */}
            <div className="bg-[#F3FAF9] border border-[#E0EEEC] rounded-[20px] p-6">
              <h3 className="text-[#0B2220] text-base font-medium leading-[1.275] mb-4">The Problem</h3>
              <p className="text-[#414747] text-base font-normal leading-normal">
                Long wait times, closures, underserved areas
              </p>
            </div>

            {/* Our Solution */}
            <div className="bg-[#F3FAF9] border border-[#E0EEEC] rounded-[20px] p-6">
              <h3 className="text-[#0B2220] text-base font-medium leading-[1.275] mb-4">Our Solution</h3>
              <p className="text-[#414747] text-base font-normal leading-normal">
                AI-powered triage + transport coordination
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section id="our-services" className="w-full bg-[#F9F9F9] py-16">
        <div className="flex flex-col items-center px-6">
          <h2 className="text-[#161818] text-2xl font-medium leading-[1.275] text-center mb-8 w-[345px]">
            Our Services
          </h2>

          <div className="w-full max-w-[345px] space-y-6">
            {/* For Patients */}
            <div className="bg-[#F3FAF9] border border-[#E0EEEC] rounded-[20px] p-6">
              <div className="flex flex-col gap-2 mb-4">
                <div className="w-6 h-6">
                  <Image
                    src="/icons/users-three.svg"
                    alt="Users Three Icon"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-[#0B2220] text-base font-medium leading-[1.275]">For Patients</h3>
              </div>
              <p className="text-[#414747] text-base font-normal leading-normal">
                AI triage, care navigation, transport coordination
              </p>
            </div>

            {/* For Providers */}
            <div className="bg-[#F3FAF9] border border-[#E0EEEC] rounded-[20px] p-6">
              <div className="flex flex-col gap-2 mb-4">
                <div className="w-6 h-6">
                  <Image
                    src="/icons/asclepius.svg"
                    alt="Asclepius Icon"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-[#0B2220] text-base font-medium leading-[1.275]">For Providers</h3>
              </div>
              <p className="text-[#414747] text-base font-normal leading-normal mb-4">
                Reduce no-shows, connect to rural patients
              </p>
              <button className="flex items-center gap-1 text-[#E87954] text-base font-medium">
                Request a Demo
                <Image
                  src="/icons/arrow-up-right.svg"
                  alt="Arrow Up Right"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </button>
            </div>

            {/* For Partners */}
            <div className="bg-[#F3FAF9] border border-[#E0EEEC] rounded-[20px] p-6">
              <div className="flex flex-col gap-2 mb-4">
                <div className="w-6 h-6">
                  <Image
                    src="/icons/handshake.svg"
                    alt="Handshake Icon"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-[#0B2220] text-base font-medium leading-[1.275]">For Partners</h3>
              </div>
              <p className="text-[#414747] text-base font-normal leading-normal mb-4">
                Expand your reach with ReachiWell
              </p>
              <button className="flex items-center gap-1 text-[#E87954] text-base font-medium">
                Request a Demo
                <Image
                  src="/icons/arrow-up-right.svg"
                  alt="Arrow Up Right"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </button>
            </div>

            {/* CTA Card */}
            <div className="bg-[#E0EEEC] border border-[#E0EEEC] rounded-[20px] px-6 py-10">
              <h3 className="text-[#0B2220] text-2xl font-medium text-center leading-[1.275] mb-4">
                Be Part of the Future of Care Access.
              </h3>
              <p className="text-[#414747] text-base font-normal text-center leading-normal mb-10">
                Help us shape smarter, faster healthcare navigation for everyone.
              </p>
              <div className="flex flex-col gap-4">
                <button className="bg-[#E87954] text-white px-6 py-4 rounded-[30px] text-base font-semibold leading-[1.275] w-full h-[60px] flex items-center justify-center">
                  Start Chat
                </button>
                <button className="border-[1.5px] border-[#E87954] text-[#E87954] px-6 py-4 rounded-[30px] text-base font-semibold leading-[1.275] w-full h-[60px] flex items-center justify-center">
                  Request a Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#1B5550] py-10 px-6">
        <div className="flex flex-col items-start max-w-[345px] mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-[14px]">
            <Image
              src="/images/logo-6d6ced.png"
              alt="ReachiWell Logo"
              width={64}
              height={64}
              className="object-contain"
            />
            <span className="text-[#F9F9F9] text-[25.6px] font-medium leading-[1.275]">ReachiWell</span>
          </div>

          <p className="text-[#F9F9F9] text-base font-normal leading-[1.275] mb-10">
            Find Care. Get Help. Feel Supported.
          </p>

          <div className="flex flex-col gap-4 mb-[71px]">
            <button className="bg-[#FF8968] text-white px-6 py-4 rounded-[30px] text-base font-semibold leading-[1.275] w-[345px] h-[60px] flex items-center justify-center">
              Start Chat
            </button>
            <button className="border-[1.5px] border-[#FF8968] text-[#FF8968] px-6 py-4 rounded-[30px] text-base font-semibold leading-[1.275] w-[345px] h-[60px] flex items-center justify-center">
              Request a Demo
            </button>
          </div>

          <h4 className="text-[#C2D6D4] text-base font-normal leading-[1.275] mb-4">CONTACT US</h4>
          <p className="text-[#F3FAF9] text-base font-medium leading-[1.275] mb-2">info@reachiwell.ca</p>
          <p className="text-[#F3FAF9] text-base font-medium leading-[1.275] mb-10">+1 (204) 557 8214</p>

          {/* Divider */}
          <div className="w-full h-[1.5px] bg-[#F3FAF9] mb-8"></div>

          <p className="text-[#F3FAF9] text-base font-medium leading-[1.275] text-center w-full mb-6">
            © 2025 ReachiWell. All rights reserved.
          </p>
          
          <p className="text-[#F3FAF9] text-base font-medium leading-normal text-center mb-4">
            ReachiWell is not a healthcare provider and does not provide medical diagnoses, treatment, or professional medical advice. Our platform is intended to help users in British Columbia and across Canada find and access healthcare services, including clinics, pharmacies, and transportation support. The information provided through ReachiWell is for general guidance only and should not replace consultation with a licensed healthcare professional in Canada. Always seek the advice of a qualified healthcare provider regarding any medical condition or health-related questions.
          </p>

        </div>
      </footer>
    </div>
  );
}
