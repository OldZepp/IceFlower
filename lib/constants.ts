export const TASK_STATUSES = [
  { value: "backlog", label: "Бэклог" },
  { value: "planned", label: "Запланировано" },
  { value: "in_progress", label: "В работе" },
  { value: "review", label: "На проверке" },
  { value: "done", label: "Выполнено" },
] as const;

export type TaskStatusValue = (typeof TASK_STATUSES)[number]["value"];

export const PROJECT_STATUSES = [
  { value: "planning", label: "Планирование" },
  { value: "active", label: "Активный" },
  { value: "paused", label: "На паузе" },
  { value: "completed", label: "Завершён" },
  { value: "archived", label: "Архив" },
] as const;

export const PRIORITIES = [
  { value: "low", label: "Низкий" },
  { value: "medium", label: "Средний" },
  { value: "high", label: "Высокий" },
  { value: "critical", label: "Критический" },
] as const;

export const PRIORITY_LABELS: Record<string, string> = Object.fromEntries(
  PRIORITIES.map((p) => [p.value, p.label]),
);

export const STATUS_LABELS: Record<string, string> = Object.fromEntries(
  TASK_STATUSES.map((s) => [s.value, s.label]),
);

export const PROJECT_STATUS_LABELS: Record<string, string> = Object.fromEntries(
  PROJECT_STATUSES.map((s) => [s.value, s.label]),
);

export function isTaskStatus(value: string): value is TaskStatusValue {
  return TASK_STATUSES.some((s) => s.value === value);
}

export function isProjectStatus(value: string) {
  return PROJECT_STATUSES.some((s) => s.value === value);
}

export type PriorityValue = (typeof PRIORITIES)[number]["value"];

export function isPriority(value: string): value is PriorityValue {
  return PRIORITIES.some((p) => p.value === value);
}

export const DUE_FILTERS = [
  { value: "all", label: "Все" },
  { value: "overdue", label: "Просроченные" },
  { value: "today", label: "Сегодня" },
  { value: "week", label: "На этой неделе" },
  { value: "month", label: "В этом месяце" },
  { value: "none", label: "Без срока" },
] as const;

export type DueFilterValue = (typeof DUE_FILTERS)[number]["value"];

export function isDueFilter(value: string): value is DueFilterValue {
  return DUE_FILTERS.some((filter) => filter.value === value);
}
