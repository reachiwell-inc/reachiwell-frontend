import { NextResponse } from "next/server";

const BASE_URL = "https://reachiwell-git-17355259644.europe-west1.run.app/v1";
const ADMIN_TOKEN_COOKIE = "rw_admin_token";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as null | { email?: string; password?: string };
    const email = (body?.email || "").trim();
    const password = body?.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Admin login endpoint (per backend docs):
    // POST {{baseUrl}}/v1/admin/users/auth/login  { email, password }
    const upstreamRes = await fetch(`${BASE_URL}/admin/users/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const upstreamJson = await upstreamRes.json().catch(() => ({}));

    if (!upstreamRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message: upstreamJson?.message || "Login failed.",
          error: upstreamJson?.error,
          statusCode: upstreamRes.status,
        },
        { status: upstreamRes.status }
      );
    }

    const token = upstreamJson?.data?.token;
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, message: "Login succeeded but token is missing." },
        { status: 502 }
      );
    }

    // Backend success response shape:
    // { message: "Login successful", data: { token: string }, customStatusCode: number }
    const res = NextResponse.json({
      success: true,
      message: upstreamJson?.message || "Login successful",
      data: { token },
      customStatusCode: upstreamJson?.customStatusCode,
    });
    res.cookies.set(ADMIN_TOKEN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Unexpected error. Please try again.", error: String(err) },
      { status: 500 }
    );
  }
}

