import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
}

export function MetricsCard({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
}: MetricsCardProps) {
  return (
    <Card className="hover:border-[#194F36]/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#737F76]">{title}</span>
          <div className="w-8 h-8 rounded-lg bg-[#EAF3EE] flex items-center justify-center text-[#194F36]">
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-extrabold tracking-tight text-[#1A211D]">{value}</h3>
          {(subtitle || change) && (
            <div className="flex items-center gap-2 mt-1.5 text-xs">
              {change && (
                <span
                  className={`font-bold ${
                    isPositive ? "text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded" : "text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded"
                  }`}
                >
                  {change}
                </span>
              )}
              {subtitle && <span className="text-[#737F76]">{subtitle}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
