"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Film,
  PlusCircle,
  FolderOpen,
  BarChart3,
  Calendar,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthButtons } from "@/components/layout/AuthButtons";

const nav = [
  { href: "/", label: "Dashboard", icon: Film },
  { href: "/nuevo", label: "Nuevo Video", icon: PlusCircle },
  { href: "/videos", label: "Mis Videos", icon: FolderOpen },
  { href: "/tendencias", label: "Tendencias IA", icon: BarChart3 },
  { href: "/analiticas", label: "Analíticas", icon: BarChart3 },
  { href: "#", label: "Calendario", icon: Calendar },
  { href: "#", label: "Ajustes", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col border-r border-border bg-card z-40">
        <div className="flex items-center gap-2 px-5 py-6 border-b border-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon/20 text-neon">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-neon text-neon-glow">
              VIRAL HISTORY
            </h1>
            <p className="text-[10px] text-muted uppercase tracking-widest">Studio</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-neon/10 text-neon shadow-neon-sm"
                    : "text-muted hover:bg-card-hover hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4 space-y-3">
          <AuthButtons />
          <div className="rounded-lg bg-background/50 border border-border p-3">
            <p className="text-xs text-muted mb-1">Plan</p>
            <p className="text-sm font-semibold text-neon">Pro · Ilimitado</p>
            <p className="text-[10px] text-muted mt-1">Videos listos en ~2 min</p>
          </div>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-card/95 backdrop-blur py-2">
        {nav.slice(0, 4).map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-[10px]",
                active ? "text-neon" : "text-muted"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label.split(" ")[0]}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
