import { Badge as ShadcnBadge } from "./ui/badge";

interface BadgeProps {
  status: string;
  className?: string;
}

export function Badge({ status, className }: BadgeProps) {
  const normalized = status.toLowerCase();

  let variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" = "outline";

  switch (normalized) {
    case "paid":
    case "delivered":
    case "published":
      variant = "success";
      break;
    case "processing":
    case "shipped":
      variant = "secondary";
      break;
    case "pending":
    case "draft":
    case "unpaid":
      variant = "warning";
      break;
    case "cancelled":
    case "failed":
    case "archived":
      variant = "destructive";
      break;
    default:
      variant = "outline";
      break;
  }

  return (
    <ShadcnBadge variant={variant} className={`capitalize font-semibold text-[11px] ${className || ""}`}>
      {status}
    </ShadcnBadge>
  );
}
