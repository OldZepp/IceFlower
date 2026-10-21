import { ProjectStatusBadge } from "./project-status-badge";
import { STATUS_LABELS } from "@/lib/constants";

export type ProjectInfoData = {
  description: string | null;
  status: string;
  leadName: string;
  leadInitials: string;
  startDateLabel: string | null;
  endDateLabel: string | null;
  memberCount: number;
  statusCounts: { status: string; count: number }[];
  totalTasks: number;
};

const labelClass =
  "text-[11px] uppercase tracking-wide text-graphite/50 dark:text-white/40";

export function ProjectInfo({ project }: { project: ProjectInfoData }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-graphite">
        <h3 className="font-heading text-sm font-semibold text-graphite dark:text-white">
          Описание
        </h3>
        <p className="mt-2 text-sm text-graphite/80 dark:text-white/70">
          {project.description ?? "Описание не добавлено."}
        </p>
      </div>

      <dl className="grid gap-4 rounded-lg border border-black/5 bg-white p-4 sm:grid-cols-4 dark:border-white/10 dark:bg-graphite">
        <div>
          <dt className={labelClass}>Статус</dt>
          <dd className="mt-1">
            <ProjectStatusBadge value={project.status} />
          </dd>
        </div>
        <div>
          <dt className={labelClass}>Руководитель</dt>
          <dd className="mt-1 text-sm text-graphite dark:text-white">
            {project.leadName}
          </dd>
        </div>
        <div>
          <dt className={labelClass}>Старт</dt>
          <dd className="mt-1 text-sm text-graphite dark:text-white">
            {project.startDateLabel ?? "—"}
          </dd>
        </div>
        <div>
          <dt className={labelClass}>Завершение</dt>
          <dd className="mt-1 text-sm text-graphite dark:text-white">
            {project.endDateLabel ?? "—"}
          </dd>
        </div>
      </dl>

      <div className="rounded-lg border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-graphite">
        <h3 className="font-heading text-sm font-semibold text-graphite dark:text-white">
          Задачи по статусам
        </h3>
        <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {project.statusCounts.map((item) => (
            <div key={item.status}>
              <dt className={labelClass}>
                {STATUS_LABELS[item.status] ?? item.status}
              </dt>
              <dd className="mt-1 font-heading text-lg font-semibold text-graphite dark:text-white">
                {item.count}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-graphite/60 dark:text-white/50">
          Всего задач: {project.totalTasks}. Участников: {project.memberCount}.
        </p>
      </div>
    </div>
  );
}
