import { STATUS_LABELS } from "@/lib/constants";

const styles: Record<string, string> = {
  backlog: "bg-graphite/10 text-graphite dark:bg-white/10 dark:text-white/80",
  planned: "bg-glacier/20 text-fjord dark:bg-glacier/25 dark:text-glacier",
  in_progress: "bg-aurora/15 text-aurora dark:bg-aurora/25 dark:text-aurora",
  review: "bg-sun/15 text-sun dark:bg-sun/20 dark:text-sun",
  done: "bg-aurora/25 text-fjord dark:bg-aurora/30 dark:text-white",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
        styles[value] ?? styles.backlog
      }`}
    >
      {STATUS_LABELS[value] ?? value}
    </span>
  );
}
