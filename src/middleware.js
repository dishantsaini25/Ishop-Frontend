import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("user_token")?.value;
  const { pathname } = request.nextUrl; // /profile

  // Protected routes
  const protectedRoutes = ["/profile", "/checkout"];

  // Auth routes (should not access if logged in)
  const authRoutes = ["/login", "/register", "/verify-otp"];

  // 🔒 If trying to access protected route without token
  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🚫 If logged in user trying to access login/register/verify
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/profile",
    "/checkout",
    "/login",
    "/register",
    "/verify-otp",
  ],
};