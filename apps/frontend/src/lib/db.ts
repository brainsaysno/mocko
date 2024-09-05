import { LLMModel, MockoType } from '@/model/mocko';
import Dexie, { type EntityTable } from 'dexie';
import { z } from 'zod';

export const dbMockoSchema = z.object({
  id: z.number(),
  type: z.nativeEnum(MockoType),
  name: z.string(),
  content: z.string(),
  example: z.string().optional(),
  structure: z.string().optional(),
  model: z.nativeEnum(LLMModel).optional(),
});

type DatabaseMocko = z.infer<typeof dbMockoSchema>;

export const MOCKO_DB_NAME = 'MockoDatabase';

const db = new Dexie(MOCKO_DB_NAME) as Dexie & {
  mockos: EntityTable<DatabaseMocko, 'id'>;
};

const initialMocko = {
  id: 1,
  type: 'ai-prose',
  name: 'Store Email',
  content:
    'An email from a store manager to a service provider asking for service on an asset',
  model: 'gpt-4o-mini',
};

db.on('populate', (tx) => {
  tx.table('mockos').add(initialMocko);
});

db.version(4).stores({
  mockos: '++id, type, name, content, example, structure, model',
});

export type { DatabaseMocko };
export { db };
