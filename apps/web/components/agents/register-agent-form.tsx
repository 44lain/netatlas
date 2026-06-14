"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterAgentFormProps {
  onCreated: (payload: { id: string; name: string; token: string }) => void;
}

export function RegisterAgentForm({ onCreated }: RegisterAgentFormProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.message ?? "Não foi possível registrar o agente.");
        return;
      }

      onCreated(json.data);
      setName("");
    } catch {
      setError("Erro de rede. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="agent-name">Nome do agente</Label>
        <Input
          id="agent-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Homelab, Escritório"
          required
          disabled={pending}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Registrando…" : "Registrar agente"}
      </Button>
    </form>
  );
}
