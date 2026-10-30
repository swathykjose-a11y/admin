import { LucideIcon } from "lucide-react";

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
    <div className="bg-white p-6 rounded-xl border border-[#E2E8E4] shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#737F76]">{title}</span>
        <div className="w-9 h-9 rounded-lg bg-[#F2F5EF] flex items-center justify-center text-[#194F36]">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-2xl font-bold tracking-tight text-[#111815]">{value}</h3>
        {(subtitle || change) && (
          <div className="flex items-center gap-2 mt-1.5 text-xs">
            {change && (
              <span
                className={`font-semibold ${
                  isPositive ? "text-emerald-700" : "text-rose-600"
                }`}
              >
                {change}
              </span>
            )}
            {subtitle && <span className="text-[#737F76]">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

