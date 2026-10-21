"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { isProjectStatus } from "@/lib/constants";
import { changeTaskStatus } from "@/lib/tasks";

export type UpdateStatusState = { ok: boolean; error?: string };

export async function updateTaskStatusAction(input: {
  taskId: string;
  toStatus: string;
  projectId?: string;
}): Promise<UpdateStatusState> {
  const user = await requireUser();

  const result = await changeTaskStatus({
    taskId: input.taskId,
    toStatus: input.toStatus,
    actorId: user.id,
    actorRole: user.role,
  });

  if (result.ok) {
    revalidatePath("/projects");
    if (input.projectId) revalidatePath(`/projects/${input.projectId}`);
    revalidatePath("/tasks/my");
  }

  return result;
}

export type CreateProjectState = { error?: string } | null;

export async function createProjectAction(
  _prev: CreateProjectState,
  formData: FormData,
): Promise<CreateProjectState> {
  const user = await requireUser();
  if (user.role !== "admin") {
    return { error: "Создавать проекты может только администратор." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const leadId = String(formData.get("leadId") ?? "").trim();
  const status = String(formData.get("status") ?? "planning");
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  const memberIds = formData
    .getAll("memberIds")
    .map(String)
    .filter(Boolean);

  if (!name) return { error: "Укажите название проекта." };
  if (!leadId) return { error: "Выберите руководителя." };
  if (!isProjectStatus(status)) return { error: "Некорректный статус проекта." };

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  if (start && end && start.getTime() > end.getTime()) {
    return { error: "Дата завершения не может быть раньше даты старта." };
  }

  const project = await prisma.project.create({
    data: {
      name,
      description: description || null,
      leadId,
      status,
      startDate: start,
      endDate: end,
      members: { connect: [...new Set(memberIds)].map((id) => ({ id })) },
    },
    select: { id: true },
  });

  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}
