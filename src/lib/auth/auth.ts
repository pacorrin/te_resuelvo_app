import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { UserService } from "../services/user.service";
import crypto from "node:crypto";

interface User {
  id: string;
  email: string;
  name?: string;
  userType: number;
  isVerified: boolean;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials): Promise<User | null> {
        const parsedCredentials = z
          .object({ email: z.email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await UserService.getLoginUser(email);

          if (user && user.isVerified) {
            const passwordHash = crypto
              .createHash("sha512")
              .update(password)
              .digest("hex");

            if (passwordHash === user.passwordHash) {
              const { passwordHash: _, ...userWithoutPassword } = user;
              return {
                ...userWithoutPassword,
                id: userWithoutPassword.id.toString(),
              } as User;
            }
          }
        }

        return null;
      },
    }),
  ],
  logger: {
    error(error) {
      if (
        error instanceof Error &&
        (error.name === "CredentialsSignin" ||
          ("code" in error && error.code === "credentials"))
      ) {
        return;
      }
      console.error(error);
    },
  },
});
