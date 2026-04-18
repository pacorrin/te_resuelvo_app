import { ReactNode } from "react";

import { PanelHeader } from "@/src/components/PanelHeader";

interface PanelPageProps {
  children: ReactNode;
}

export function PanelPage({ children }: PanelPageProps) {
  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <PanelHeader />

      <div className="max-w-[1600px] mx-auto px-6 py-8">{children}</div>
    </div>
  );
}

