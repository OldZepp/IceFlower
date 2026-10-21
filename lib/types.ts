export type BoardTask = {
  id: string;
  key: string;
  title: string;
  status: string;
  priority: string;
  assigneeId: string | null;
  assigneeInitials: string | null;
  deadlineLabel: string | null;
  overdue: boolean;
  tags: string[];
  projectName?: string;
};
