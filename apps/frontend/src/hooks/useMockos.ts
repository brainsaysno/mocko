import { db } from "@/lib/db";
import { Mocko } from "@/model/mocko";
import { useQuery } from "@tanstack/react-query";

export default function useMockos() {
  return useQuery({
    queryKey: ["mockos"],
    queryFn: async () => {
      const mockos = await db.mockos.toArray();

      return mockos.map((m) => Mocko.fromJson(m));
    },
  });
}
