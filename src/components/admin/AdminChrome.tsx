"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";

  // Login should be a clean, standalone screen (no sidebar chrome).
  if (pathname === "/admin" || pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex">
      <AdminSidebar />
      <main className="flex-1 px-10 py-10">{children}</main>
    </div>
  );
}

