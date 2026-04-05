import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

const ADMIN_TOKEN_COOKIE = "rw_admin_token";

export default async function AdminDashboardPage() {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) {
    redirect("/admin?next=/admin/dashboard");
  }

  return <DashboardClient />;
}

