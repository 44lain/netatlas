import { z } from "zod";

export const createAgentSchema = z.object({
  name: z.string().min(1, "Informe um nome para o agente").max(80),
});
