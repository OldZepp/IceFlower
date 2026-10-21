import { prisma } from "./prisma";

export type NotificationItem = {
  id: string;
  type: string;
  read: boolean;
  createdAt: Date;
  taskId: string;
  taskKey: string;
  taskTitle: string;
};

export async function getMyNotifications(userId: string): Promise<{
  items: NotificationItem[];
  unread: number;
}> {
  const [rows, unread] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 15,
      include: { task: { select: { key: true, title: true } } },
    }),
    prisma.notification.count({ where: { userId, read: false } }),
  ]);

  return {
    unread,
    items: rows.map((row) => ({
      id: row.id,
      type: row.type,
      read: row.read,
      createdAt: row.createdAt,
      taskId: row.taskId,
      taskKey: row.task.key,
      taskTitle: row.task.title,
    })),
  };
}

export async function notifyAssigned(input: {
  taskId: string;
  assigneeId: string | null;
  actorId: string;
}): Promise<void> {
  if (!input.assigneeId || input.assigneeId === input.actorId) return;
  await prisma.notification.create({
    data: { userId: input.assigneeId, type: "assigned", taskId: input.taskId },
  });
}

export async function notifyComment(input: {
  taskId: string;
  actorId: string;
  recipients: (string | null)[];
}): Promise<void> {
  const unique = [
    ...new Set(
      input.recipients.filter(
        (id): id is string => Boolean(id) && id !== input.actorId,
      ),
    ),
  ];
  if (unique.length === 0) return;
  await prisma.notification.createMany({
    data: unique.map((userId) => ({
      userId,
      type: "comment",
      taskId: input.taskId,
    })),
  });
}
