import { API_BASE_URL } from '@/lib/api';
import { z } from 'zod';

export enum MockoType {
  AIProse = 'ai-prose',
  AIJson = 'ai-json',
  Deterministic = 'deterministic',
  Fixed = 'fixed',
}

export type MockoExportOptions = {
  runtimeValues: Map<string, string>;
};

export const VARIABLE_REGEX = /{{\s?(\w+)\s?}}/g;

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

  static fromJson(json: any): Mocko {
    switch (json.type) {
      case MockoType.AIProse:
        return AIProseMocko.fromJson(json);
      case MockoType.AIJson:
        return AIJsonMocko.fromJson(json);
      case MockoType.Fixed:
        return FixedMocko.fromJson(json);
      default:
        throw new Error(`Unknown mocko type: ${json.type}`);
    }
  }

  static getCommonSchema() {
    return z.object({
      id: z.number(),
      name: z.string(),
      content: z.string(),
    });
  }
}

export enum LLMModel {
  Gpt4o = 'gpt-4o',
  Gpt4oMini = 'gpt-4o-mini',
  Gpt4Turbo = 'gpt-4-turbo',
  Gpt35Turbo = 'gpt-3.5-turbo',
}

export class AIProseMocko extends Mocko {
  example?: string;
  model: LLMModel;

  constructor(
    id: number,
    name: string,
    prompt: string,
    model: LLMModel,
    example?: string
  ) {
    super(id, MockoType.AIProse, name, prompt);
    this.model = model;
    this.example = example;
  }

  static fromJson(json: any) {
    const schema = Mocko.getCommonSchema().extend({
      example: z.string().optional(),
      model: z.nativeEnum(LLMModel),
    });

    const dto = schema.parse(json);

    return new AIProseMocko(
      dto.id,
      dto.name,
      dto.content,
      dto.model,
      dto.example
    );
  }

  async generateOne(options?: MockoExportOptions) {
    const prompt = this.interpolateVariables(options?.runtimeValues);

    const generateMockoResponseSchema = z.object({
      mock: z.string(),
    });

    const res = await fetch(API_BASE_URL + '/mocko/ai/prose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, example: this.example }),
    }).then((r) => r.json());

    const { mock } = generateMockoResponseSchema.parse(res);

    return mock;
  }
}

export class AIJsonMocko extends Mocko {
  structure?: string;
  model: LLMModel;

  constructor(
    id: number,
    name: string,
    prompt: string,
    model: LLMModel,
    structure?: string
  ) {
    super(id, MockoType.AIJson, name, prompt);
    this.model = model;
    this.structure = structure;
  }

  static fromJson(json: any) {
    const schema = Mocko.getCommonSchema().extend({
      structure: z.string().optional(),
      model: z.nativeEnum(LLMModel),
    });

    const dto = schema.parse(json);

    return new AIJsonMocko(
      dto.id,
      dto.name,
      dto.content,
      dto.model,
      dto.structure
    );
  }

  async generateOne(options?: MockoExportOptions) {
    const prompt = this.interpolateVariables(options?.runtimeValues);

    const generateMockoResponseSchema = z.object({
      mock: z.string(),
    });

    const res = await fetch(API_BASE_URL + '/mocko/ai/json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, structure: this.structure }),
    }).then((r) => r.json());

    const { mock } = generateMockoResponseSchema.parse(res);

    return mock;
  }
}

export class FixedMocko extends Mocko {
  constructor(id: number, name: string, content: string) {
    super(id, MockoType.Fixed, name, content);
    this.content = content;
  }

  static fromJson(json: any) {
    const schema = Mocko.getCommonSchema();

    const dto = schema.parse(json);

    return new FixedMocko(dto.id, dto.name, dto.content);
  }

  async generateOne(options?: MockoExportOptions) {
    return this.interpolateVariables(options?.runtimeValues);
  }
}
