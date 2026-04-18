import type { DefaultSession, NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

declare module "next-auth" {
  interface Session {
    user: Omit<DefaultSession["user"], "id"> & {
      id: number;
      sub: string;
      nameInitial: string;
      name: string;
    };
  }
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const protectedRoutes = ["/provider-panel"];
      const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route),
      );

      if (pathname.startsWith("/api")) return true;

      if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl));
      }

      if (isLoggedIn && !isProtectedRoute) {
        return NextResponse.redirect(new URL("/provider-panel", nextUrl));
      }

      return true;
    },
    async session({ session, token }) {
      const nameInitial = session.user.name
        ?.split(" ")
        .map((name) => name[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      (session as { user: { id: number; sub: string; nameInitial: string } }).user = {
        ...session.user,
        id: Number(token.sub),
        sub: token.sub!,
        nameInitial,
      };
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
