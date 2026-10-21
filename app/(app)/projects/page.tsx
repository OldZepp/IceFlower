import Link from "next/link";
import { getVisibleProjects, requireUser } from "@/lib/access";
import {
  ProjectCard,
  type ProjectCardData,
} from "@/components/projects/project-card";
import { formatDate, initialsOf } from "@/lib/format";

export const instant = false;

export default async function ProjectsPage() {
  const user = await requireUser();
  const projects = await getVisibleProjects(user);

  const cards: ProjectCardData[] = projects.map((project) => ({
    id: project.id,
    name: project.name,
    description: project.description,
    leadName: project.lead.name,
    leadInitials:
      project.lead.avatarInitials ?? initialsOf(project.lead.name),
    openTasks: project.tasks.filter((task) => task.status !== "done").length,
    totalTasks: project.tasks.length,
    members: project.members.map((member) => ({
      id: member.id,
      initials: member.avatarInitials ?? initialsOf(member.name),
    })),
    memberCount: project._count.members,
    endDateLabel: formatDate(project.endDate),
    status: project.status,
  }));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-graphite md:text-3xl dark:text-white">
            Проекты
          </h1>
          <p className="mt-1 text-sm text-graphite/70 dark:text-white/60">
            {user.role === "admin"
              ? "Все проекты компании"
              : "Проекты, в которых вы участвуете"}{" "}
            · {cards.length}
          </p>
        </div>

        {user.role === "admin" ? (
          <Link
            href="/projects/new"
            className="rounded-md bg-sun px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sun/90"
          >
            Создать проект
          </Link>
        ) : null}
      </header>

      {cards.length === 0 ? (
        <p className="rounded-lg border border-dashed border-black/10 bg-white p-6 text-center text-sm text-graphite/60 dark:border-white/10 dark:bg-graphite dark:text-white/60">
          Проектов пока нет.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
