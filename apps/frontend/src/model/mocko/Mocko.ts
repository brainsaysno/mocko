import { z } from 'zod';
import { MockoExportOptions, MockoType } from './common';

const VARIABLE_REGEX = /{{\s?(\w+)\s?}}/g;

export abstract class Mocko {
  id: number;
  type: MockoType;
  name: string;
  content: string;
  runtimeVariables: string[];

  constructor(id: number, type: MockoType, name: string, content: string) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.content = content;
    this.runtimeVariables = this.getRuntimeVariables();
  }

  protected interpolateVariables(runtimeValues?: Map<string, string>) {
    if (!runtimeValues) return this.content;
    return this.content.replace(VARIABLE_REGEX, (_, identifier) => {
      return runtimeValues.get(identifier) ?? `[${identifier}]`;
    });
  }

  private getRuntimeVariables(): string[] {
    const matches = this.content.matchAll(VARIABLE_REGEX);

    return Array.from(matches)
      .map((m) => m.at(1))
      .filter((m) => m != undefined);
  }

  abstract generateOne(options?: MockoExportOptions): Promise<string>;

  static getCommonSchema() {
    return z.object({
      id: z.number(),
      name: z.string(),
      content: z.string(),
    });
  }
}
