"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

type ChatMessage = {
  type: "user" | "system";
  content: string;
};

export default function CheckSymptomsPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [hasSentSymptoms, setHasSentSymptoms] = useState(false);

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

  // Get the input value: selected symptoms + any typed text (space-separated)
  const getInputValue = () => {
    if (selectedSymptoms.length > 0) {
      // Join with space, not comma
      const symptomsText = selectedSymptoms.join(" ");
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
    // Build the expected selected symptoms text (space-separated)
    const expectedSelectedText = selectedSymptoms.join(" ");
    
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

  // Check if message looks like a postal code (Canadian format: A1A 1A1 or similar)
  const isPostalCode = (text: string): boolean => {
    const postalCodePattern = /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/;
    return postalCodePattern.test(text.trim());
  };

  // Get system response based on user input
  const getSystemResponse = (userMessage: string): string[] => {
    if (!hasSentSymptoms) {
      // First message is symptoms
      return [
        "This looks like something a pharmacist can help with.",
        "Please type in your city or postal code so I can find services near you."
      ];
    } else if (isPostalCode(userMessage)) {
      // User sent postal code
      // Extract city from postal code (simplified - in real app, would use geocoding API)
      const cityMap: { [key: string]: string } = {
        "V5K": "Surrey, BC",
        "V6B": "Vancouver, BC",
        "M5H": "Toronto, ON",
        "H3A": "Montreal, QC",
      };
      
      const prefix = userMessage.trim().substring(0, 3).toUpperCase();
      const city = cityMap[prefix] || "your area";
      
      return [`Got it! I'm looking for resources around ${city}. One moment...`];
    } else {
      // Generic response for other messages
      return ["I understand. Let me help you with that."];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputValue = getInputValue();
    if (inputValue.trim()) {
      // Add user message to chat
      setChatMessages(prev => [...prev, { type: "user", content: inputValue.trim() }]);
      
      // Track if symptoms have been sent
      if (!hasSentSymptoms) {
        setHasSentSymptoms(true);
      }
      
      // Add system response after a short delay (simulate API call)
      setTimeout(() => {
        const systemResponses = getSystemResponse(inputValue.trim());
        systemResponses.forEach((response, index) => {
          setTimeout(() => {
            setChatMessages(prev => [...prev, { type: "system", content: response }]);
          }, index * 500); // Stagger multiple responses
        });
      }, 800);
      
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
            src="/images/reachiwell-logo.png"
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
          {/* Chat Messages */}
          {chatMessages.length > 0 && (
            <div className="flex flex-col gap-4 mb-6">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.type === "user" ? (
                    <div className="bg-[#599891] text-white px-4 py-3 rounded-full rounded-br-sm max-w-[80%]">
                      <p className="text-base font-normal leading-normal whitespace-pre-wrap wrap-break-word">
                        {msg.content}
                      </p>
                    </div>
                  ) : (
                    <div className="max-w-[80%]">
                      <p className="text-[#0B2220] text-base font-normal leading-normal">
                        {msg.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Initial Prompt - Only show if no messages */}
          {chatMessages.length === 0 && (
            <>
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
            </>
          )}
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

