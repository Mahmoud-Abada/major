import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatItem {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

interface ProfileStatsProps {
  stats: StatItem[];
  className?: string;
}

export function ProfileStats({ stats, className }: ProfileStatsProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
    >
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                {stat.trend && (
                  <p
                    className={`text-xs mt-1 ${
                      stat.trend.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend.isPositive ? "↑" : "↓"} {stat.trend.value}
                  </p>
                )}
              </div>
              {stat.icon && (
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  {stat.icon}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
