const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
});

const dateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const date = typeof value === "string" ? new Date(value) : value;
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string | Date | null | undefined): string | null {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : null;
}

export function formatShortDate(value: string | Date | null | undefined): string | null {
  const date = toDate(value);
  return date ? shortDateFormatter.format(date) : null;
}

export function formatDateTime(value: string | Date | null | undefined): string | null {
  const date = toDate(value);
  return date ? dateTimeFormatter.format(date) : null;
}

export function toDateInputValue(value: string | Date | null | undefined): string {
  const date = toDate(value);
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isOverdue(
  deadline: string | Date | null | undefined,
  status?: string,
): boolean {
  if (status === "done") return false;
  const date = toDate(deadline);
  if (!date) return false;
  return date.getTime() < Date.now();
}

export function initialsOf(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
