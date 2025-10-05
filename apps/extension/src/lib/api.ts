export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const WEB_BASE_URL = API_BASE_URL?.includes('localhost')
  ? 'http://local.mocko.nrusso.dev:4200'
  : 'https://mocko.nrusso.dev';
