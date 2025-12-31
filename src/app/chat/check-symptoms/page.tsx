"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckSymptomsPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const symptoms = [
    "Tooth pain",
    "Fever",
    "Cough",
    "Sore throat",
    "Anxiety/stress",
    "Medication refill"
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  // Get the input value: selected symptoms + any typed text
  const getInputValue = () => {
    if (selectedSymptoms.length > 0) {
      // Join with comma, no comma after the last one
      const symptomsText = selectedSymptoms.join(", ");
      // If user has typed something additional, append it
      if (message && !selectedSymptoms.some(s => message.includes(s))) {
        return `${symptomsText} ${message}`;
      }
      return symptomsText;
    }
    return message;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Build the expected selected symptoms text (comma-separated, no comma after last)
    const expectedSelectedText = selectedSymptoms.join(", ");
    
    // If the input starts with selected symptoms, extract the new typed part
    if (selectedSymptoms.length > 0 && newValue.startsWith(expectedSelectedText)) {
      const typedPart = newValue.slice(expectedSelectedText.length).trim();
      setMessage(typedPart);
    } else {
      // User is editing the whole field or no symptoms selected
      setMessage(newValue);
      // Clear selected symptoms if user manually edits and removes them
      if (selectedSymptoms.length > 0 && !newValue.includes(expectedSelectedText)) {
        setSelectedSymptoms([]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputValue = getInputValue();
    if (inputValue.trim()) {
      // Handle form submission here
      console.log("Submitting symptoms:", inputValue);
      // Reset after submission
      setMessage("");
      setSelectedSymptoms([]);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Header with Logo and User Icon */}
      <header className="flex items-center justify-between px-6 py-4 w-full border-b border-[#E0EEEC]">
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
        <button className="w-10 h-10 rounded-full bg-[#F3FAF9] border border-[#E0EEEC] flex items-center justify-center text-[#0B2220] text-sm font-medium">
          LO
        </button>
      </header>

      {/* Navigation Bar */}
      <div className="flex items-center gap-4 px-6 py-4 w-full">
        <div className="flex items-center gap-4 max-w-[345px] mx-auto w-full">
          <button
            onClick={() => router.back()}
            className="w-6 h-6 flex items-center justify-center"
            aria-label="Go back"
          >
            <Image
              src="/icons/arrow-left.svg"
              alt="Arrow Left Icon"
              width={24}
              height={24}
              className="object-contain"
            />
          </button>
          <h1 className="text-[#333333] text-base font-semibold leading-[1.275]">
            Check your symptoms
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-[120px]">
        <div className="flex flex-col max-w-[345px] mx-auto">
          {/* Main Heading */}
          <h2 className="text-[#333333] text-xl leading-[1.275] mb-2">
            Tell me what&apos;s going on
          </h2>
          <p className="text-[#4F4F4F] text-base font-normal leading-normal mb-6">
            Type in your symptoms or pick from the list below:
          </p>

          {/* Symptom Chips */}
          <div className="flex flex-wrap gap-4 mb-8">
            {symptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`px-4 py-2 rounded-full text-base font-normal leading-normal transition-colors ${
                  selectedSymptoms.includes(symptom)
                    ? "bg-[#EFF6F6] text-[#1E3330] font-medium border border-[#92C3BD]"
                    : "bg-[#F8F8F8] text-[#545858] border border-[#F8F8F8] hover:bg-[#E0EEEC]"
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Field - Fixed 64px from bottom */}
      <div className="px-6 pb-[64px]">
        <div className="max-w-[345px] mx-auto">
          <form onSubmit={handleSubmit} className="w-full relative">
            <input
              type="text"
              value={getInputValue()}
              onChange={handleInputChange}
              placeholder={selectedSymptoms.length > 0 ? "" : "Ask me a question"}
              className="w-full px-6 py-4 pr-14 rounded-[30px] border border-[#E7E7E7] bg-white text-[#0B2220] text-base font-normal focus:outline-none focus:border-[#2D8E86] focus:ring-2 focus:ring-[#2D8E86]/20 placeholder:text-[#9CA3AF]"
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

