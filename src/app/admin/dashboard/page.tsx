import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient, { type ConversationRow } from "./DashboardClient";

const ADMIN_TOKEN_COOKIE = "rw_admin_token";
const BASE_URL = "https://reachiwell-git-17355259644.europe-west1.run.app/v1";

type ConversationsApiResponse = {
  message?: string;
  data?: {
    conversations?: Array<{
      _id: string;
      userId?: { _id: string; firstName?: string; lastName?: string };
      roomName?: string;
      status?: "active" | "closed" | string;
      escalated?: boolean;
      createdAt?: string;
      rating?: { rating?: number };
    }>;
  };
  customStatusCode?: number;
};

function formatDateParts(iso?: string) {
  if (!iso) return { date: "—", time: "—" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "—", time: "—" };

  const date = d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

function mapStatus(status?: string, escalated?: boolean): "Completed" | "In progress" | "Escalated" {
  if (escalated) return "Escalated";
  if ((status || "").toLowerCase() === "closed") return "Completed";
  return "In progress";
}

export default async function AdminDashboardPage() {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) {
    redirect("/admin?next=/admin/dashboard");
  }

  let rows: ConversationRow[] = [];

  try {
    const upstreamRes = await fetch(`${BASE_URL}/admin/conversations`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (upstreamRes.status === 401 || upstreamRes.status === 403) {
      // Token present but invalid/expired: send user back to login.
      // (Cookie will be cleared on next logout/login flow as needed.)
      redirect("/admin?next=/admin/dashboard&logout=1");
    }

    const json = (await upstreamRes.json().catch(() => ({}))) as ConversationsApiResponse;
    const conversations = json?.data?.conversations || [];

    rows = conversations.map((c) => {
      const { date, time } = formatDateParts(c.createdAt);
      const first = (c.userId?.firstName || "").trim();
      const last = (c.userId?.lastName || "").trim();
      const userName = [first, last].filter(Boolean).join(" ");

      return {
        id: c._id,
        userName: userName || "—",
        roomName: (c.roomName || c._id).trim(),
        date,
        time,
        status: mapStatus(c.status, c.escalated),
        rating: typeof c.rating?.rating === "number" ? c.rating.rating : undefined,
      };
    });
  } catch {
    rows = [];
  }

  return <DashboardClient rows={rows} />;
}

