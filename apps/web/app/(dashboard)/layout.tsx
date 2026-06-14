import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-1">
      <aside className="border-border bg-sidebar hidden w-60 flex-col border-r md:flex">
        <div className="border-sidebar-border border-b p-4">
          <Link href="/dashboard" className="text-sm font-semibold">
            NetAtlas
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-3 text-sm">
          <Link
            href="/dashboard"
            className="bg-sidebar-accent text-sidebar-accent-foreground rounded-md px-3 py-2 font-medium"
          >
            Dashboard
          </Link>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        {user?.email ? <DashboardHeader email={user.email} /> : null}
        {children}
      </div>
    </div>
  );
}
