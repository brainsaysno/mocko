import { z } from 'zod';

export enum MockoType {
  AIProse = 'ai-prose',
  AIJson = 'ai-json',
  Deterministic = 'deterministic',
  Fixed = 'fixed',
}

export enum LLMModel {
  Gpt4o = 'gpt-4o',
  Gpt4oMini = 'gpt-4o-mini',
  Gpt4Turbo = 'gpt-4-turbo',
  Gpt35Turbo = 'gpt-3.5-turbo',
}

export const dbMockoSchema = z.object({
  id: z.number(),
  type: z.nativeEnum(MockoType),
  name: z.string(),
  content: z.string(),
  example: z.string().optional(),
  structure: z.string().optional(),
  model: z.nativeEnum(LLMModel).optional(),
});

export type DatabaseMocko = z.infer<typeof dbMockoSchema>;
