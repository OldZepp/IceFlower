import Link from "next/link";

const TABS = [
  { value: "board", label: "Доска" },
  { value: "list", label: "Список задач" },
  { value: "members", label: "Участники" },
  { value: "info", label: "Информация" },
] as const;

export type ProjectTabValue = (typeof TABS)[number]["value"];

export function isProjectTab(value: string | undefined): value is ProjectTabValue {
  return TABS.some((tab) => tab.value === value);
}

export function ProjectTabs({
  projectId,
  active,
}: {
  projectId: string;
  active: ProjectTabValue;
}) {
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-black/10 dark:border-white/10">
      {TABS.map((tab) => {
        const isActive = tab.value === active;
        return (
          <Link
            key={tab.value}
            href={`/projects/${projectId}?tab=${tab.value}`}
            className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-aurora text-aurora"
                : "border-transparent text-graphite/70 hover:text-graphite dark:text-white/60 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
