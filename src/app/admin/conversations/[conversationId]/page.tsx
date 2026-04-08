import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ConversationDetailClient from "./ConversationDetailClient";

const ADMIN_TOKEN_COOKIE = "rw_admin_token";
const BASE_URL = "https://reachiwell-git-17355259644.europe-west1.run.app/v1";

type ConversationDetailsResponse = {
  message?: string;
  data?: {
    conversation?: {
      id?: string;
      roomName?: string;
      status?: string;
      escalated?: boolean;
      createdAt?: string;
    };
    user?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    };
    messages?: Array<{
      id: string;
      message: string;
      senderId?: string;
      sentByAdmin?: boolean;
      createdAt?: string;
    }>;
  };
  customStatusCode?: number;
};

function mapStatus(status?: string, escalated?: boolean): "Completed" | "In progress" | "Escalated" {
  if (escalated) return "Escalated";
  if ((status || "").toLowerCase() === "closed") return "Completed";
  return "In progress";
}

type DisplayMessage = {
  id: string;
  message: string;
  senderId?: string;
  sentByAdmin: boolean;
  createdAt?: string;
};

export default async function AdminConversationDetailPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) redirect("/admin?next=/admin/dashboard");

  const { conversationId } = await params;

  const upstreamRes = await fetch(`${BASE_URL}/admin/conversations/${conversationId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (upstreamRes.status === 401 || upstreamRes.status === 403) {
    redirect("/admin?next=/admin/dashboard&logout=1");
  }

  if (!upstreamRes.ok) {
    redirect("/admin/dashboard");
  }

  const json = (await upstreamRes.json().catch(() => ({}))) as ConversationDetailsResponse;
  const convo = json?.data?.conversation;
  const messages = (json?.data?.messages || []) as DisplayMessage[];

  const title = (convo?.roomName || conversationId).toUpperCase();
  const status = mapStatus(convo?.status, convo?.escalated);

  return (
    <ConversationDetailClient
      conversationId={conversationId}
      title={title}
      status={status}
      roomName={(convo?.roomName || "").trim()}
      initialMessages={messages}
    />
  );
}

