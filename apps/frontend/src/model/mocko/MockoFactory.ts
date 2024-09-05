import { AIJsonMocko } from './AIJsonMocko';
import { AIProseMocko } from './AIProseMocko';
import { MockoType } from './common';
import { FixedMocko } from './FixedMocko';
import { Mocko } from './Mocko';

export class MockoFactory {
  fromJson(json: any): Mocko {
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
}
