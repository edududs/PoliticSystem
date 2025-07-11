"use client";

import { useState } from "react";
import Link from "next/link";
import { SIDEBAR_ITEMS } from "./sidebar.config";
import { LucideDynamicIcon } from "./LucideDynamicIcon";
import { cn } from "@/lib/utils";

// Function to render Lucide icon dynamically
function renderIcon(icon: string) {
  // Lucide espera o nome do ícone em minúsculo/kebab-case
  const lucideName = icon.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  return <LucideDynamicIcon name={lucideName} className="w-5 h-5" />;
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out z-20",
        collapsed ? "w-16" : "w-56"
      )}
      aria-label="Sidebar"
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
        <span
          className={cn(
            "font-bold text-lg text-primary transition-opacity duration-200",
            collapsed && "opacity-0 pointer-events-none"
          )}
        >
          PoliticSystem
        </span>
        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((v) => !v)}
          className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {collapsed ? (
            <LucideDynamicIcon name="chevron-right" className="w-5 h-5" />
          ) : (
            <LucideDynamicIcon name="chevron-left" className="w-5 h-5" />
          )}
        </button>
      </div>
      <nav className="flex-1 py-4 flex flex-col gap-1">
        {SIDEBAR_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors group focus:outline-none focus:ring-2 focus:ring-primary",
              collapsed && "justify-center px-2"
            )}
            tabIndex={0}
          >
            {renderIcon(item.icon)}
            <span
              className={cn(
                "transition-all duration-200",
                collapsed
                  ? "opacity-0 w-0 overflow-hidden"
                  : "opacity-100 w-auto ml-2"
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
      <div className="flex-shrink-0 p-4 border-t border-gray-100">
        {/* Espaço para futuro: avatar, logout, etc. */}
      </div>
    </aside>
  );
}
