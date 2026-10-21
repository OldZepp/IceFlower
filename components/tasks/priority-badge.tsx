import { PRIORITY_LABELS } from "@/lib/constants";

const styles: Record<string, string> = {
  low: "bg-graphite/10 text-graphite dark:bg-white/10 dark:text-white/80",
  medium: "bg-glacier/20 text-fjord dark:bg-glacier/25 dark:text-glacier",
  high: "bg-aurora/15 text-aurora dark:bg-aurora/25 dark:text-aurora",
  critical: "bg-danger/15 text-danger dark:bg-danger/25 dark:text-danger",
};

export function PriorityBadge({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
        styles[value] ?? styles.low
      }`}
    >
      {PRIORITY_LABELS[value] ?? value}
    </span>
  );
}
