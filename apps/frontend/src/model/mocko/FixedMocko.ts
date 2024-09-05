import { MockoExportOptions, MockoType } from './common';
import { Mocko } from './Mocko';

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
