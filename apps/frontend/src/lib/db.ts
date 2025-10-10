import {
  createMockoDatabase,
  type DatabaseMocko,
  dbMockoSchema,
  MOCKO_DB_NAME,
} from '@mocko/database';

const db = createMockoDatabase();

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

export type { DatabaseMocko };
export { db, dbMockoSchema, MOCKO_DB_NAME };
