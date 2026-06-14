import { cn } from "@/lib/utils";

interface AuthMessageProps {
  error?: string;
  success?: string;
  className?: string;
}

export function AuthMessage({ error, success, className }: AuthMessageProps) {
  if (!error && !success) return null;

  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border px-3 py-2 text-sm",
        error && "border-destructive/50 bg-destructive/10 text-destructive",
        success && "border-primary/30 bg-primary/10 text-foreground",
        className
      )}
    >
      {error ?? success}
    </div>
  );
}
