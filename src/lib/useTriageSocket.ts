"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, type Socket } from "socket.io-client";

const UPSTREAM_URL = "https://reachiwell-git-17355259644.europe-west1.run.app";
const ROOM_KEY = "reachiwell:room_name";

function getOrCreateRoomName() {
  const existing = sessionStorage.getItem(ROOM_KEY);
  if (existing) return existing;

  const firstName = (localStorage.getItem("userFirstName") || "").trim();
  const email = (localStorage.getItem("userEmail") || "").trim();
  const prefix = (firstName || email.split("@")[0] || "usr").slice(0, 3).toLowerCase() || "usr";

  const roomName = `${prefix}-${Date.now()}`;
  sessionStorage.setItem(ROOM_KEY, roomName);
  return roomName;
}

function payloadToText(payload: unknown) {
  if (typeof payload === "string") return payload;

  const maybeObj = payload as any;

  // findHealthCareCenter commonly returns:
  // { message: string, healthcareFacilities: Array<{ name?, address?, ... }> }
  const facilities = Array.isArray(maybeObj?.healthcareFacilities) ? maybeObj.healthcareFacilities : null;
  if (facilities) {
    const header = maybeObj?.message || "Here are some healthcare facilities you can visit:";
    const lines = facilities
      .map((f: any, idx: number) => {
        const label = f?.name || f?.address || f?.location || f?._id || `Facility ${idx + 1}`;
        return `- ${String(label)}`;
      })
      .join("\n");
    return lines ? `${header}\n${lines}` : String(header);
  }

  return maybeObj?.message || maybeObj?.data || maybeObj?.text || JSON.stringify(payload);
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
      transports: ["websocket"],
      upgrade: false,
      timeout: 20000,
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

    socket.on("triage", handleMessage);
    socket.on("Triage", handleMessage);
    socket.on("findHealthCareCenter", handleMessage);
    socket.on("FindHealthCareCenter", handleMessage);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("triage", handleMessage);
      socket.off("Triage", handleMessage);
      socket.off("findHealthCareCenter", handleMessage);
      socket.off("FindHealthCareCenter", handleMessage);
      socket.off("connect_error", handleConnectError);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled]);

  const emitTriage = useCallback((message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return false;

    const socket = socketRef.current;
    if (!socket) return false;

    // Postman shows the server expects plain-text payload (e.g. "cough")
    socket.emit("triage", trimmed);
    return true;
  }, []);

  const emitFindHealthCareCenter = useCallback((address: string) => {
    const trimmed = address.trim();
    if (!trimmed) return false;

    const socket = socketRef.current;
    if (!socket) return false;

    // Per docs: event name is findHealthCareCenter and body is JSON { address: "..." }
    socket.emit("findHealthCareCenter", { address: trimmed });
    return true;
  }, []);

  return { emitTriage, emitFindHealthCareCenter };
}

