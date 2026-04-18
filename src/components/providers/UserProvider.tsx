"use client";

import { User as AuthUser } from "next-auth";
import { createContext, useContext } from "react";

interface User extends AuthUser {
  nameInitial?: string;
}

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
