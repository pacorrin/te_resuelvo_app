import { auth } from "@/src/lib/auth/auth";
import type { Session } from "next-auth";

export function protectedAction<Args extends unknown[], Return>(
  action: (session: Session, ...args: Args) => Promise<Return>,
) {
  return async (...args: Args): Promise<Return> => {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    return action(session, ...args);
  };
}
