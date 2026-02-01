import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "@/types/next-socket";
import { Server } from "socket.io";
import { io as ioClient, type Socket as ClientSocket } from "socket.io-client";

const UPSTREAM_URL = "https://reachiwell-git-17355259644.europe-west1.run.app";
// Socket.IO server path for the local proxy (must match the browser client `path`).
const PROXY_PATH = "/api/triage-socket";

type UpstreamSockets = Map<string, ClientSocket>;

declare global {
  // eslint-disable-next-line no-var
  var _triageUpstreamSockets: UpstreamSockets | undefined;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: PROXY_PATH,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    res.socket.server.io = io;

    const upstreamSockets: UpstreamSockets = (global._triageUpstreamSockets ||= new Map());

    io.on("connection", (socket) => {
      void (async () => {
        // Read auth + room_name coming from browser
        const authToken =
          (socket.handshake.auth?.auth as string | undefined) ||
          (socket.handshake.query?.auth as string | undefined) ||
          "";
        const roomName =
          (socket.handshake.auth?.room_name as string | undefined) ||
          (socket.handshake.query?.room_name as string | undefined) ||
          "";

        const upstreamPathsToTry = ["/socket.io", "/"] as const;

        const connectUpstream = (path: string) =>
          new Promise<ClientSocket>((resolve, reject) => {
            const upstream = ioClient(UPSTREAM_URL, {
              // Upstream is returning "xhr poll error" (503) for polling, so force WebSocket-only.
              transports: ["websocket"],
              upgrade: false,
              timeout: 20000,
              reconnection: false, // prevent endless retries/noise for upstream client\,
              // Postman example uses `room-name` header (dash), not `room_name`.
              // Send both variants to be safe.
              extraHeaders: {
                auth: authToken,
                "room-name": roomName,
                room_name: roomName,
              },
              // Also send as auth/query (in case upstream reads from handshake payload instead of headers)
              auth: {
                auth: authToken,
                "room-name": roomName as any,
                room_name: roomName,
              } as any,
              query: {
                auth: authToken,
                "room-name": roomName as any,
                room_name: roomName,
              } as any,
            });

            const cleanup = () => {
              upstream.off("connect", onConnect);
              upstream.off("connect_error", onError);
            };

            const onConnect = () => {
              cleanup();
              resolve(upstream);
            };

            const onError = (err: unknown) => {
              cleanup();
              try {
                upstream.disconnect();
              } catch {
                // ignore
              }
              reject(err);
            };

            upstream.once("connect", onConnect);
            upstream.once("connect_error", onError);
          });

        let upstream: ClientSocket | null = null;
        let lastErr: unknown = null;

        for (const p of upstreamPathsToTry) {
          try {
            upstream = await connectUpstream(p);
            // eslint-disable-next-line no-console
            console.log("[triage-proxy] upstream connected", { path: p, clientId: socket.id });
            break;
          } catch (err) {
            lastErr = err;
            // eslint-disable-next-line no-console
            console.warn("[triage-proxy] upstream connect_error", { path: p, clientId: socket.id, err });
          }
        }

        if (!upstream) {
          socket.emit("triage_proxy_error", {
            message: "Upstream connect_error (all path attempts failed)",
            detail: (lastErr as any)?.message || String(lastErr),
          });
          return;
        }

        upstreamSockets.set(socket.id, upstream);

        // Surface an explicit "upstream connected" signal to the browser
        socket.emit("triage_proxy_upstream_connected", {
          upstreamUrl: UPSTREAM_URL,
          // best-effort: we connected with one of the attempted paths; the log above tells which
          roomName,
        });

        // Forward upstream events → browser
        upstream.onAny((eventName, payload) => {
          // eslint-disable-next-line no-console
          console.log("[triage-proxy] <- upstream", { eventName, clientId: socket.id });

          if (eventName === "triage" || eventName === "Triage") {
            socket.emit("triage_proxy_received_triage", payload);
          }
          socket.emit(eventName, payload);
        });

        // Forward browser events → upstream (including "triage")
        socket.onAny((eventName, payload) => {
          upstream.emit(eventName, payload);
        });

        socket.on("disconnect", () => {
          upstreamSockets.delete(socket.id);
          upstream.disconnect();
        });
      })();
    });
  }

  res.end();
}

