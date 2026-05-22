import { Users, DollarSign, CreditCard } from "lucide-react";
import { StatCard } from "../../../components/ui/stat-card";
import { Button } from "@/src/components/ui/button";
import type {
  AvailableLeadsCoverageStatsDTO,
  PurchasedLeadsStatsDTO,
} from "@/src/lib/dtos/Tenders.dto";

type StatsGroupProps = {
  availableLeads: AvailableLeadsCoverageStatsDTO;
  purchasedLeads: PurchasedLeadsStatsDTO;
  credits: number;
};

export function StatsGroup({
  availableLeads,
  purchasedLeads,
  credits,
}: StatsGroupProps) {
  const { total, last24h } = availableLeads;
  const { thisMonth } = purchasedLeads;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        mode="horizontal"
        title="Leads disponibles"
        value={total}
        icon={Users}
        subtext={
          last24h > 0 ? (
            <span className="text-green-700 dark:text-green-300 font-medium">
              +{last24h} últimas 24h
            </span>
          ) : (
            <span className="text-zinc-400">0 últimas 24h</span>
          )
        }
        iconClassName="bg-cyan-400/20 dark:bg-cyan-900 text-cyan-700"
      />

      <StatCard
        mode="horizontal"
        title="Leads comprados"
        value={thisMonth}
        icon={DollarSign}
        subtext={<span className="text-zinc-400">Este mes</span>}
        iconClassName="bg-green-400/20 dark:bg-green-900 text-green-700"
      />

      <StatCard
        mode="horizontal"
        title="Créditos"
        value={credits}
        icon={CreditCard}
        subtext={
          <Button
            variant="link"
            className="p-0 h-auto text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold"
          >
            Recargar
          </Button>
        }
        iconClassName="bg-red-200/60 dark:bg-red-900 text-red-700"
      />
    </div>
  );
}
