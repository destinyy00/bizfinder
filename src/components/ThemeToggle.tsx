"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    try {
      const key = 'bizfinder-theme';
      if (typeof window !== 'undefined' && !localStorage.getItem(key)) {
        localStorage.setItem(key, 'dark');
        setTheme('dark');
      }
    } catch {}
  }, [setTheme]);
  if (!mounted) return null;
  const isDark = theme === "dark";
  return (
    <button
      className="rounded border px-3 py-1 text-sm dark:bg-neutral-900 dark:text-white"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}


