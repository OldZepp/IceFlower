import Link from "next/link";

export function StatCard({
  title,
  value,
  danger = false,
}: {
  title: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="rounded-lg border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-graphite">
      <h3 className="text-sm font-medium text-graphite/70 dark:text-white/60">
        {title}
      </h3>
      <p
        className={`mt-2 text-2xl font-semibold ${
          danger && value > 0 ? "text-danger" : "text-graphite dark:text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export type DeadlineRow = {
  id: string;
  key: string;
  title: string;
  dateLabel: string;
  overdue: boolean;
};

export type ActivityRow = {
  id: string;
  taskId: string;
  taskKey: string;
  taskTitle: string;
  who: string;
  fromLabel: string;
  toLabel: string;
  whenLabel: string;
};

export type MyProjectRow = {
  id: string;
  name: string;
  openTasks: number;
};

function Panel({
  title,
  empty,
  count,
  children,
}: {
  title: string;
  empty: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col rounded-lg border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-graphite">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-heading text-base font-semibold text-graphite dark:text-white">
          {title}
        </h3>
        <span className="text-xs text-graphite/50 dark:text-white/40">
          {count}
        </span>
      </div>
      {count === 0 ? (
        <p className="mt-3 text-sm text-graphite/60 dark:text-white/60">
          {empty}
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">{children}</ul>
      )}
    </section>
  );
}

export function DeadlinePanel({ rows }: { rows: DeadlineRow[] }) {
  return (
    <Panel
      title="Ближайшие дедлайны"
      empty="Сроков в ближайшее время нет"
      count={rows.length}
    >
      {rows.map((row) => (
        <li key={row.id}>
          <Link
            href={`/tasks/${row.id}`}
            className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-snow dark:hover:bg-white/5"
          >
            <span className="min-w-0">
              <span className="mr-2 text-[11px] font-semibold uppercase tracking-wide text-graphite/50 dark:text-white/40">
                {row.key}
              </span>
              <span className="text-sm text-graphite dark:text-white">
                {row.title}
              </span>
            </span>
            <span
              className={`shrink-0 text-xs ${
                row.overdue
                  ? "font-medium text-danger"
                  : "text-graphite/60 dark:text-white/50"
              }`}
            >
              {row.dateLabel}
            </span>
          </Link>
        </li>
      ))}
    </Panel>
  );
}

export function ActivityPanel({ rows }: { rows: ActivityRow[] }) {
  return (
    <Panel
      title="Последние обновления"
      empty="Изменений пока не было"
      count={rows.length}
    >
      {rows.map((row) => (
        <li key={row.id}>
          <Link
            href={`/tasks/${row.taskId}`}
            className="block rounded-md px-2 py-1.5 transition-colors hover:bg-snow dark:hover:bg-white/5"
          >
            <span className="block truncate text-sm text-graphite dark:text-white">
              <span className="mr-2 text-[11px] font-semibold uppercase tracking-wide text-graphite/50 dark:text-white/40">
                {row.taskKey}
              </span>
              {row.taskTitle}
            </span>
            <span className="mt-0.5 block text-xs text-graphite/60 dark:text-white/50">
              {row.who}: {row.fromLabel} → {row.toLabel} · {row.whenLabel}
            </span>
          </Link>
        </li>
      ))}
    </Panel>
  );
}

export function MyProjectsPanel({ rows }: { rows: MyProjectRow[] }) {
  return (
    <Panel
      title="Мои проекты"
      empty="Вы пока не добавлены в проекты"
      count={rows.length}
    >
      {rows.map((row) => (
        <li key={row.id}>
          <Link
            href={`/projects/${row.id}`}
            className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-snow dark:hover:bg-white/5"
          >
            <span className="min-w-0 truncate text-sm text-graphite dark:text-white">
              {row.name}
            </span>
            <span className="shrink-0 text-xs text-graphite/60 dark:text-white/50">
              {row.openTasks} отк.
            </span>
          </Link>
        </li>
      ))}
    </Panel>
  );
}
