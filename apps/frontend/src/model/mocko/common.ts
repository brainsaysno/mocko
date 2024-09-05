export enum MockoType {
  AIProse = 'ai-prose',
  AIJson = 'ai-json',
  Deterministic = 'deterministic',
  Fixed = 'fixed',
}

export type MockoExportOptions = {
  runtimeValues: Map<string, string>;
};

export enum LLMModel {
  Gpt4o = 'gpt-4o',
  Gpt4oMini = 'gpt-4o-mini',
  Gpt4Turbo = 'gpt-4-turbo',
  Gpt35Turbo = 'gpt-3.5-turbo',
}
