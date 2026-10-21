import { Avatar } from "../avatar";

export type TeamRow = {
  id: string;
  name: string;
  position: string;
  email: string;
  initials: string;
  active: number;
  overdue: number;
};

export function TeamList({
  rows,
  maxActive,
}: {
  rows: TeamRow[];
  maxActive: number;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) => {
        const load = Math.round((row.active / Math.max(1, maxActive)) * 100);
        return (
          <li
            key={row.id}
            className="flex flex-wrap items-center gap-4 rounded-lg border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-graphite"
          >
            <Avatar label={row.initials} size="md" />

            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-sm font-semibold text-graphite dark:text-white">
                {row.name}
              </p>
              <p className="truncate text-xs text-graphite/60 dark:text-white/50">
                {row.position} · {row.email}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[11px] font-medium uppercase tracking-wide text-graphite/50 dark:text-white/40">
                  Активных
                </p>
                <p className="text-sm font-semibold text-graphite dark:text-white">
                  {row.active}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium uppercase tracking-wide text-graphite/50 dark:text-white/40">
                  Просрочено
                </p>
                <p
                  className={`text-sm font-semibold ${
                    row.overdue > 0
                      ? "text-danger"
                      : "text-graphite dark:text-white"
                  }`}
                >
                  {row.overdue}
                </p>
              </div>
            </div>

            <div className="w-full sm:w-40">
              <div className="flex items-center justify-between text-[11px] text-graphite/50 dark:text-white/40">
                <span>Загрузка</span>
                <span>{row.active}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-aurora"
                  style={{ width: `${load}%` }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
