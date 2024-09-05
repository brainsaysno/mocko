import { z } from 'zod';
import { LLMModel, MockoExportOptions, MockoType } from './common';
import { Mocko } from './Mocko';
import { API_BASE_URL } from '@/lib/api';

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
