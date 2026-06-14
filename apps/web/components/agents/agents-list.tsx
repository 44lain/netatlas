"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { agentStatus, agentStatusLabel, type AgentRecord } from "@/lib/agents/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AgentsListProps {
  agents: AgentRecord[];
}

function statusClass(status: ReturnType<typeof agentStatus>) {
  if (status === "active") return "bg-emerald-500/15 text-emerald-400";
  if (status === "inactive") return "bg-muted text-muted-foreground";
  return "bg-amber-500/15 text-amber-400";
}

export function AgentsList({ agents }: AgentsListProps) {
  const router = useRouter();
  const [revokingId, setRevokingId] = useState<string | null>(null);

  async function revokeAgent(id: string) {
    setRevokingId(id);
    try {
      await fetch(`/api/agents/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setRevokingId(null);
    }
  }

  if (agents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhum agente registrado</CardTitle>
          <CardDescription>Registre um agente para começar a escanear sua rede.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seus agentes</CardTitle>
        <CardDescription>{agents.length} agente(s) registrado(s)</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Último scan</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => {
                const status = agentStatus(agent);
                return (
                  <tr key={agent.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">{agent.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                          statusClass(status)
                        )}
                      >
                        {agentStatusLabel(status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {agent.last_scan_at
                        ? new Intl.DateTimeFormat("pt-BR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          }).format(new Date(agent.last_scan_at))
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={revokingId === agent.id}
                        onClick={() => revokeAgent(agent.id)}
                      >
                        {revokingId === agent.id ? "Revogando…" : "Revogar"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
