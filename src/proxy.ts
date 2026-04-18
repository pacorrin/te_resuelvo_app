import { auth } from "./lib/auth/auth";

export default auth;

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|.*\\.png|.*\\.svg$).*)"],
// };

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|avif)$).*)",
  ],
};
