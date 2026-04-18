"use client";

import { useState } from "react";
import { Users, Briefcase, CheckCircle, Star } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";

interface OrganizationStatsProps {
  teamMembersCount?: number;
}

export function OrganizationStats({
  teamMembersCount = 0,
}: OrganizationStatsProps) {
  const [stats, setStats] = useState({
    leadsThisMonth: "47",
    conversionRate: "68%",
    rating: "4.8",
  });

  const statsItems = [
    {
      label: "Miembros del equipo",
      value: teamMembersCount.toString(),
      icon: Users,
    },
    { label: "Leads este mes", value: stats.leadsThisMonth, icon: Briefcase },
    {
      label: "Tasa de conversión",
      value: stats.conversionRate,
      icon: CheckCircle,
    },
    { label: "Calificación", value: stats.rating, icon: Star },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statsItems.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
