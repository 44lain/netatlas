import { logout } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  email: string;
}

export function DashboardHeader({ email }: DashboardHeaderProps) {
  return (
    <header className="border-border flex h-14 items-center justify-between border-b px-6">
      <p className="text-muted-foreground text-sm">
        Conectado como <span className="text-foreground font-medium">{email}</span>
      </p>
      <form action={logout}>
        <Button type="submit" variant="outline" size="sm">
          Sair
        </Button>
      </form>
    </header>
  );
}
