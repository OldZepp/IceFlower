import { prisma } from "./prisma";
import { isPriority, isTaskStatus } from "./constants";
import { formatShortDate, initialsOf, isOverdue } from "./format";
import type { BoardTask } from "./types";

export type { BoardTask };

type TaskWithAssignee = {
  id: string;
  key: string;
  title: string;
  status: string;
  priority: string;
  assigneeId: string | null;
  deadline: Date | null;
  tags: string[];
  assignee: { name: string; avatarInitials: string | null } | null;
};

export function toBoardTask(task: TaskWithAssignee): BoardTask {
  return {
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
  };
}

type ChangeStatusInput = {
  taskId: string;
  toStatus: string;
  actorId: string;
  actorRole: string;
};

export type ChangeStatusResult =
  | { ok: true }
  | { ok: false; error: string };

export async function changeTaskStatus(
  input: ChangeStatusInput,
): Promise<ChangeStatusResult> {
  if (!isTaskStatus(input.toStatus)) {
    return { ok: false, error: "Неизвестный статус задачи." };
  }

  const task = await prisma.task.findUnique({
    where: { id: input.taskId },
    select: { id: true, status: true, assigneeId: true, projectId: true },
  });

  if (!task) return { ok: false, error: "Задача не найдена." };
  if (task.status === input.toStatus) return { ok: true };

  if (input.actorRole !== "admin") {
    const member = await prisma.project.findFirst({
      where: { id: task.projectId, members: { some: { id: input.actorId } } },
      select: { id: true },
    });
    if (!member) return { ok: false, error: "Нет доступа к проекту." };
    if (task.assigneeId !== input.actorId) {
      return { ok: false, error: "Менять статус можно только у своих задач." };
    }
  }

  await prisma.$transaction([
    prisma.task.update({
      where: { id: task.id },
      data: { status: input.toStatus },
    }),
    prisma.statusHistory.create({
      data: {
        taskId: task.id,
        fromStatus: task.status,
        toStatus: input.toStatus,
        changedById: input.actorId,
      },
    }),
  ]);

  return { ok: true };
}

export function parseTaskKeyNumber(key: string): number {
  const match = /^ICF-(\d+)$/.exec(key.trim());
  return match ? Number(match[1]) : 0;
}

export async function generateTaskKey(): Promise<string> {
  const rows = await prisma.task.findMany({ select: { key: true } });
  const max = rows.reduce(
    (acc, row) => Math.max(acc, parseTaskKeyNumber(row.key)),
    0,
  );
  return `ICF-${max + 1}`;
}

export type TaskInput = {
  title: string;
  description: string | null;
  projectId: string;
  status: string;
  priority: string;
  assigneeId: string;
  deadline: Date | null;
  tags: string[];
  links: string[];
};

export type CreateTaskResult =
  | { ok: true; taskId: string }
  | { ok: false; error: string };

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

export async function createTask(
  input: TaskInput & { creatorId: string },
): Promise<CreateTaskResult> {
  if (!isTaskStatus(input.status)) {
    return { ok: false, error: "Неизвестный статус задачи." };
  }
  if (!isPriority(input.priority)) {
    return { ok: false, error: "Неизвестный приоритет задачи." };
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const key = await generateTaskKey();
    try {
      const task = await prisma.task.create({
        data: { key, ...input },
        select: { id: true },
      });
      return { ok: true, taskId: task.id };
    } catch (error) {
      if (isUniqueViolation(error)) continue;
      throw error;
    }
  }

  return { ok: false, error: "Не удалось создать задачу. Попробуйте ещё раз." };
}

export type UpdateTaskInput = TaskInput & {
  taskId: string;
  actorId: string;
  actorRole: string;
};

export async function updateTask(
  input: UpdateTaskInput,
): Promise<ChangeStatusResult> {
  if (!isTaskStatus(input.status)) {
    return { ok: false, error: "Неизвестный статус задачи." };
  }
  if (!isPriority(input.priority)) {
    return { ok: false, error: "Неизвестный приоритет задачи." };
  }

  const task = await prisma.task.findUnique({
    where: { id: input.taskId },
    select: {
      id: true,
      status: true,
      projectId: true,
      assigneeId: true,
      creatorId: true,
    },
  });

  if (!task) return { ok: false, error: "Задача не найдена." };

  if (input.actorRole !== "admin") {
    if (task.projectId !== input.projectId) {
      return { ok: false, error: "Проект задачи нельзя изменить." };
    }
    const member = await prisma.project.findFirst({
      where: { id: task.projectId, members: { some: { id: input.actorId } } },
      select: { id: true },
    });
    if (!member) return { ok: false, error: "Нет доступа к проекту." };
    if (task.assigneeId !== input.actorId && task.creatorId !== input.actorId) {
      return { ok: false, error: "Редактировать можно только свои задачи." };
    }
  }

  const statusChanged = task.status !== input.status;

  await prisma.$transaction(async (tx) => {
    await tx.task.update({
      where: { id: task.id },
      data: {
        title: input.title,
        description: input.description,
        projectId: input.projectId,
        status: input.status,
        priority: input.priority,
        assigneeId: input.assigneeId,
        deadline: input.deadline,
        tags: input.tags,
        links: input.links,
      },
    });

    if (statusChanged) {
      await tx.statusHistory.create({
        data: {
          taskId: task.id,
          fromStatus: task.status,
          toStatus: input.status,
          changedById: input.actorId,
        },
      });
    }
  });

  return { ok: true };
}
