import Image from "next/image";

export default function Footer() {
  return (
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
  );
}

