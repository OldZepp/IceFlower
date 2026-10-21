import { PROJECT_STATUS_LABELS } from "@/lib/constants";

const styles: Record<string, string> = {
  planning: "bg-glacier/20 text-fjord dark:bg-glacier/25 dark:text-glacier",
  active: "bg-aurora/15 text-aurora dark:bg-aurora/25 dark:text-aurora",
  paused: "bg-sun/15 text-sun dark:bg-sun/20 dark:text-sun",
  completed: "bg-fjord/10 text-fjord dark:bg-white/10 dark:text-white/80",
  archived: "bg-graphite/10 text-graphite/70 dark:bg-white/5 dark:text-white/50",
};

export function ProjectStatusBadge({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
        styles[value] ?? styles.planning
      }`}
    >
      {PROJECT_STATUS_LABELS[value] ?? value}
    </span>
  );
}
