import { z } from "zod";

const generateMockoResponseSchema = z.object({
  mock: z.string(),
});

const API_BASE_URL = "http://localhost:8080";

export const generateAIProseMocko = async (prompt: string) => {
  const res = await fetch(API_BASE_URL + "/ai-prose", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  }).then((r) => r.json());

  const { mock } = generateMockoResponseSchema.parse(res);

  return mock;
};

export const emailMocko = async (recipient: string, content: string) => {
  await fetch(API_BASE_URL + "/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recipient, content }),
  });

  return 1;
};
