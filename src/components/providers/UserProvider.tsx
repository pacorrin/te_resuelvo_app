"use client";

import type { Session } from "next-auth";
import { createContext, useContext } from "react";

type User = Session["user"];

interface UserProviderProps {
  user: User | undefined;
  children: React.ReactNode;
}

const UserContext = createContext<User | undefined>(undefined);

export function UserProvider({ user, children }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
