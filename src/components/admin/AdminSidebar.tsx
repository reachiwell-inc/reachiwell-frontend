"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function AdminSidebar() {
  const pathname = usePathname() || "/admin/dashboard";
  const router = useRouter();
  const [email, setEmail] = useState<string>("admin@reachiwell.ca");

  useEffect(() => {
    try {
      const v = (localStorage.getItem("rw_admin_email") || "").trim();
      if (v) setEmail(v);
    } catch {
      // ignore
    }
  }, []);

  const initials = useMemo(() => {
    const cleaned = email.trim();
    if (!cleaned) return "AD";
    const first = cleaned[0]?.toUpperCase() || "A";
    const second = cleaned.split("@")[0]?.[1]?.toUpperCase() || "D";
    return `${first}${second}`;
  }, [email]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" }).catch(() => null);
    try {
      localStorage.removeItem("rw_admin_email");
      // In case an old implementation stored tokens client-side.
      localStorage.removeItem("rw_admin_token");
      localStorage.removeItem("adminToken");
    } catch {
      // ignore
    }
    // Force a hard navigation to avoid any cached admin UI state.
    window.location.assign("/admin");
  };

  const navActive = pathname === "/admin/dashboard" || pathname.startsWith("/admin/");

  return (
    <aside className="w-[320px] shrink-0 bg-[#F3F4F6] border-r border-[#E5E7EB] min-h-screen flex flex-col">
      <div className="px-8 pt-8">
        <div className="flex items-center gap-2">
          <Image
            src="/images/reachiwell-logo.png"
            alt="ReachiWell Logo"
            width={28}
            height={28}
            className="object-contain"
          />
          <span className="text-[#161818] text-base font-medium leading-[1.275]">ReachiWell</span>
        </div>
      </div>

      <nav className="px-6 mt-14">
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className={classNames(
            "w-full text-left px-5 py-3 rounded-[14px] text-sm font-medium leading-normal transition-colors",
            navActive ? "bg-[#E5E7EB] text-[#161818]" : "text-[#414747] hover:bg-[#E5E7EB]/70"
          )}
        >
          Conversation History
        </button>
      </nav>

      <div className="flex-1" />

      <div className="px-6 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center text-[#161818] font-semibold">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-[#161818] text-sm font-semibold leading-normal">Reachiwell Admin</div>
            <div className="text-[#6B7280] text-xs leading-normal truncate">{email}</div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 text-[#161818] text-[11px] font-semibold tracking-[0.08em] hover:opacity-80"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

