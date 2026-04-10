"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import Link from "next/link";
import HealthCareFacilitiesMessage, {
  type HealthCareFacility,
} from "@/components/HealthCareFacilitiesMessage";

const UPSTREAM_URL = "https://apidev.reachiwell.ca";

type DisplayMessage = {
  id: string;
  message: string;
  sentByAdmin?: boolean;
  senderId?: string;
  sender?: string;
  createdAt?: string;
};

type HealthCareFacilityLite = {
  _id?: string;
  id?: string;
  name?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  type?: string;
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function StatusPill({
  status,
}: {
  status: "Completed" | "In progress" | "Escalated";
}) {
  const styles =
    status === "Completed"
      ? "bg-[#E7F5EF] text-[#2F7A56]"
      : status === "In progress"
        ? "bg-[#F8EFE3] text-[#B36B22]"
        : "bg-[#F9E7E7] text-[#C54747]";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-[10px] text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  );
}

function ArrowLeft() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="#161818"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 4v12M4 10h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 2L11 13"
        stroke="#0B2220"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="#0B2220"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function payloadToText(payload: unknown) {
  if (typeof payload === "string") return payload;
  const o = payload as any;
  return (
    (typeof o?.message === "string" && o.message) ||
    (typeof o?.data === "string" && o.data) ||
    (typeof o?.text === "string" && o.text) ||
    ""
  );
}

function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function parseFacilitiesMessage(
  text: string,
): { header: string; facilities: HealthCareFacilityLite[] } | null {
  const t = text.trim();
  if (!t) return null;

  // Pattern A: JSON string: {"message":"...","healthcareFacilities":[...]}
  if (t.startsWith("{") && t.endsWith("}")) {
    const obj = safeJsonParse<any>(t);
    const facilities = Array.isArray(obj?.healthcareFacilities)
      ? (obj.healthcareFacilities as HealthCareFacilityLite[])
      : null;
    if (facilities) {
      const header = String(
        obj?.message ||
          obj?.data ||
          "Here are the best options for you right now:",
      );
      return { header, facilities };
    }
  }

  // Pattern B: "Header text: [{...},{...}]"
  const firstBracket = t.indexOf("[");
  const lastBracket = t.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    const maybeArrayText = t.slice(firstBracket, lastBracket + 1).trim();
    const arr = safeJsonParse<any>(maybeArrayText);
    if (Array.isArray(arr)) {
      const rawHeader = t.slice(0, firstBracket).trim();
      const header =
        rawHeader.replace(/:\s*$/, "") ||
        "Here are the best options for you right now:";
      return { header, facilities: arr as HealthCareFacilityLite[] };
    }
  }

  return null;
}

