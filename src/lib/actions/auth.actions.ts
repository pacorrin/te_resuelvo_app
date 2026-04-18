"use server";

import { signIn, signOut } from "@/src/lib/auth/auth";
import { AuthError } from "next-auth";

export async function authenticate(_: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: true,
      redirectTo: "/provider-panel",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Usuario y/o contraseña incorrectos";
        default:
          return "Algo salió mal";
      }
    }
    throw error;
  }
}

export async function handleSignOut() {
  await signOut({
    redirect: true,
    redirectTo: "/login",
  });
}
