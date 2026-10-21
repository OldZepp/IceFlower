export function Avatar({
  label,
  size = "md",
  className = "",
}: {
  label: string;
  size?: "xs" | "sm" | "md";
  className?: string;
}) {
  const sizes = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-7 w-7 text-[11px]",
    md: "h-9 w-9 text-xs",
  } as const;

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-aurora font-semibold text-white ${sizes[size]} ${className}`}
      title={label}
    >
      {label}
    </span>
  );
}
