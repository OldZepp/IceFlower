import Link from "next/link";

const VIEWS = [
  { value: "list", label: "Список" },
  { value: "board", label: "Доска" },
] as const;

export type ViewSwitchValue = (typeof VIEWS)[number]["value"];

export function ViewSwitch({
  value,
  listHref,
  boardHref,
}: {
  value: ViewSwitchValue;
  listHref: string;
  boardHref: string;
}) {
  return (
    <div
      role="group"
      aria-label="Вид отображения"
      className="inline-flex rounded-md border border-graphite/20 p-0.5 dark:border-white/20"
    >
      {VIEWS.map((view) => {
        const active = view.value === value;
        return (
          <Link
            key={view.value}
            href={view.value === "list" ? listHref : boardHref}
            aria-current={active ? "page" : undefined}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "bg-aurora text-white"
                : "text-graphite/70 hover:text-graphite dark:text-white/60 dark:hover:text-white"
            }`}
          >
            {view.label}
          </Link>
        );
      })}
    </div>
  );
}
