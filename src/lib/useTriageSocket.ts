"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, type Socket } from "socket.io-client";

const UPSTREAM_URL = "https://apidev.reachiwell.ca";
const ROOM_KEY = "reachiwell:room_name";

function getOrCreateRoomName() {
  const existing = sessionStorage.getItem(ROOM_KEY);
  if (existing) return existing;

  const firstName = (localStorage.getItem("userFirstName") || "").trim();
  const email = (localStorage.getItem("userEmail") || "").trim();
  const prefix =
    (firstName || email.split("@")[0] || "usr").slice(0, 3).toLowerCase() ||
    "usr";

  const roomName = `${prefix}-${Date.now()}`;
  sessionStorage.setItem(ROOM_KEY, roomName);
  return roomName;
}

function payloadToText(payload: unknown) {
  if (typeof payload === "string") return payload;

  const maybeObj = payload as any;
  const asText = (v: unknown) => {
    if (typeof v === "string") return v;
    if (v == null) return "";
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  };

  // findHealthCareCenter commonly returns:
  // { message: string, healthcareFacilities: Array<{ name?, address?, ... }> }
  const facilities = Array.isArray(maybeObj?.healthcareFacilities)
    ? maybeObj.healthcareFacilities
    : null;
  if (facilities) {
    const header =
      asText(maybeObj?.data) ||
      asText(maybeObj?.message) ||
      "Here are some healthcare facilities you can visit:";
    const lines = facilities
      .map((f: any, idx: number) => {
        const label =
          f?.name ||
          f?.address ||
          f?.location ||
          f?._id ||
          `Facility ${idx + 1}`;
        return `- ${String(label)}`;
      })
      .join("\n");
    return lines ? `${header}\n${lines}` : String(header);
  }

  return (
    asText(maybeObj?.data) ||
    asText(maybeObj?.message) ||
    asText(maybeObj?.text) ||
    asText(payload)
  );
}

type UseTriageSocketOptions = {
  onMessage?: (text: string, raw: unknown) => void;
  onError?: (text: string, raw: unknown) => void;
  enabled?: boolean;
};

export function useTriageSocket(options: UseTriageSocketOptions = {}) {
  const { onMessage, onError, enabled = true } = options;

  const socketRef = useRef<Socket | null>(null);
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (!enabled) return;

    const token = localStorage.getItem("token") || "";
    const roomName = getOrCreateRoomName();

    const socket = io(UPSTREAM_URL, {
      // Allow fallback for environments where websocket-only fails.
      transports: ["polling", "websocket"],
      timeout: 30000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 500,
      reconnectionDelayMax: 3000,
      auth: {
        auth: token,
        "room-name": roomName,
      } as any,
      query: {
        auth: token,
        "room-name": roomName,
      } as any,
    });

    socketRef.current = socket;

    const handleMessage = (payload: unknown) => {
      const text = payloadToText(payload);
      onMessageRef.current?.(String(text), payload);
    };

    const handleConnectError = (err: unknown) => {
      const text = `Connection error: ${(err as any)?.message || String(err)}`;
      onErrorRef.current?.(text, err);
    };

    const handleException = (payload: unknown) => {
      // Backend sometimes emits: { status: "error", message: "Internal server error", cause: {...} }
      const maybeObj = payload as any;
      const msg =
        (typeof maybeObj?.message === "string" && maybeObj.message) ||
        (typeof maybeObj?.data === "string" && maybeObj.data) ||
        String(payload);
      onErrorRef.current?.(msg, payload);
    };

    socket.on("triage", handleMessage);
    socket.on("Triage", handleMessage);
    socket.on("findHealthCareCenter", handleMessage);
    socket.on("FindHealthCareCenter", handleMessage);
    socket.on("bookTransportation", handleMessage);
    socket.on("BookTransportation", handleMessage);
    socket.on("escalate", handleMessage);
    socket.on("Escalate", handleMessage);
    socket.on("connect_error", handleConnectError);
    socket.on("exception", handleException);
    socket.on("Exception", handleException);

    return () => {
      socket.off("triage", handleMessage);
      socket.off("Triage", handleMessage);
      socket.off("findHealthCareCenter", handleMessage);
      socket.off("FindHealthCareCenter", handleMessage);
      socket.off("bookTransportation", handleMessage);
      socket.off("BookTransportation", handleMessage);
      socket.off("escalate", handleMessage);
      socket.off("Escalate", handleMessage);
      socket.off("connect_error", handleConnectError);
      socket.off("exception", handleException);
      socket.off("Exception", handleException);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled]);

  const emitTriage = useCallback((message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return false;

    const socket = socketRef.current;
    if (!socket) return false;

    // Backend contract (per Postman/dev server): triage expects { data: string }
    // Sending a plain string can trigger backend "Internal server error".
    socket.emit("triage", { data: trimmed });
    return true;
  }, []);

  const emitFindHealthCareCenter = useCallback((address: string) => {
    const trimmed = address.trim();
    if (!trimmed) return false;

    const socket = socketRef.current;
    if (!socket) return false;

    // Backend contract (per Postman): { address: "..." }
    socket.emit("findHealthCareCenter", { address: trimmed });
    return true;
  }, []);

  const emitBookTransportation = useCallback((healthCareFacilityId: string) => {
    const trimmed = healthCareFacilityId.trim();
    if (!trimmed) return false;

    const socket = socketRef.current;
    if (!socket) return false;

    // Postman: event is bookTransportation with body { healthCareFacilityId }
    socket.emit("bookTransportation", { healthCareFacilityId: trimmed });
    return true;
  }, []);

  const emitEscalate = useCallback((payload?: unknown) => {
    const socket = socketRef.current;
    if (!socket) return false;

    // Backend contract may vary; allow optional payload.
    if (typeof payload === "undefined") {
      socket.emit("escalate");
      return true;
    }

    socket.emit("escalate", payload as any);
    return true;
  }, []);

  return {
    emitTriage,
    emitFindHealthCareCenter,
    emitBookTransportation,
    emitEscalate,
  };
}
