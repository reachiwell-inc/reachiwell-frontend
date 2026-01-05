"use client";

import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  scrollToSection: (sectionId: string) => void;
}

export default function Header({ isMenuOpen, setIsMenuOpen, scrollToSection }: HeaderProps) {
  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 w-full relative z-50">
        <Link href="/" className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
          <Image
            src="/images/reachiwell-logo.png"
            alt="ReachiWell Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-[#0B2220] text-base font-medium leading-[1.275]">ReachiWell</span>
        </Link>
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
            <Link href="/" className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setIsMenuOpen(false)}>
              <Image
                src="/images/reachiwell-logo.png"
                alt="ReachiWell Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-[#0B2220] text-base font-medium leading-[1.275]">ReachiWell</span>
            </Link>
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
                href="/login"
                className="text-[#0B2220] text-base font-medium leading-[1.275] py-3 hover:text-[#E87954] transition-colors"
              >
                Login
              </a>
              <a
                href="/create-account"
                className="bg-[#E87954] text-white px-6 py-3 rounded-[30px] text-base font-semibold leading-[1.275] w-full h-[60px] flex items-center justify-center hover:bg-[#d66a45] transition-colors cursor-pointer"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

