"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { Badge } from "@/src/components/ui/badge";
import { ServiceTicketStatus } from "@/src/lib/enums/service-tickets.enum";

import {
  getLeadFollowUpStatusBadgeClass,
  getLeadFollowUpStatusLabel,
} from "./followUpLeadStatus";

type FollowUpTicketStatusContextValue = {
  status: ServiceTicketStatus;
  setStatus: (next: ServiceTicketStatus) => void;
};

const FollowUpTicketStatusContext =
  createContext<FollowUpTicketStatusContextValue | null>(null);

export function FollowUpTicketStatusProvider({
  initialStatus,
  children,
}: {
  initialStatus: ServiceTicketStatus;
  children: ReactNode;
}) {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  return (
    <FollowUpTicketStatusContext.Provider value={{ status, setStatus }}>
      {children}
    </FollowUpTicketStatusContext.Provider>
  );
}

export function useFollowUpTicketStatus(): FollowUpTicketStatusContextValue {
  const ctx = useContext(FollowUpTicketStatusContext);
  if (!ctx) {
    throw new Error(
      "useFollowUpTicketStatus must be used within FollowUpTicketStatusProvider",
    );
  }
  return ctx;
}

/** Header badge; must render inside FollowUpTicketStatusProvider. */
export function FollowUpLeadHeaderBadge() {
  const { status } = useFollowUpTicketStatus();
  return (
    <Badge
      variant="default"
      className={`${getLeadFollowUpStatusBadgeClass(status)} text-white px-6 py-2 text-lg font-semibold`}
    >
      {getLeadFollowUpStatusLabel(status)}
    </Badge>
  );
}
