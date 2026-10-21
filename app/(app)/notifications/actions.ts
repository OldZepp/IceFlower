"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/access";
import { prisma } from "@/lib/prisma";

export async function markReadAction(notificationId: string): Promise<void> {
  const user = await requireUser();
  await prisma.notification.updateMany({
    where: { id: notificationId, userId: user.id },
    data: { read: true },
  });
  revalidatePath("/", "layout");
}

export async function markAllReadAction(): Promise<void> {
  const user = await requireUser();
  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/", "layout");
}
