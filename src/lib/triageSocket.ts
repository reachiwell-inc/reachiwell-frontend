"use client";

import { io, type Socket } from "socket.io-client";

const ROOM_KEY = "reachiwell:room_name";

let socketSingleton: Socket | null = null;

function getAuthToken(): string {
  return localStorage.getItem("token") || "";
}

function getUserPrefix(): string {
  const firstName = (localStorage.getItem("userFirstName") || "").trim();
  if (firstName.length >= 1) return firstName.slice(0, 3).toLowerCase();

  const email = (localStorage.getItem("userEmail") || "").trim();
  if (email) return (email.split("@")[0] || "usr").slice(0, 3).toLowerCase();

  return "usr";
}

function getOrCreateRoomName(): string {
  const existing = sessionStorage.getItem(ROOM_KEY);
  if (existing) return existing;

  const roomName = `${getUserPrefix()}-${Date.now()}`;
  sessionStorage.setItem(ROOM_KEY, roomName);
  return roomName;
}

export function getTriageSocket(): Socket {
  if (socketSingleton) return socketSingleton;

  const authToken = getAuthToken();
  const roomName = getOrCreateRoomName();

  // NOTE:
  // We connect to a same-origin Next.js Socket.IO server at /api/triage-socket,
  // which then connects to the upstream Cloud Run socket with real HTTP headers.
  socketSingleton = io({
    // This must match the Socket.IO server `path` configured in `src/pages/api/triage-socket.ts`.
    // It is NOT the upstream path.
    path: "/api/triage-socket",
    auth: {
      auth: authToken,
      room_name: roomName,
    },
    query: {
      auth: authToken,
      room_name: roomName,
    },
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socketSingleton.on("connect", () => {
    // eslint-disable-next-line no-console
    console.log("[triage-socket] connected", socketSingleton?.id, { room_name: roomName });
    window.dispatchEvent(new CustomEvent("reachiwell:triage_status", { detail: { status: "connected" } }));
  });

  socketSingleton.on("triage_proxy_upstream_connected", (detail) => {
    // eslint-disable-next-line no-console
    console.log("[triage-socket] proxy upstream connected", detail);
  });

  socketSingleton.on("triage_proxy_received_triage", (payload) => {
    // eslint-disable-next-line no-console
    console.log("[triage-socket] proxy saw triage response", payload);
  });

  socketSingleton.on("disconnect", (reason) => {
    // eslint-disable-next-line no-console
    console.log("[triage-socket] disconnected", reason);
    window.dispatchEvent(new CustomEvent("reachiwell:triage_status", { detail: { status: "disconnected", reason } }));
  });

  socketSingleton.on("connect_error", (err) => {
    // Avoid noisy red console errors; surface to UI via event instead.
    // eslint-disable-next-line no-console
    console.warn("[triage-socket] connect_error", err);
    window.dispatchEvent(new CustomEvent("reachiwell:triage_error", { detail: err }));
  });

  // Observe all incoming events (helps debug event-name mismatches)
  socketSingleton.onAny((eventName, payload) => {
    // eslint-disable-next-line no-console
    console.log("[triage-socket] <-", eventName, payload);
    window.dispatchEvent(new CustomEvent("reachiwell:triage_any", { detail: { eventName, payload } }));
  });

  // Incoming messages (server -> client). Some backends use capitalized event names.
  const forwardTriage = (payload: unknown) => {
    // eslint-disable-next-line no-console
    console.log("[triage-socket] triage <-", payload);
    window.dispatchEvent(new CustomEvent("reachiwell:triage", { detail: payload }));
  };

  socketSingleton.on("triage", forwardTriage);
  socketSingleton.on("Triage", forwardTriage);
  socketSingleton.on("error", (payload) => {
    // eslint-disable-next-line no-console
    console.warn("[triage-socket] error", payload);
    window.dispatchEvent(new CustomEvent("reachiwell:triage_error", { detail: payload }));
  });

  return socketSingleton;
}

export function emitTriage(message: string) {
  const trimmed = message.trim();
  if (!trimmed) return;

  const authToken = getAuthToken();
  if (!authToken) {
    // eslint-disable-next-line no-console
    console.warn("[triage-socket] missing auth token; not emitting");
    return;
  }

  const socket = getTriageSocket();
  // Be liberal in what we send: some servers expect a string, others expect { data } or { message }.
  const payload = { data: trimmed, message: trimmed, text: trimmed };

  const doEmit = () => {
    // eslint-disable-next-line no-console
    console.log("[triage-socket] triage ->", payload);
    // Support both "emit then server emits back" and "emit with ack callback" patterns.
    socket.timeout(20000).emit("triage", payload, (err: unknown, ackPayload: unknown) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.warn("[triage-socket] triage ack error", err);
        window.dispatchEvent(new CustomEvent("reachiwell:triage_error", { detail: err }));
        return;
      }
      // eslint-disable-next-line no-console
      console.log("[triage-socket] triage ack <-", ackPayload);
      window.dispatchEvent(new CustomEvent("reachiwell:triage", { detail: ackPayload }));
    });
  };

  if (socket.connected) {
    doEmit();
    return;
  }

  // If we're not connected yet, wait for connect once, then emit.
  socket.connect();
  socket.once("connect", () => doEmit());
}

