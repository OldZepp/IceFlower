"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/access";
import { prisma } from "@/lib/prisma";

export type ProfileState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
} | null;

export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const user = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim();

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Укажите имя.";
  if (name.length > 100) fieldErrors.name = "Слишком длинное имя.";
  if (position.length > 100)
    fieldErrors.position = "Слишком длинная должность.";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  await prisma.user.update({
    where: { id: user.id },
    data: { name, position: position || null },
  });

  revalidatePath("/profile");
  revalidatePath("/", "layout");
  return { ok: true };
}
