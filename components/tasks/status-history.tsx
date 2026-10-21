export type StatusHistoryItem = {
  id: string;
  fromLabel: string;
  toLabel: string;
  changedByName: string;
  changedAtLabel: string;
};

export function StatusHistoryTimeline({
  items,
}: {
  items: StatusHistoryItem[];
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-black/10 bg-white p-4 text-sm text-graphite/60 dark:border-white/10 dark:bg-graphite dark:text-white/60">
        Статус ещё не менялся.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-4 border-l border-black/10 pl-4 dark:border-white/10">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span
            aria-hidden
            className="absolute -left-[21px] top-1.5 block h-2.5 w-2.5 rounded-full bg-aurora"
          />
          <p className="text-sm text-graphite dark:text-white">
            <span className="font-medium">{item.fromLabel}</span>
            <span className="text-graphite/50 dark:text-white/40"> → </span>
            <span className="font-medium text-aurora">{item.toLabel}</span>
          </p>
          <p className="mt-0.5 text-xs text-graphite/50 dark:text-white/40">
            {item.changedByName} · {item.changedAtLabel}
          </p>
        </li>
      ))}
    </ol>
  );
}