export default function ConversationDetailClient(props: {
  conversationId: string;
  title: string;
  status: "Completed" | "In progress" | "Escalated";
  roomName: string;
  initialMessages: DisplayMessage[];
}) {
  const { conversationId, title, status, roomName } = props;
  const [joined, setJoined] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<DisplayMessage[]>(
    props.initialMessages,
  );

  const socketRef = useRef<Socket | null>(null);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  const adminToken = useMemo(() => {
    try {
      return (localStorage.getItem("rw_admin_token") || "").trim();
    } catch {
      return "";
    }
  }, []);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, joined]);

  useEffect(() => {
    if (!joined) return;
    if (!roomName) return;
    if (!adminToken) return;

    const socket = io(UPSTREAM_URL, {
      transports: ["websocket"],
      upgrade: false,
      timeout: 20000,
      auth: {
        auth: adminToken,
        "room-name": roomName,
      } as any,
      query: {
        auth: adminToken,
        "room-name": roomName,
      } as any,
    });

    socketRef.current = socket;

    const handleIncoming = (payload: unknown) => {
      const text = payloadToText(payload) || "";
      if (!text) return;
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          message: text,
          sender: "reachiwell",
          sentByAdmin: false,
          senderId: "system",
          createdAt: new Date().toISOString(),
        },
      ]);
    };

    socket.on("manual-chat", handleIncoming);
    socket.on("manualChat", handleIncoming);
    socket.on("ManualChat", handleIncoming);

    return () => {
      socket.off("manual-chat", handleIncoming);
      socket.off("manualChat", handleIncoming);
      socket.off("ManualChat", handleIncoming);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [joined, roomName, adminToken]);

  const emitManualChat = (text: string) => {
    const socket = socketRef.current;
    if (!socket) return false;
    socket.emit("manual-chat", { conversationId, roomName, message: text });
    return true;
  };

  const handleJoin = () => {
    if (joined) return;
    setJoined(true);

    // Notify user that admin joined (also send to backend).
    const joinNotice = "An admin has joined the chat.";
    setMessages((prev) => [
      ...prev,
      {
        id: makeId(),
        message: joinNotice,
        sender: "admin",
        sentByAdmin: true,
        senderId: "admin",
        createdAt: new Date().toISOString(),
      },
    ]);
    // best-effort; socket may not be connected yet.
    setTimeout(() => emitManualChat(joinNotice), 350);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: makeId(),
        message: text,
        sender: "admin",
        sentByAdmin: true,
        senderId: "admin",
        createdAt: new Date().toISOString(),
      },
    ]);

    setInput("");
    emitManualChat(text);
  };

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-[980px] flex flex-col min-h-[calc(100vh-140px)]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="text-[#161818] text-2xl font-semibold leading-[1.275]">
              {title}
            </div>
            <StatusPill status={status} />
          </div>

          <button
            type="button"
            onClick={handleJoin}
            disabled={joined}
            className={
              joined
                ? "h-[46px] px-6 rounded-xl bg-[#F3F4F6] text-[#6B7280] text-sm font-semibold inline-flex items-center gap-3 cursor-not-allowed"
                : "h-[46px] px-6 rounded-xl bg-[#E87954] text-white text-sm font-semibold inline-flex items-center gap-3 shadow-[0_8px_18px_rgba(232,121,84,0.22)] hover:bg-[#d66a45] transition-colors"
            }
          >
            <PlusIcon />
            {joined ? "Joined" : "Join chat"}
          </button>
        </div>

        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-3 mt-10 text-[#161818] text-sm font-medium hover:opacity-80"
        >
          <ArrowLeft />
          Go back to Conversation History
        </Link>

        <div className="mt-10 space-y-6 flex-1">
          {messages.map((m) => {
            const role =
              m.senderId === "system" || m.sender === "reachiwell"
                ? "system"
                : m.sentByAdmin === true || m.sender === "admin"
                  ? "admin"
                  : "user";

            if (role === "user") {
              return (
                <div key={m.id} className="flex justify-end">
                  <div className="bg-[#4F8F88] text-white px-8 py-5 rounded-[26px] max-w-[420px] text-base leading-normal">
                    {m.message}
                  </div>
                </div>
              );
            }

            const facilitiesPayload = parseFacilitiesMessage(m.message);
            if (facilitiesPayload) {
              return (
                <div key={m.id} className="flex justify-start">
                  <HealthCareFacilitiesMessage
                    className="max-w-[620px]"
                    message={facilitiesPayload.header}
                    facilities={
                      facilitiesPayload.facilities as unknown as HealthCareFacility[]
                    }
                    showActions={false}
                  />
                </div>
              );
            }

            // Admin + system messages on the left (matches the screenshot style).
            return (
              <div key={m.id} className="flex justify-start">
                <div className="max-w-[620px] text-[#414747] text-base leading-normal whitespace-pre-wrap">
                  {m.message}
                </div>
              </div>
            );
          })}
          <div ref={listEndRef} />
        </div>

        {joined && (
          <div className="sticky bottom-0 pt-10 pb-6 bg-transparent">
            <div className="mx-auto w-full max-w-[820px]">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  placeholder="Type here..."
                  className="w-full h-[64px] rounded-full border border-[#E5E7EB] bg-white px-7 pr-16 text-base text-[#161818] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2D8E86] focus:ring-2 focus:ring-[#2D8E86]/15"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#E0EEEC] flex items-center justify-center hover:bg-[#D0DEDC] transition-colors"
                  aria-label="Send"
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
