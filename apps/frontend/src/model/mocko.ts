import { generateAIProseMocko } from '@/lib/api';
import { z } from 'zod';

export enum MockoType {
  AIProse = 'ai-prose',
  AIStructured = 'ai-structured',
  Deterministic = 'deterministic',
  Fixed = 'fixed',
}

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

  abstract generateOne(): Promise<string>;

  private getRuntimeVariables(): string[] {
    const variableRegex = /{{\s?(\w+)\s?}}/g;
    const matches = this.content.matchAll(variableRegex);

    return Array.from(matches)
      .map((m) => m.at(1))
      .filter((m) => m != undefined);
  }

  static fromJson(json: any): Mocko {
    switch (json.type) {
      case MockoType.AIProse:
        return AIProseMocko.fromJson(json);
      case MockoType.Fixed:
        return FixedMocko.fromJson(json);
      default:
        throw new Error(`Unknown mocko type: ${json.type}`);
    }
  }
}

export enum LLMModel {
  Gpt4o = 'gpt-4o',
  Gpt4oMini = 'gpt-4o-mini',
  Gpt4Turbo = 'gpt-4-turbo',
  Gpt35Turbo = 'gpt-3.5-turbo',
}

export class AIProseMocko extends Mocko {
  model: LLMModel;

  constructor(id: number, name: string, prompt: string, model: LLMModel) {
    super(id, MockoType.AIProse, name, prompt);
    this.model = model;
  }

  static fromJson(json: any) {
    const schema = z.object({
      id: z.number(),
      name: z.string(),
      content: z.string(),
      model: z.nativeEnum(LLMModel),
    });

    const dto = schema.parse(json);

    return new AIProseMocko(dto.id, dto.name, dto.content, dto.model);
  }

  async generateOne() {
    return generateAIProseMocko(this.content);
  }
}

export class FixedMocko extends Mocko {
  constructor(id: number, name: string, content: string) {
    super(id, MockoType.Fixed, name, content);
    this.content = content;
  }

  static fromJson(json: any) {
    const schema = z.object({
      id: z.number(),
      name: z.string(),
      content: z.string(),
    });

    const dto = schema.parse(json);

    return new FixedMocko(dto.id, dto.name, dto.content);
  }

  async generateOne() {
    const variableRegex = /{{\s?(\w+)\s?}}/;

    return this.content.replace(variableRegex, (_, identifier) => {
      return 'VAR_' + identifier;
    });
  }
}
