"use client";

import StatsCard from "../StatsCard";
import { CheckCircle, FileText, Users, Zap } from "lucide-react";

const iconMap = {
  fileText: FileText,
  users: Users,
  zap: Zap,
  checkCircle: CheckCircle,
};

export default function DashboardStats({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <StatsCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={iconMap[item.iconName]}
        />
      ))}
    </div>
  );
}
