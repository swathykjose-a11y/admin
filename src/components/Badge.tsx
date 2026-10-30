interface BadgeProps {
  status: string;
}

export function Badge({ status }: BadgeProps) {
  const normalized = status.toLowerCase();

  let styles = "bg-gray-100 text-gray-700 border-gray-200";

  switch (normalized) {
    case "paid":
    case "delivered":
    case "published":
      styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case "processing":
    case "shipped":
      styles = "bg-blue-50 text-blue-700 border-blue-200";
      break;
    case "pending":
    case "draft":
    case "unpaid":
      styles = "bg-amber-50 text-amber-700 border-amber-200";
      break;
    case "cancelled":
    case "failed":
    case "archived":
      styles = "bg-rose-50 text-rose-700 border-rose-200";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles} capitalize`}
    >
      {status}
    </span>
  );
}

