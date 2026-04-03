import { NextResponse, type NextRequest } from "next/server";

const ADMIN_TOKEN_COOKIE = "rw_admin_token";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Protect everything under /admin except the login page itself.
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(url);
    }
  }

  // If already authenticated, avoid showing the login page.
  if (pathname === "/admin/login") {
    const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
    if (token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

