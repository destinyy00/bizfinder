"use client";

import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-between">
      <a href="/" className="font-semibold text-lg">BizFinder</a>
      <button
        className="sm:hidden rounded border px-3 py-1 text-current bg-white dark:bg-black border-gray-300 dark:border-neutral-700"
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
      >
        Menu
      </button>
      <nav className="hidden sm:flex items-center gap-2">
        <a href="/search" className="btn btn-outline">Search</a>
        <a href="/dashboard/my-businesses" className="btn btn-outline">Dashboard</a>
        <a href="/login" className="btn btn-outline">Login</a>
        <a href="/register" className="btn btn-primary">Register</a>
        <ThemeToggle />
      </nav>
      {open && (
        <div className="absolute left-0 top-[56px] w-full border-b bg-white dark:bg-black sm:hidden z-50 shadow">
          <div className="p-3 flex flex-col gap-2">
            <a onClick={() => setOpen(false)} href="/search" className="btn btn-outline">Search</a>
            <a onClick={() => setOpen(false)} href="/dashboard/my-businesses" className="btn btn-outline">Dashboard</a>
            <a onClick={() => setOpen(false)} href="/login" className="btn btn-outline">Login</a>
            <a onClick={() => setOpen(false)} href="/register" className="btn btn-primary">Register</a>
            <div className="pt-2"><ThemeToggle /></div>
          </div>
        </div>
      )}
    </div>
  );
}


