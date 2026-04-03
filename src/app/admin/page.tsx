"use client";

import { useRouter } from "next/navigation";

export default function AdminHomePage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    router.push("/admin/login");
  };

  return (
    <div className="px-6 py-10">
      <div className="mx-auto w-full max-w-[960px]">
        <div className="flex items-center justify-between">
          <h1 className="text-[#161818] text-2xl font-semibold leading-[1.275]">Admin</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-[#C2D6D4] bg-white px-5 py-2.5 text-[#161818] text-sm font-medium hover:bg-[#F3FAF9] transition-colors"
          >
            Log out
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-[#E0EEEC] bg-white p-6">
          <p className="text-[#414747] text-base leading-normal">
            You’re logged into the ReachiWell Admin area. Add your admin pages under <code className="font-mono">/admin</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

