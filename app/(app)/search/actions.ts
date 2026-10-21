"use server";

import { requireUser } from "@/lib/access";
import { prisma } from "@/lib/prisma";

export type SearchResults = {
  projects: { id: string; name: string }[];
  tasks: { id: string; key: string; title: string; projectName: string }[];
};

export async function searchAction(query: string): Promise<SearchResults> {
  const user = await requireUser();
  const q = query.trim().toLowerCase();
  if (q.length < 2) return { projects: [], tasks: [] };

  const projects = await prisma.project.findMany({
    where:
      user.role === "admin"
        ? {}
        : { members: { some: { id: user.id } } },
    select: {
      id: true,
      name: true,
      tasks: { select: { id: true, key: true, title: true } },
    },
  });

  const foundProjects: SearchResults["projects"] = [];
  const foundTasks: SearchResults["tasks"] = [];

  for (const project of projects) {
    if (project.name.toLowerCase().includes(q)) {
      foundProjects.push({ id: project.id, name: project.name });
    }
    for (const task of project.tasks) {
      if (
        task.key.toLowerCase().includes(q) ||
        task.title.toLowerCase().includes(q)
      ) {
        foundTasks.push({
          id: task.id,
          key: task.key,
          title: task.title,
          projectName: project.name,
        });
      }
    }
  }

  return {
    projects: foundProjects.slice(0, 10),
    tasks: foundTasks.slice(0, 10),
  };
}
