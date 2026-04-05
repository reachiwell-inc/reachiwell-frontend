"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserMenu from "@/components/UserMenu";
import { useTriageSocket } from "@/lib/useTriageSocket";
import TypingDots from "@/components/TypingDots";
import { isLocationInput } from "@/lib/locationInput";
import HealthCareFacilitiesMessage, { type HealthCareFacility } from "@/components/HealthCareFacilitiesMessage";
import HelpGettingThereSection from "@/components/HelpGettingThereSection";

type ChatMessage = {
  id: string;
  type: "user" | "system";
  content?: string;
  kind?: "text" | "facilities" | "yesno";
  facilities?: HealthCareFacility[];
  yesNoState?: "pending" | "answered";
};

type FindHealthCareCenterPayload = {
  data?: string;
  // message?: string;
  healthcareFacilities?: HealthCareFacility[];
};

function isFindHealthCareCenterPayload(raw: unknown): raw is FindHealthCareCenterPayload {
  return !!raw && typeof raw === "object" && Array.isArray((raw as any).healthcareFacilities);
}

function makeMessageId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ChatPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const { emitTriage, emitFindHealthCareCenter, emitBookTransportation, emitEscalate } = useTriageSocket({
    enabled: !isCheckingAuth,
    onMessage: (text, raw) => {
      if (isFindHealthCareCenterPayload(raw)) {
        const msg = raw.data || "Here are the best options for you right now:";
        const facilities = raw.healthcareFacilities || [];
        setChatMessages((prev) => [
          ...prev,
          { id: makeMessageId(), type: "system", kind: "facilities", facilities, content: msg },
        ]);
        setIsWaitingForResponse(false);
        return;
      }

      if (raw && typeof raw === "object" && (raw as any).category === "two") {
        setChatMessages((prev) => [
          ...prev,
          { id: makeMessageId(), type: "system", kind: "yesno", content: text, yesNoState: "pending" },
        ]);
        setIsWaitingForResponse(false);
        return;
      }

      setChatMessages((prev) => [...prev, { id: makeMessageId(), type: "system", kind: "text", content: text }]);
      setIsWaitingForResponse(false);
    },
    onError: (text) => {
      setChatMessages((prev) => [...prev, { id: makeMessageId(), type: "system", kind: "text", content: text }]);
      setIsWaitingForResponse(false);
    },
  });

  // Check for authentication token and redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setIsCheckingAuth(false);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim();
    if (text) {
      setIsWaitingForResponse(true);
      setChatMessages((prev) => [...prev, { id: makeMessageId(), type: "user", content: text }]);
      const ok = isLocationInput(text) ? emitFindHealthCareCenter(text) : emitTriage(text);
      if (!ok) setIsWaitingForResponse(false);
    }
    setMessage("");
  };

  const handleYesNo = (messageId: string, choice: "yes" | "no") => {
    setChatMessages((prev) => {
      const next = prev.map((m) =>
        m.id === messageId && m.kind === "yesno" ? { ...m, yesNoState: "answered" as const } : m
      );

      const userLabel = choice === "yes" ? "Yes" : "No";
      const followUp =
        choice === "yes"
          ? "Please enter your postal code or address so I can direct you to the appropriate healthcare facility around you."
          : "Thanks for using our service. Do you need anything else I can help with?";

      return [
        ...next,
        { id: makeMessageId(), type: "user", content: userLabel },
        { id: makeMessageId(), type: "system", kind: "text", content: followUp },
      ];
    });
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
        <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
          <Image
            src="/images/reachiwell-logo.png"
            alt="ReachiWell Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-[#0B2220] text-base font-medium leading-[1.275]">ReachiWell</span>
        </Link>
        <UserMenu />
      </header>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-[120px]">
        <div className="flex flex-col max-w-[345px] mx-auto">
          {chatMessages.length === 0 ? (
            <>
              {/* Greeting */}
              <h1 className="text-[#333333] text-2xl font-medium leading-[1.275] mb-3 text-center">
                Hi, there!
              </h1>
              <h2 className="text-[#333333] text-xl leading-[1.275] mb-4 text-center">
                I&apos;m ReachiBot, your health guide.
              </h2>
              <p className="text-[#4F4F4F] text-base font-normal leading-normal mb-8 text-center">
                I can help you check your symptoms, find the right care nearby, and even arrange a ride to get you
                there. Let&apos;s get started!
              </p>

              {/* Action Buttons */}
              <div className="w-full space-y-4 mb-8">
                <button
                  onClick={() => router.push("/chat/check-symptoms")}
                  className="w-full bg-[#E0EEEC] text-[#545858] px-6 py-4 rounded-full text-base font-medium leading-[1.275] flex items-center justify-between hover:bg-[#D0DEDC] transition-colors active:bg-[#C0CECC]"
                >
                  <span>Check my symptoms</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7.5 5L12.5 10L7.5 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="w-full bg-[#E0EEEC] text-[#545858] px-6 py-4 rounded-full text-base font-medium leading-[1.275] flex items-center justify-between hover:bg-[#D0DEDC] transition-colors active:bg-[#C0CECC]">
                  <span>Find a service</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7.5 5L12.5 10L7.5 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="w-full bg-[#E0EEEC] text-[#545858] px-6 py-4 rounded-full text-base font-medium leading-[1.275] flex items-center justify-between hover:bg-[#D0DEDC] transition-colors active:bg-[#C0CECC]">
                  <span>Talk to a human</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7.5 5L12.5 10L7.5 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.type === "user" ? (
                    <div className="bg-[#599891] text-white px-4 py-3 rounded-full rounded-br-sm max-w-[80%]">
                      <p className="text-base font-normal leading-normal whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    </div>
                  ) : (
                    <div className="max-w-[80%]">
                      {msg.kind === "facilities" && msg.facilities ? (
                        <>
                          <HealthCareFacilitiesMessage
                            message={msg.content || ""}
                            facilities={msg.facilities}
                            onArrangeRide={(healthCareFacilityId) => {
                              emitBookTransportation(healthCareFacilityId);
                            }}
                          />
                          <HelpGettingThereSection
                            onSelect={(action) => {
                              const label =
                                action === "ride"
                                  ? "Yes, arrange a ride"
                                  : action === "directions"
                                    ? "Help me with directions"
                                    : action === "volunteer"
                                      ? "Speak with a ReachiWell volunteer"
                                      : "No, I’ll get there myself";
                              setChatMessages((prev) => [...prev, { id: makeMessageId(), type: "user", content: label }]);

                              if (action === "volunteer") {
                                setIsWaitingForResponse(true);
                                const ok = emitEscalate({ action: "volunteer" });
                                if (!ok) setIsWaitingForResponse(false);
                              }
                            }}
                          />
                        </>
                      ) : msg.kind === "yesno" ? (
                        <div className="bg-[#F8F8F8] border border-[#E0EEEC] rounded-2xl px-4 py-3">
                          <p className="text-[#0B2220] text-base font-normal leading-normal whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <button
                              type="button"
                              disabled={msg.yesNoState === "answered"}
                              onClick={() => handleYesNo(msg.id, "yes")}
                              className="flex-1 bg-white border border-[#E0EEEC] rounded-full px-4 py-2 text-[#1E3330] text-base font-medium leading-normal flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#EFF6F6]"
                            >
                              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M16.667 5L7.5 14.167 3.333 10"
                                  stroke="#16A34A"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Yes
                            </button>
                            <button
                              type="button"
                              disabled={msg.yesNoState === "answered"}
                              onClick={() => handleYesNo(msg.id, "no")}
                              className="flex-1 bg-white border border-[#E0EEEC] rounded-full px-4 py-2 text-[#1E3330] text-base font-medium leading-normal flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FEF2F2]"
                            >
                              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M5 5L15 15M15 5L5 15"
                                  stroke="#DC2626"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              No
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[#0B2220] text-base font-normal leading-normal whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isWaitingForResponse && (
                <div className="flex justify-start">
                  <div className="max-w-[80%]">
                    <TypingDots />
                  </div>
                </div>
              )}
            </div>
          )}
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

