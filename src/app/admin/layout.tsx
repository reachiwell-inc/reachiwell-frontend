import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReachiWell Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#F9F9F9]">{children}</div>;
}

