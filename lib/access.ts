import { notFound, redirect } from "next/navigation";
import { auth } from "./auth";
import { prisma } from "./prisma";

export type SessionUser = {
  id: string;
  name: string;
  role: string;
};

export async function requireUser(): Promise<SessionUser> {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.id) redirect("/login");
  return {
    id: user.id,
    name: user.name ?? "",
    role: user.role ?? "member",
  };
}

function projectWhere(user: SessionUser) {
  return user.role === "admin" ? {} : { members: { some: { id: user.id } } };
}

export async function getVisibleProjects(user: SessionUser) {
  return prisma.project.findMany({
    where: projectWhere(user),
    orderBy: { createdAt: "asc" },
    include: {
      lead: { select: { id: true, name: true, avatarInitials: true } },
      members: { select: { id: true, name: true, avatarInitials: true } },
      tasks: { select: { status: true } },
      _count: { select: { members: true } },
    },
  });
}

export async function getProjectForUser(projectId: string, user: SessionUser) {
  const project = await prisma.project.findFirst({
    where: { ...projectWhere(user), id: projectId },
    include: {
      lead: true,
      members: { orderBy: { name: "asc" } },
      tasks: {
        orderBy: { createdAt: "asc" },
        include: { assignee: true, creator: true },
      },
    },
  });

  if (!project) notFound();
  return project;
}

export async function getSelectableUsers() {
  return prisma.user.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true, position: true, avatarInitials: true },
  });
}

export async function canManageProjects(user: SessionUser) {
  return user.role === "admin";
}

export async function isProjectMember(
  projectId: string,
  userId: string,
): Promise<boolean> {
  const member = await prisma.project.findFirst({
    where: { id: projectId, members: { some: { id: userId } } },
    select: { id: true },
  });
  return Boolean(member);
}

export async function getTaskForUser(taskId: string, user: SessionUser) {
  const task = await prisma.task.findFirst({
    where:
      user.role === "admin"
        ? { id: taskId }
        : { id: taskId, project: { members: { some: { id: user.id } } } },
    include: {
      project: { select: { id: true, name: true, leadId: true } },
      assignee: true,
      creator: true,
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: true },
      },
      statusHistory: {
        orderBy: { changedAt: "asc" },
        include: { changedBy: true },
      },
    },
  });

  if (!task) notFound();
  return task;
}

export type AssignableUser = {
  id: string;
  name: string;
  position: string | null;
};

export async function getAssignableUsers(
  projectId: string,
): Promise<AssignableUser[]> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      lead: { select: { id: true, name: true, position: true } },
      members: { select: { id: true, name: true, position: true } },
    },
  });
  if (!project) return [];

  const map = new Map<string, AssignableUser>();
  map.set(project.lead.id, project.lead);
  for (const member of project.members) map.set(member.id, member);

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "ru"));
}
