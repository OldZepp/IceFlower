"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isProjectMember, requireUser } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { notifyAssigned, notifyComment } from "@/lib/notifications";
import { createTask, updateTask } from "@/lib/tasks";
import { addComment, deleteComment, updateComment } from "@/lib/comments";
import { isPriority, isTaskStatus } from "@/lib/constants";

export type TaskFormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
} | null;

export type CommentState = { ok?: boolean; error?: string } | null;

function normalizeList(value: string, separator: RegExp): string[] {
  return value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

function readForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    projectId: String(formData.get("projectId") ?? "").trim(),
    status: String(formData.get("status") ?? "backlog"),
    priority: String(formData.get("priority") ?? "medium"),
    assigneeId: String(formData.get("assigneeId") ?? "").trim(),
    deadline: String(formData.get("deadline") ?? "").trim(),
    tags: String(formData.get("tags") ?? ""),
    links: String(formData.get("links") ?? ""),
  };
}

function validate(values: ReturnType<typeof readForm>) {
  const fieldErrors: Record<string, string> = {};
  if (!values.title) fieldErrors.title = "Укажите название.";
  if (values.title.length > 200) fieldErrors.title = "Слишком длинное название.";
  if (!values.projectId) fieldErrors.projectId = "Выберите проект.";
  if (!values.assigneeId) fieldErrors.assigneeId = "Выберите исполнителя.";
  if (!isTaskStatus(values.status)) fieldErrors.status = "Выберите статус.";
  if (!isPriority(values.priority)) fieldErrors.priority = "Выберите приоритет.";

  let deadline: Date | null = null;
  if (values.deadline) {
    const parsed = new Date(values.deadline);
    if (Number.isNaN(parsed.getTime())) {
      fieldErrors.deadline = "Некорректная дата.";
    } else {
      deadline = parsed;
    }
  }

  return { fieldErrors, deadline };
}

export async function createTaskAction(
  _prev: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const user = await requireUser();
  const values = readForm(formData);
  const { fieldErrors, deadline } = validate(values);

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  if (user.role !== "admin" && !(await isProjectMember(values.projectId, user.id))) {
    return { error: "Нет доступа к выбранному проекту." };
  }

  const result = await createTask({
    title: values.title,
    description: values.description || null,
    projectId: values.projectId,
    status: values.status,
    priority: values.priority,
    assigneeId: values.assigneeId,
    deadline,
    tags: normalizeList(values.tags, /,/),
    links: normalizeList(values.links, /[\s,]+/),
    creatorId: user.id,
  });

  if (!result.ok) return { error: result.error };

  await notifyAssigned({
    taskId: result.taskId,
    assigneeId: values.assigneeId,
    actorId: user.id,
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${values.projectId}`);
  revalidatePath("/", "layout");
  redirect(`/tasks/${result.taskId}`);
}

export async function updateTaskAction(
  _prev: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const user = await requireUser();
  const taskId = String(formData.get("taskId") ?? "");
  const values = readForm(formData);
  const { fieldErrors, deadline } = validate(values);

  if (!taskId) return { error: "Задача не найдена." };
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const before = await prisma.task.findUnique({
    where: { id: taskId },
    select: { assigneeId: true },
  });
  if (!before) return { error: "Задача не найдена." };

  const result = await updateTask({
    taskId,
    title: values.title,
    description: values.description || null,
    projectId: values.projectId,
    status: values.status,
    priority: values.priority,
    assigneeId: values.assigneeId,
    deadline,
    tags: normalizeList(values.tags, /,/),
    links: normalizeList(values.links, /[\s,]+/),
    actorId: user.id,
    actorRole: user.role,
  });

  if (!result.ok) return { error: result.error };

  if (values.assigneeId && values.assigneeId !== before.assigneeId) {
    await notifyAssigned({
      taskId,
      assigneeId: values.assigneeId,
      actorId: user.id,
    });
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${values.projectId}`);
  revalidatePath(`/tasks/${taskId}`);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function addCommentAction(
  _prev: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const user = await requireUser();
  const taskId = String(formData.get("taskId") ?? "");
  const text = String(formData.get("text") ?? "");

  if (!taskId) return { error: "Задача не найдена." };

  const result = await addComment({
    taskId,
    authorId: user.id,
    actorRole: user.role,
    text,
  });

  if (!result.ok) return { error: result.error };

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { assigneeId: true, creatorId: true },
  });
  if (task) {
    await notifyComment({
      taskId,
      actorId: user.id,
      recipients: [task.assigneeId, task.creatorId],
    });
  }

  revalidatePath(`/tasks/${taskId}`);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateCommentAction(
  _prev: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const user = await requireUser();
  const commentId = String(formData.get("commentId") ?? "");
  const taskId = String(formData.get("taskId") ?? "");
  const text = String(formData.get("text") ?? "");

  if (!commentId) return { error: "Комментарий не найден." };

  const result = await updateComment({
    commentId,
    actorId: user.id,
    actorRole: user.role,
    text,
  });

  if (!result.ok) return { error: result.error };

  revalidatePath(`/tasks/${taskId}`);
  return { ok: true };
}

export async function deleteCommentAction(
  _prev: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const user = await requireUser();
  const commentId = String(formData.get("commentId") ?? "");
  const taskId = String(formData.get("taskId") ?? "");

  if (!commentId) return { error: "Комментарий не найден." };

  const result = await deleteComment({
    commentId,
    actorId: user.id,
    actorRole: user.role,
  });

  if (!result.ok) return { error: result.error };

  revalidatePath(`/tasks/${taskId}`);
  return { ok: true };
}
