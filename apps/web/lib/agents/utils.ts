import type { DeviceStatus } from "@/types";

export type AgentRecord = {
  id: string;
  name: string;
  last_scan_at: string | null;
  created_at: string;
};

export type InventoryDevice = {
  id: string;
  scan_id: string;
  ip: string;
  hostname: string | null;
  mac_address: string | null;
  vendor: string | null;
  status: DeviceStatus;
  first_seen_at: string;
};

export function agentStatus(agent: AgentRecord): "pending" | "active" | "inactive" {
  if (!agent.last_scan_at) return "pending";
  const daysSince =
    (Date.now() - new Date(agent.last_scan_at).getTime()) / (1000 * 60 * 60 * 24);
  return daysSince <= 7 ? "active" : "inactive";
}

export function agentStatusLabel(status: ReturnType<typeof agentStatus>): string {
  const labels = { pending: "Pendente", active: "Ativo", inactive: "Inativo" } as const;
  return labels[status];
}
