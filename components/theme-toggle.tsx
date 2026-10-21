"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Переключить тему"
      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${className}`}
    >
      <span className="hidden sm:inline">{theme === "light" ? "Тёмная тема" : "Светлая тема"}</span>
      <span className="sm:hidden">{theme === "light" ? "🌙" : "☀️"}</span>
    </button>
  );
}