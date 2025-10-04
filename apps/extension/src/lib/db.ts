import Dexie, { type EntityTable } from 'dexie';
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

export const MOCKO_DB_NAME = 'MockoDatabase';

const db = new Dexie(MOCKO_DB_NAME) as Dexie & {
  mockos: EntityTable<DatabaseMocko, 'id'>;
};

db.version(4).stores({
  mockos: '++id, type, name, content, example, structure, model',
});

export { db };
