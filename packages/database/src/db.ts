import Dexie, { type EntityTable } from 'dexie';
import { type DatabaseMocko } from './types';

export const MOCKO_DB_NAME = 'MockoDatabase';

export const createMockoDatabase = () => {
  const db = new Dexie(MOCKO_DB_NAME) as Dexie & {
    mockos: EntityTable<DatabaseMocko, 'id'>;
  };

  db.version(4).stores({
    mockos: '++id, type, name, content, example, structure, model',
  });

  return db;
};
