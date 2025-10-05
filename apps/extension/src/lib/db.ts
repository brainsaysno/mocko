import {
  createMockoDatabase,
  type DatabaseMocko,
  dbMockoSchema,
  MOCKO_DB_NAME,
  MockoType,
  LLMModel,
} from '@mocko/database';

const db = createMockoDatabase();

export { db, type DatabaseMocko, dbMockoSchema, MOCKO_DB_NAME, MockoType, LLMModel };
