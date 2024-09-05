import { z } from 'zod';
import { LLMModel, MockoExportOptions, MockoType } from './common';
import { Mocko } from './Mocko';
import { API_BASE_URL } from '@/lib/api';

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
