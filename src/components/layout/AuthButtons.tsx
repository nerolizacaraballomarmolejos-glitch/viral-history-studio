"use client";

export function AuthButtons() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 border border-border">
      <div className="h-7 w-7 rounded-full bg-neon/20 flex items-center justify-center text-neon text-xs font-bold">
        G
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium truncate">Invitado</p>
        <p className="text-[10px] text-muted">Clerk opcional · ver README</p>
      </div>
    </div>
  );
}
