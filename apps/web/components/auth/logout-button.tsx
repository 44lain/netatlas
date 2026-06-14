"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  /** Estilo compacto para item de menu dropdown */
  variant?: "menu" | "button";
  className?: string;
}

export function LogoutButton({ variant = "button", className }: LogoutButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={pending}
        className={cn(
          "text-danger hover:bg-danger/10 flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors outline-none disabled:opacity-60",
          className
        )}
      >
        <LogOut className="size-4 shrink-0" />
        {pending ? "Saindo…" : "Sair da conta"}
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={handleLogout}
      disabled={pending}
      className={className}
    >
      <LogOut className="size-4" />
      {pending ? "Saindo…" : "Sair da conta"}
    </Button>
  );
}
