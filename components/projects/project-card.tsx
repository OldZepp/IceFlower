import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { ProjectStatusBadge } from "./project-status-badge";

export type ProjectCardData = {
  id: string;
  name: string;
  description: string | null;
  leadName: string;
  leadInitials: string;
  openTasks: number;
  totalTasks: number;
  members: { id: string; initials: string }[];
  memberCount: number;
  endDateLabel: string | null;
  status: string;
};

const dtClass =
  "text-[11px] uppercase tracking-wide text-graphite/50 dark:text-white/40";

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const shown = project.members.slice(0, 4);
  const rest = project.memberCount - shown.length;

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex flex-col rounded-lg border border-black/5 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-graphite"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-base font-semibold leading-snug text-graphite group-hover:text-aurora dark:text-white">
          {project.name}
        </h3>
        <ProjectStatusBadge value={project.status} />
      </div>

      {project.description ? (
        <p className="mt-2 line-clamp-2 text-sm text-graphite/70 dark:text-white/60">
          {project.description}
        </p>
      ) : null}

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-graphite dark:text-white">
        <div>
          <dt className={dtClass}>Руководитель</dt>
          <dd className="mt-1 flex items-center gap-2">
            <Avatar label={project.leadInitials} size="xs" />
            <span className="truncate">{project.leadName}</span>
          </dd>
        </div>
        <div>
          <dt className={dtClass}>Дедлайн</dt>
          <dd className="mt-1">{project.endDateLabel ?? "—"}</dd>
        </div>
        <div>
          <dt className={dtClass}>Открытых задач</dt>
          <dd className="mt-1">
            {project.openTasks} из {project.totalTasks}
          </dd>
        </div>
        <div>
          <dt className={dtClass}>Участники</dt>
          <dd className="mt-1 flex items-center gap-1">
            {shown.map((member) => (
              <Avatar key={member.id} label={member.initials} size="xs" />
            ))}
            {rest > 0 ? (
              <span className="text-xs text-graphite/60 dark:text-white/60">
                +{rest}
              </span>
            ) : null}
          </dd>
        </div>
      </dl>
    </Link>
  );
}
