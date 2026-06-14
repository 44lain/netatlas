import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="space-y-2 text-center">
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          Network Discovery & Monitoring
        </p>
        <h1 className="text-4xl font-bold tracking-tight">NetAtlas</h1>
        <p className="text-muted-foreground max-w-md">
          Plataforma open source para descoberta, inventário e monitoramento de redes locais.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/login" className={cn(buttonVariants())}>
          Entrar
        </Link>
        <Link href="/register" className={cn(buttonVariants({ variant: "outline" }))}>
          Criar conta
        </Link>
      </div>
    </main>
  );
}
