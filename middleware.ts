import { NextResponse, type NextRequest } from "next/server";

const ADMIN_TOKEN_COOKIE = "rw_admin_token";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // /admin is now the login page (public).
  const isAdminLogin = pathname === "/admin" || pathname === "/admin/login";
  const isProtectedAdmin = pathname.startsWith("/admin/") && !isAdminLogin;

  // Protect everything under /admin/* except the login routes.
  if (isProtectedAdmin) {
    const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(url);
    }
  }

  // If already authenticated, avoid showing the login routes.
  if (isAdminLogin) {
    const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
    if (token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

