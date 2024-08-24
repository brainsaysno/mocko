import { LLMModel, MockoType } from '@/model/mocko';
import Dexie, { type EntityTable } from 'dexie';
import { z } from 'zod';

export const dbMockoSchema = z.object({
  id: z.number(),
  type: z.nativeEnum(MockoType),
  name: z.string(),
  prompt: z.string().optional(),
  content: z.string().optional(),
  model: z.nativeEnum(LLMModel).optional(),
});

type Mocko = z.infer<typeof dbMockoSchema>;

const db = new Dexie('MockoDatabase') as Dexie & {
  mockos: EntityTable<Mocko, 'id'>;
};

db.version(1).stores({
  mockos: '++id, type, name, prompt, content, model',
});

export type { Mocko };
export { db };
