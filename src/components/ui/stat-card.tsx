import { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
  iconClassName?: string;
  mode?: "vertical" | "horizontal";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  subtext,
  className,
  iconClassName,
  mode = "vertical",
}: StatCardProps) {
  if (mode === "horizontal") {
    return (
      <Card className={cn("flex flex-row items-center p-3 gap-3", className)}>
        <div
          className={cn(
            "shrink-0 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center",
            iconClassName,
          )}
          style={{ minWidth: 40, minHeight: 40 }} // keep icon aligned
        >
          <Icon className="w-6 h-6 text-zinc-600 dark:text-zinc-300" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
          <div className="flex flex-row items-center justify-between gap-2 mb-0.5">
            <CardTitle className="text-base font-medium text-zinc-500 dark:text-zinc-400 m-0 leading-snug">
              {title}
            </CardTitle>
            <div className="text-2xl md:text-2xl font-bold tracking-tight m-0 leading-none">{value}</div>
          </div>
          {subtext && <div className="flex items-center text-xs mt-0.5">{subtext}</div>}
        </div>
      </Card>
    );
  }
  // Default vertical mode
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {title}
        </CardTitle>
        <div
          className={cn(
            "p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50",
            iconClassName,
          )}
        >
          <Icon className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
        {subtext && <div className="flex items-center text-sm">{subtext}</div>}
      </CardContent>
    </Card>
  );
}
