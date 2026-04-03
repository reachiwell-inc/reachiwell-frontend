import { NextResponse } from "next/server";

const ADMIN_TOKEN_COOKIE = "rw_admin_token";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}

