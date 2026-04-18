import { Users, DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { StatCard } from "../../../components/ui/stat-card";
import { Button } from "@/src/components/ui/button";

export function StatsGroup() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        mode="horizontal"
        title="Leads disponibles"
        value="12"
        icon={Users}
        subtext={
          <span className="text-green-700 dark:text-green-300 font-medium">
            +3 últimas 24h
          </span>
        }
        iconClassName="bg-cyan-400/20 dark:bg-cyan-900 text-cyan-700"
      />

      <StatCard
        mode="horizontal"
        title="Leads comprados"
        value="8"
        icon={DollarSign}
        subtext={<span className="text-zinc-400">Este mes</span>}
        iconClassName="bg-green-400/20 dark:bg-green-900 text-green-700"
      />

      <StatCard
        mode="horizontal"
        title="Tasa de respuesta"
        value="94%"
        icon={TrendingUp}
        subtext={
          <span className="text-green-600 dark:text-green-400 font-medium">
            Excelente
          </span>
        }
        iconClassName="bg-purple-400/20 dark:bg-purple-800 text-purple-700"
      />

      <StatCard
        mode="horizontal"
        title="Créditos"
        value="$450"
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
