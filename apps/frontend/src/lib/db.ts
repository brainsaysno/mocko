import Dexie, { type EntityTable } from "dexie";

interface Mocko {
  id: number;
  type: string;
  name: string;
  prompt?: string;
  content?: string;
  model?: string;
}

const db = new Dexie("MockoDatabase") as Dexie & {
  mockos: EntityTable<Mocko, "id">;
};

db.version(1).stores({
  mockos: "++id, type, name, prompt, content, model",
});

export type { Mocko };
export { db };
