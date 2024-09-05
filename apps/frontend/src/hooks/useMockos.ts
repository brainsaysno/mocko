import { db } from '@/lib/db';
import { MockoFactory } from '@/model/mocko/MockoFactory';
import { useQuery } from '@tanstack/react-query';

export const MOCKOS_QUERY_KEY = 'mockos';

export default function useMockos() {
  return useQuery({
    queryKey: [MOCKOS_QUERY_KEY],
    queryFn: async () => {
      const mockos = await db.mockos.toArray();

      mockos.reverse();

      const mockoFactory = new MockoFactory();

      return mockos.map((m) => mockoFactory.fromJson(m));
    },
  });
}
