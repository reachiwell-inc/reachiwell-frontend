"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserMenu from "@/components/UserMenu";
import { useTriageSocket } from "@/lib/useTriageSocket";
import TypingDots from "@/components/TypingDots";

type ChatMessage = {
  type: "user" | "system";
  content: string;
};

export default function ChatPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const { emitTriage } = useTriageSocket({
    enabled: !isCheckingAuth,
    onMessage: (text) => {
      setChatMessages((prev) => [...prev, { type: "system", content: text }]);
      setIsWaitingForResponse(false);
    },
    onError: (text) => {
      setChatMessages((prev) => [...prev, { type: "system", content: text }]);
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
      setChatMessages((prev) => [...prev, { type: "user", content: text }]);
      const ok = emitTriage(text);
      if (!ok) setIsWaitingForResponse(false);
    }
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
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.type === "user" ? (
                    <div className="bg-[#599891] text-white px-4 py-3 rounded-full rounded-br-sm max-w-[80%]">
                      <p className="text-base font-normal leading-normal whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    </div>
                  ) : (
                    <div className="max-w-[80%]">
                      <p className="text-[#0B2220] text-base font-normal leading-normal whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
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

