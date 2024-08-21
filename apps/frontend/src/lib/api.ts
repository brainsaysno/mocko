import { z } from 'zod';

const generateMockoResponseSchema = z.object({
  mock: z.string(),
});

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const generateAIProseMocko = async (prompt: string) => {
  const res = await fetch(API_BASE_URL + '/mocko/ai/prose', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  }).then((r) => r.json());

  const { mock } = generateMockoResponseSchema.parse(res);

  return mock;
};

export const emailMocko = async (recipient: string, content: string) => {
  return await fetch(API_BASE_URL + '/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recipient, content }),
  });
};
