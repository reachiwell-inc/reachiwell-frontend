"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { logout } from "@/lib/api";

type UserMenuProps = {
  loginHref?: string;
  loggedOutFallback?: React.ReactNode;
};

export default function UserMenu({ loginHref = "/login", loggedOutFallback = null }: UserMenuProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("U");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const computeInitials = useMemo(() => {
    return () => {
      const safeDecodeJwtPayload = (token: string): Record<string, unknown> | null => {
        try {
          const parts = token.split(".");
          if (parts.length < 2) return null;
          const base64Url = parts[1];
          if (!base64Url) return null;
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const padded = base64 + "===".slice((base64.length + 3) % 4);

          // Decode UTF-8 JSON safely
          const binary = atob(padded);
          const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
          const json = new TextDecoder().decode(bytes);
          return JSON.parse(json) as Record<string, unknown>;
        } catch {
          return null;
        }
      };

      const firstName = localStorage.getItem("userFirstName") || "";
      const lastName = localStorage.getItem("userLastName") || "";

      const first = firstName.trim();
      const last = lastName.trim();

      if (first || last) {
        const a = first.charAt(0).toUpperCase();
        const b = last.charAt(0).toUpperCase();
        return `${a}${b}`.trim() || "U";
      }

      // Fallback to email if name isn't stored
      const email = (localStorage.getItem("userEmail") || "").trim();
      if (email) {
        const localPart = email.split("@")[0] || email;
        const a = localPart.charAt(0).toUpperCase();
        const b = localPart.charAt(1).toUpperCase();
        return `${a}${b}`.trim() || a || "U";
      }

      // Fallback to JWT payload (covers cases where we only store a token)
      const token = localStorage.getItem("token") || "";
      if (token) {
        const payload = safeDecodeJwtPayload(token);
        if (payload) {
          const payloadFirst =
            (payload.firstName as string | undefined) ||
            (payload.given_name as string | undefined) ||
            (payload.givenName as string | undefined) ||
            (payload.name as string | undefined);
          const payloadLast =
            (payload.lastName as string | undefined) ||
            (payload.family_name as string | undefined) ||
            (payload.familyName as string | undefined);
          const payloadEmail =
            (payload.email as string | undefined) ||
            (payload.preferred_username as string | undefined) ||
            (payload.username as string | undefined);

          const pf = (payloadFirst || "").toString().trim();
          const pl = (payloadLast || "").toString().trim();
          if (pf || pl) {
            // Persist for the simple initials logic elsewhere
            if (!firstName && pf) localStorage.setItem("userFirstName", pf);
            if (!lastName && pl) localStorage.setItem("userLastName", pl);
            const a = pf.charAt(0).toUpperCase();
            const b = pl.charAt(0).toUpperCase();
            return `${a}${b}`.trim() || a || "U";
          }

          const pe = (payloadEmail || "").toString().trim();
          if (pe) {
            // Persist for future renders
            if (!localStorage.getItem("userEmail")) localStorage.setItem("userEmail", pe);
            const localPart = pe.split("@")[0] || pe;
            const a = localPart.charAt(0).toUpperCase();
            const b = localPart.charAt(1).toUpperCase();
            return `${a}${b}`.trim() || a || "U";
          }
        }
      }

      // Last-resort fallback
      return "U";
    };
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("token");
      setHasToken(!!token);
      setUserInitials(computeInitials());
    };

    syncAuth();

    const onStorage = (e: StorageEvent) => {
      if (
        !e.key ||
        e.key === "token" ||
        e.key === "userFirstName" ||
        e.key === "userLastName" ||
        e.key === "userEmail"
      ) {
        syncAuth();
      }
    };

    const onAuth = () => syncAuth();

    window.addEventListener("storage", onStorage);
    window.addEventListener("reachiwell:auth", onAuth as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("reachiwell:auth", onAuth as EventListener);
    };
  }, [computeInitials]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("token");
      localStorage.removeItem("userFirstName");
      localStorage.removeItem("userLastName");
      localStorage.removeItem("userEmail");
      window.dispatchEvent(new Event("reachiwell:auth"));
      router.push(loginHref);
      return;
    }

    setIsLoggingOut(true);
    try {
      await logout(token);
    } catch (error) {
      // Even if logout fails, clear local storage and redirect
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userFirstName");
      localStorage.removeItem("userLastName");
      localStorage.removeItem("userEmail");
      window.dispatchEvent(new Event("reachiwell:auth"));
      setIsLoggingOut(false);
      setIsDropdownOpen(false);
      router.push(loginHref);
    }
  };

  if (!hasToken) return <>{loggedOutFallback}</>;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-10 h-10 rounded-full bg-[#F3FAF9] border border-[#E0EEEC] flex items-center justify-center text-[#0B2220] text-sm font-medium hover:bg-[#E0EEEC] transition-colors"
        aria-label="User menu"
      >
        {userInitials}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E0EEEC] z-50">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full px-4 py-3 text-left text-[#0B2220] text-base font-normal hover:bg-[#F3FAF9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
}

