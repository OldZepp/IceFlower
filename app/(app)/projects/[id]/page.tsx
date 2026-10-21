import Link from "next/link";
import { getAssignableUsers, getProjectForUser, requireUser } from "@/lib/access";
import { ProjectTabs, isProjectTab } from "@/components/projects/project-tabs";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import { KanbanBoard } from "@/components/projects/board/kanban-board";
import { TaskList, type TaskListRow } from "@/components/projects/task-list";
import {
  MembersList,
  type MemberItem,
} from "@/components/projects/members-list";
import {
  ProjectInfo,
  type ProjectInfoData,
} from "@/components/projects/project-info";
import { toBoardTask } from "@/lib/tasks";
import { formatDate, initialsOf } from "@/lib/format";
import { TASK_STATUSES } from "@/lib/constants";

export const instant = false;

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const activeTab = isProjectTab(tab) ? tab : "board";

  const user = await requireUser();
  const project = await getProjectForUser(id, user);

  const boardTasks = project.tasks.map(toBoardTask);
  const assignees =
    activeTab === "board" ? await getAssignableUsers(project.id) : [];

  const listRows: TaskListRow[] = project.tasks.map((task) => ({
    ...toBoardTask(task),
    creatorInitials:
      task.creator.avatarInitials ?? initialsOf(task.creator.name),
  }));

  const members: MemberItem[] = project.members.map((member) => ({
    id: member.id,
    name: member.name,
    position: member.position,
    email: member.email,
    initials: member.avatarInitials ?? initialsOf(member.name),
  }));

  const info: ProjectInfoData = {
    description: project.description,
    status: project.status,
    leadName: project.lead.name,
    leadInitials:
      project.lead.avatarInitials ?? initialsOf(project.lead.name),
    startDateLabel: formatDate(project.startDate),
    endDateLabel: formatDate(project.endDate),
    memberCount: project.members.length,
    totalTasks: project.tasks.length,
    statusCounts: TASK_STATUSES.map((status) => ({
      status: status.value,
      count: project.tasks.filter((task) => task.status === status.value).length,
    })),
  };

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/projects"
          className="text-xs font-medium text-aurora hover:underline"
        >
          ← Все проекты
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold text-graphite md:text-3xl dark:text-white">
              {project.name}
            </h1>
            <p className="mt-1 text-sm text-graphite/70 dark:text-white/60">
              Руководитель: {project.lead.name} · {project.tasks.length} задач ·{" "}
              {project.members.length} участников
            </p>
          </div>
          <ProjectStatusBadge value={project.status} />
        </div>
      </div>

      <ProjectTabs projectId={project.id} active={activeTab} />

      {activeTab === "board" ? (
        <KanbanBoard
          projectId={project.id}
          projectName={project.name}
          tasks={boardTasks}
          currentUserId={user.id}
          role={user.role}
          assignees={assignees}
        />
      ) : null}

      {activeTab === "list" ? <TaskList rows={listRows} /> : null}

      {activeTab === "members" ? (
        <MembersList members={members} leadId={project.leadId} />
      ) : null}

      {activeTab === "info" ? <ProjectInfo project={info} /> : null}
    </div>
  );
}
