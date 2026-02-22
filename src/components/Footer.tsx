import Image from "next/image";
import StartChatButton from "@/components/StartChatButton";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1B5550] px-6 py-10 md:px-20 md:py-14">
      <div className="mx-auto w-full max-w-[345px] md:max-w-[1200px]">
        {/* Top content */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-10">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2.5 mb-[14px]">
              <Image
                src="/images/reachiwell-logo.png"
                alt="ReachiWell Logo"
                width={64}
                height={64}
                className="object-contain"
              />
              <span className="text-[#F9F9F9] text-[25.6px] font-medium leading-[1.275]">
                ReachiWell
              </span>
            </div>

            <p className="text-[#F9F9F9] text-base font-normal leading-[1.275] mb-10 md:mb-0">
              Find Care. Get Help. Feel Supported.
            </p>

            {/* Mobile-only CTAs */}
            <div className="flex flex-col gap-4 mb-[71px] md:hidden">
              <StartChatButton className="bg-[#FF8968] text-white px-6 py-4 rounded-[30px] text-base font-semibold leading-[1.275] w-[345px] h-[60px] flex items-center justify-center">
                Start Chat
              </StartChatButton>
              <button className="border-[1.5px] border-[#FF8968] text-[#FF8968] px-6 py-4 rounded-[30px] text-base font-semibold leading-[1.275] w-[345px] h-[60px] flex items-center justify-center">
                Request a Demo
              </button>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-start md:items-end md:pt-1">
            <h4 className="text-[#C2D6D4] text-base font-normal leading-[1.275] mb-4 md:mb-2 md:text-[13px] md:tracking-[0.08em]">
              CONTACT US
            </h4>
            <p className="text-[#F3FAF9] text-base font-medium leading-[1.275] mb-6 md:mb-4">
              info@reachiwell.ca
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 mb-8 md:mb-0">
              <a
                href="https://www.instagram.com/reachiwell"
                target="_blank"
                rel="noreferrer noopener"
                className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <Image
                  src="/icons/instagram-icon.svg"
                  alt="Instagram"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </a>

              <a
                href="https://www.linkedin.com/company/reachiwell/"
                target="_blank"
                rel="noreferrer noopener"
                className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="LinkedIn"
              >
                <Image
                  src="/icons/linkedin-icon.svg"
                  alt="LinkedIn"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </a>

              <a
                href="https://x.com/reachiwell"
                target="_blank"
                rel="noreferrer noopener"
                className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="X (Twitter)"
              >
                <Image
                  src="/icons/x-icon.svg"
                  alt="X"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </a>

              <a
                href="https://www.facebook.com/people/ReachiWell-Inc/61578907934731/"
                target="_blank"
                rel="noreferrer noopener"
                className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <Image
                  src="/icons/facebook-icon.svg"
                  alt="Facebook"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1.5px] bg-[#F3FAF9] my-8 md:my-10" />

        {/* Legal */}
        <div className="text-center text-[#F3FAF9]">
          <p className="text-base font-medium leading-[1.275] mb-4 md:mb-3 md:text-[14px]">
            © {new Date().getFullYear()} ReachiWell. All rights reserved.
          </p>

          <p className="mx-auto text-base font-medium leading-normal md:text-[14px] mb-3 md:mb-2 max-w-[820px]">
            ReachiWell is a financial technology company, not a bank.
          </p>

          <p className="mx-auto text-base font-medium leading-normal md:text-[14px] max-w-[820px]">
            All banking services are provided by our licensed banking partners. ReachiWell is not a
            healthcare provider and does not provide medical diagnoses, treatment, or professional
            medical advice. Our platform is intended to help users in British Columbia and across
            Canada find and access healthcare services, including clinics, pharmacies, and
            transportation support. The information provided through ReachiWell is for general
            guidance only and should not replace consultation with a licensed healthcare
            professional in Canada.
          </p>
        </div>
      </div>
    </footer>
  );
}

