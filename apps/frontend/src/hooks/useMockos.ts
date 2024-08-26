import { db } from '@/lib/db';
import { Mocko } from '@/model/mocko';
import { useQuery } from '@tanstack/react-query';

export const MOCKOS_QUERY_KEY = 'mockos';

export default function useMockos() {
  return useQuery({
    queryKey: [MOCKOS_QUERY_KEY],
    queryFn: async () => {
      const mockos = await db.mockos.toArray();

      mockos.reverse();

      return mockos.map((m) => Mocko.fromJson(m));
    },
  });
}
