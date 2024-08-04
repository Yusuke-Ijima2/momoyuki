export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/post/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
