import { prisma } from "./prisma";

export type CommentResult = { ok: true } | { ok: false; error: string };

function cleanText(text: string): { text: string } | { error: string } {
  const value = text.trim();
  if (!value) return { error: "Введите текст комментария." };
  if (value.length > 2000) return { error: "Комментарий слишком длинный." };
  return { text: value };
}

async function canAccessTask(
  taskId: string,
  actorId: string,
  actorRole: string,
): Promise<boolean> {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { projectId: true },
  });
  if (!task) return false;
  if (actorRole === "admin") return true;
  const member = await prisma.project.findFirst({
    where: { id: task.projectId, members: { some: { id: actorId } } },
    select: { id: true },
  });
  return Boolean(member);
}

export async function addComment(input: {
  taskId: string;
  authorId: string;
  actorRole: string;
  text: string;
}): Promise<CommentResult> {
  const cleaned = cleanText(input.text);
  if ("error" in cleaned) return { ok: false, error: cleaned.error };

  if (!(await canAccessTask(input.taskId, input.authorId, input.actorRole))) {
    return { ok: false, error: "Нет доступа к задаче." };
  }

  await prisma.comment.create({
    data: {
      taskId: input.taskId,
      authorId: input.authorId,
      text: cleaned.text,
    },
  });

  return { ok: true };
}

export async function updateComment(input: {
  commentId: string;
  actorId: string;
  actorRole: string;
  text: string;
}): Promise<CommentResult> {
  const cleaned = cleanText(input.text);
  if ("error" in cleaned) return { ok: false, error: cleaned.error };

  const comment = await prisma.comment.findUnique({
    where: { id: input.commentId },
    select: { id: true, authorId: true },
  });
  if (!comment) return { ok: false, error: "Комментарий не найден." };
  if (input.actorRole !== "admin" && comment.authorId !== input.actorId) {
    return { ok: false, error: "Можно редактировать только свои комментарии." };
  }

  await prisma.comment.update({
    where: { id: comment.id },
    data: { text: cleaned.text, editedAt: new Date() },
  });

  return { ok: true };
}

export async function deleteComment(input: {
  commentId: string;
  actorId: string;
  actorRole: string;
}): Promise<CommentResult> {
  const comment = await prisma.comment.findUnique({
    where: { id: input.commentId },
    select: { id: true, authorId: true },
  });
  if (!comment) return { ok: false, error: "Комментарий не найден." };
  if (input.actorRole !== "admin" && comment.authorId !== input.actorId) {
    return { ok: false, error: "Можно удалять только свои комментарии." };
  }

  await prisma.comment.delete({ where: { id: comment.id } });
  return { ok: true };
}
