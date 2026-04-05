import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE_URL = "https://reachiwell-git-17355259644.europe-west1.run.app/v1";
const ADMIN_TOKEN_COOKIE = "rw_admin_token";

export async function POST() {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value || "";

  let responseBody: { success: boolean; message?: string; customStatusCode?: number } = { success: true };

  // Best-effort upstream logout call.
  if (token) {
    try {
      const upstreamRes = await fetch(`${BASE_URL}/admin/users/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const upstreamJson = await upstreamRes.json().catch(() => ({}));

      // Prefer upstream message when successful.
      if (upstreamRes.ok) {
        responseBody = {
          success: true,
          message: upstreamJson?.message || "User sucessfully logout",
          customStatusCode: upstreamJson?.customStatusCode,
        };
      }
    } catch {
      // ignore upstream errors; cookie is already cleared.
    }
  }

  // Always clear cookie on our side, even if upstream logout fails.
  const res = NextResponse.json(responseBody);
  res.cookies.set(ADMIN_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}

