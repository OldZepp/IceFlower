import { prisma } from "./prisma";
import type { SessionUser } from "./access";
import {
  isDueFilter,
  isPriority,
  isTaskStatus,
  type DueFilterValue,
} from "./constants";
import { formatShortDate, initialsOf, isOverdue } from "./format";
import type { BoardTask } from "./types";

export type MyTasksView = "list" | "board";

export type MyTasksQuery = {
  view: MyTasksView;
  q: string;
  status: string | null;
  projectId: string | null;
  priority: string | null;
  due: DueFilterValue;
};

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function parseMyTasksQuery(
  params: Record<string, string | string[] | undefined>,
): MyTasksQuery {
  const status = firstValue(params.status);
  const priority = firstValue(params.priority);
  const due = firstValue(params.due);

  return {
    view: firstValue(params.view) === "board" ? "board" : "list",
    q: firstValue(params.q).trim(),
    status: isTaskStatus(status) ? status : null,
    projectId: firstValue(params.project).trim() || null,
    priority: isPriority(priority) ? priority : null,
    due: isDueFilter(due) ? due : "all",
  };
}

export function hasActiveFilters(query: MyTasksQuery): boolean {
  return Boolean(
    query.q || query.status || query.projectId || query.priority ||
      query.due !== "all",
  );
}

export function myTasksHref(
  query: MyTasksQuery,
  overrides: Partial<MyTasksQuery> = {},
): string {
  const merged = { ...query, ...overrides };
  const params = new URLSearchParams();

  if (merged.q) params.set("q", merged.q);
  if (merged.status) params.set("status", merged.status);
  if (merged.projectId) params.set("project", merged.projectId);
  if (merged.priority) params.set("priority", merged.priority);
  if (merged.due !== "all") params.set("due", merged.due);
  if (merged.view !== "list") params.set("view", merged.view);

  const search = params.toString();
  return search ? `/tasks/my?${search}` : "/tasks/my";
}

export type MyTask = BoardTask & {
  projectId: string;
  projectName: string;
  creatorName: string;
  creatorInitials: string;
  deadline: Date | null;
};

function startOfDay(base: Date): Date {
  return new Date(base.getFullYear(), base.getMonth(), base.getDate());
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function dueBounds(due: DueFilterValue): { from: Date; to: Date } | null {
  const now = new Date();
  const today = startOfDay(now);

  if (due === "today") return { from: today, to: addDays(today, 1) };
  if (due === "week") {
    const weekday = (today.getDay() + 6) % 7;
    const monday = addDays(today, -weekday);
    return { from: monday, to: addDays(monday, 7) };
  }
  if (due === "month") {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return { from: monthStart, to: nextMonth };
  }

  return null;
}

function matchesDue(task: MyTask, due: DueFilterValue): boolean {
  if (due === "all") return true;
  if (due === "none") return task.deadline === null;
  if (due === "overdue") return task.overdue;
  if (task.deadline === null) return false;

  const bounds = dueBounds(due);
  if (!bounds) return true;
  const time = task.deadline.getTime();
  return time >= bounds.from.getTime() && time < bounds.to.getTime();
}

function compareTasks(a: MyTask, b: MyTask): number {
  const aTime = a.deadline?.getTime() ?? null;
  const bTime = b.deadline?.getTime() ?? null;

  if (aTime === null && bTime === null) return a.key.localeCompare(b.key);
  if (aTime === null) return 1;
  if (bTime === null) return -1;
  if (aTime !== bTime) return aTime - bTime;
  return a.key.localeCompare(b.key);
}

export async function getMyTasks(
  userId: string,
  query: MyTasksQuery,
): Promise<MyTask[]> {
  const tasks = await prisma.task.findMany({
    where: {
      assigneeId: userId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.projectId ? { projectId: query.projectId } : {}),
      ...(query.priority ? { priority: query.priority } : {}),
    },
    orderBy: { createdAt: "asc" },
    include: {
      project: { select: { id: true, name: true } },
      creator: { select: { name: true, avatarInitials: true } },
      assignee: { select: { name: true, avatarInitials: true } },
    },
  });

  const needle = query.q.toLocaleLowerCase("ru");

  return tasks
    .map<MyTask>((task) => ({
      id: task.id,
      key: task.key,
      title: task.title,
      status: task.status,
      priority: task.priority,
      assigneeId: task.assigneeId,
      assigneeInitials:
        task.assignee?.avatarInitials ??
        (task.assignee ? initialsOf(task.assignee.name) : null),
      deadlineLabel: formatShortDate(task.deadline),
      overdue: isOverdue(task.deadline, task.status),
      tags: task.tags,
      projectName: task.project.name,
      projectId: task.project.id,
      deadline: task.deadline,
      creatorName: task.creator.name,
      creatorInitials:
        task.creator.avatarInitials ?? initialsOf(task.creator.name),
    }))
    .filter((task) => (needle ? task.title.toLocaleLowerCase("ru").includes(needle) : true))
    .filter((task) => matchesDue(task, query.due))
    .sort(compareTasks);
}

export type ProjectOption = {
  id: string;
  name: string;
};

export async function getFilterProjects(
  user: SessionUser,
): Promise<ProjectOption[]> {
  return prisma.project.findMany({
    where:
      user.role === "admin" ? {} : { members: { some: { id: user.id } } },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}
