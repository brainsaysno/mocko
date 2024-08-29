export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const emailMocko = async (recipient: string, content: string) => {
  return await fetch(API_BASE_URL + '/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recipient, content }),
  });
};
