"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AgentsList } from "@/components/agents/agents-list";
import { RegisterAgentForm } from "@/components/agents/register-agent-form";
import { TokenReveal } from "@/components/agents/token-reveal";
import type { AgentRecord } from "@/lib/agents/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AgentsPageClientProps {
  agents: AgentRecord[];
  apiUrl: string;
}

export function AgentsPageClient({ agents, apiUrl }: AgentsPageClientProps) {
  const router = useRouter();
  const [created, setCreated] = useState<{
    id: string;
    name: string;
    token: string;
  } | null>(null);

  return (
    <div className="space-y-6">
      {created ? (
        <TokenReveal
          token={created.token}
          agentId={created.id}
          apiUrl={apiUrl}
          onClose={() => setCreated(null)}
        />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Novo agente</CardTitle>
          <CardDescription>
            Registre um agente para executar scans na sua rede local.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterAgentForm
            onCreated={(payload) => {
              setCreated(payload);
              router.refresh();
            }}
          />
        </CardContent>
      </Card>

      <AgentsList agents={agents} />
    </div>
  );
}
