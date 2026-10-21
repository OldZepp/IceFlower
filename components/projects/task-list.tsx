import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { StatusBadge } from "@/components/tasks/status-badge";

export type TaskListRow = {
  id: string;
  key: string;
  title: string;
  status: string;
  priority: string;
  assigneeInitials: string | null;
  creatorInitials: string | null;
  deadlineLabel: string | null;
  overdue: boolean;
  tags: string[];
  project?: { id: string; name: string };
};

const thClass =
  "px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-graphite/50 dark:text-white/40";

export function TaskList({
  rows,
  showProject = false,
  hideAssignee = false,
  emptyText = "В этом проекте пока нет задач.",
}: {
  rows: TaskListRow[];
  showProject?: boolean;
  hideAssignee?: boolean;
  emptyText?: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-black/10 bg-white p-6 text-center text-sm text-graphite/60 dark:border-white/10 dark:bg-graphite dark:text-white/60">
        {emptyText}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-black/5 bg-white dark:border-white/10 dark:bg-graphite">
      <table className="min-w-[760px] w-full border-collapse text-sm">
        <thead className="border-b border-black/5 dark:border-white/10">
          <tr>
            <th className={thClass}>Ключ</th>
            <th className={thClass}>Название</th>
            {showProject ? <th className={thClass}>Проект</th> : null}
            <th className={thClass}>Статус</th>
            <th className={thClass}>Приоритет</th>
            {hideAssignee ? null : <th className={thClass}>Исполнитель</th>}
            <th className={thClass}>Дедлайн</th>
            <th className={thClass}>Постановщик</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-black/5 last:border-0 dark:border-white/5"
            >
              <td className="px-3 py-2 font-medium text-graphite/70 dark:text-white/60">
                <Link href={`/tasks/${row.id}`} className="hover:text-aurora">
                  {row.key}
                </Link>
              </td>
              <td className="px-3 py-2">
                <Link
                  href={`/tasks/${row.id}`}
                  className="font-medium text-graphite hover:text-aurora dark:text-white"
                >
                  {row.title}
                </Link>
                {row.tags.length > 0 ? (
                  <span className="ml-2 text-[11px] text-graphite/50 dark:text-white/40">
                    {row.tags.join(" · ")}
                  </span>
                ) : null}
              </td>
              {showProject ? (
                <td className="px-3 py-2">
                  {row.project ? (
                    <Link
                      href={`/projects/${row.project.id}`}
                      className="text-graphite/80 hover:text-aurora dark:text-white/70"
                    >
                      {row.project.name}
                    </Link>
                  ) : (
                    <span className="text-graphite/50 dark:text-white/40">—</span>
                  )}
                </td>
              ) : null}
              <td className="px-3 py-2">
                <StatusBadge value={row.status} />
              </td>
              <td className="px-3 py-2">
                <PriorityBadge value={row.priority} />
              </td>
              {hideAssignee ? null : (
                <td className="px-3 py-2">
                  {row.assigneeInitials ? (
                    <Avatar label={row.assigneeInitials} size="xs" />
                  ) : (
                    <span className="text-graphite/50 dark:text-white/40">—</span>
                  )}
                </td>
              )}
              <td className="px-3 py-2">
                {row.deadlineLabel ? (
                  <span
                    className={
                      row.overdue
                        ? "font-medium text-danger"
                        : "text-graphite/70 dark:text-white/60"
                    }
                  >
                    {row.deadlineLabel}
                  </span>
                ) : (
                  <span className="text-graphite/50 dark:text-white/40">—</span>
                )}
              </td>
              <td className="px-3 py-2">
                {row.creatorInitials ? (
                  <Avatar label={row.creatorInitials} size="xs" />
                ) : (
                  <span className="text-graphite/50 dark:text-white/40">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
