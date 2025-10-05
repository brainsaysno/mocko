import { DatabaseMocko, MockoType, LLMModel } from '@mocko/database';
import { z } from 'zod';

const VARIABLE_REGEX = /{{\s?(\w+)\s?}}/g;

export const MOCKO_TYPE_PREFIXES: Record<MockoType, string> = {
  [MockoType.AIJson]: 'AI JSON',
  [MockoType.AIProse]: 'AI Prose',
  [MockoType.Deterministic]: 'Deterministic',
  [MockoType.Fixed]: 'Fixed',
};

export function getRuntimeVariables(content: string): string[] {
  const matches = content.matchAll(VARIABLE_REGEX);
  return Array.from(matches)
    .map((m) => m.at(1))
    .filter((m) => m != undefined);
}

export function hasRuntimeVariables(content: string): boolean {
  return getRuntimeVariables(content).length > 0;
}

export type MockoExportOptions = {
  runtimeValues: Map<string, string>;
};

export type MockoConfig = {
  apiBaseUrl: string;
};

abstract class BaseMocko {
  id: number;
  type: MockoType;
  name: string;
  content: string;
  runtimeVariables: string[];
  protected config: MockoConfig;

  constructor(
    id: number,
    type: MockoType,
    name: string,
    content: string,
    config: MockoConfig
  ) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.content = content;
    this.config = config;
    this.runtimeVariables = this.getRuntimeVariables();
  }

  protected interpolateVariables(runtimeValues?: Map<string, string>): string {
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
}

class AIProseMocko extends BaseMocko {
  example?: string;
  model: LLMModel;

  constructor(
    id: number,
    name: string,
    prompt: string,
    model: LLMModel,
    config: MockoConfig,
    example?: string
  ) {
    super(id, MockoType.AIProse, name, prompt, config);
    this.model = model;
    this.example = example;
  }

  async generateOne(options?: MockoExportOptions): Promise<string> {
    const prompt = this.interpolateVariables(options?.runtimeValues);

    const generateMockoResponseSchema = z.object({
      mock: z.string(),
    });

    const res = await fetch(this.config.apiBaseUrl + '/mocko/ai/prose', {
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

class AIJsonMocko extends BaseMocko {
  structure?: string;
  model: LLMModel;

  constructor(
    id: number,
    name: string,
    prompt: string,
    model: LLMModel,
    config: MockoConfig,
    structure?: string
  ) {
    super(id, MockoType.AIJson, name, prompt, config);
    this.model = model;
    this.structure = structure;
  }

  async generateOne(options?: MockoExportOptions): Promise<string> {
    const prompt = this.interpolateVariables(options?.runtimeValues);

    const generateMockoResponseSchema = z.object({
      mock: z.string(),
    });

    const res = await fetch(this.config.apiBaseUrl + '/mocko/ai/json', {
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

class FixedMocko extends BaseMocko {
  constructor(id: number, name: string, content: string, config: MockoConfig) {
    super(id, MockoType.Fixed, name, content, config);
  }

  async generateOne(options?: MockoExportOptions): Promise<string> {
    return this.interpolateVariables(options?.runtimeValues);
  }
}

export class MockoFactory {
  private config: MockoConfig;

  constructor(config: MockoConfig) {
    this.config = config;
  }

  fromDatabaseMocko(dbMocko: DatabaseMocko): BaseMocko {
    switch (dbMocko.type) {
      case MockoType.AIProse:
        return new AIProseMocko(
          dbMocko.id,
          dbMocko.name,
          dbMocko.content,
          dbMocko.model ?? LLMModel.Gpt4oMini,
          this.config,
          dbMocko.example
        );
      case MockoType.AIJson:
        return new AIJsonMocko(
          dbMocko.id,
          dbMocko.name,
          dbMocko.content,
          dbMocko.model ?? LLMModel.Gpt4oMini,
          this.config,
          dbMocko.structure
        );
      case MockoType.Fixed:
      case MockoType.Deterministic:
        return new FixedMocko(dbMocko.id, dbMocko.name, dbMocko.content, this.config);
      default:
        throw new Error(`Unknown mocko type: ${dbMocko.type}`);
    }
  }
}

export type Mocko = BaseMocko;
