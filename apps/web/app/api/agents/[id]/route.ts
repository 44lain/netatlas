import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Sessão inválida." },
      { status: 401 }
    );
  }

  const { data, error } = await supabase.from("agents").delete().eq("id", id).select("id").maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Não foi possível revogar o agente." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: "Agente não encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: { id: data.id } });
}
