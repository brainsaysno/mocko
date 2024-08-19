import { generateAIProseMocko } from "@/lib/api";
import { z } from "zod";

export enum MockoType {
  AIProse = "ai-prose",
  AIStructured = "ai-structured",
  Deterministic = "deterministic",
  Fixed = "fixed",
}

export abstract class Mocko {
  type: MockoType;
  name: string;

  constructor(type: MockoType, name: string) {
    this.type = type;
    this.name = name;
  }

  abstract generateOne(): Promise<string>;

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
  Gpt4o = "gpt-4o",
  Gpt4Turbo = "gpt-4-turbo",
  Gpt35Turbo = "gpt-3.5-turbo",
}

export class AIProseMocko extends Mocko {
  prompt: string;
  model: LLMModel;

  constructor(name: string, prompt: string, model: LLMModel) {
    super(MockoType.AIProse, name);
    this.prompt = prompt;
    this.model = model;
  }

  static fromJson(json: any) {
    const schema = z.object({
      name: z.string(),
      prompt: z.string(),
      model: z.nativeEnum(LLMModel),
    });

    const dto = schema.parse(json);

    return new AIProseMocko(dto.name, dto.prompt, dto.model);
  }

  async generateOne() {
    return generateAIProseMocko(this.prompt);
  }
}

export class FixedMocko extends Mocko {
  content: string;

  constructor(name: string, content: string) {
    super(MockoType.Fixed, name);
    this.content = content;
  }

  static fromJson(json: any) {
    const schema = z.object({
      name: z.string(),
      content: z.string(),
    });

    const dto = schema.parse(json);

    return new FixedMocko(dto.name, dto.content);
  }

  async generateOne() {
    const variableRegex = /{{\s?(\w+)\s?}}/;

    return this.content.replace(variableRegex, (_, identifier) => {
      return "VAR_" + identifier;
    });
  }
}
