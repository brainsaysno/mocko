import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import MockoLogo from '../assets/mocko-logo.webp';
import { db, dbMockoSchema } from '@/lib/db';
import { Button } from './ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { MOCKOS_QUERY_KEY } from '@/hooks/useMockos';

export default function MockoDevtools() {
  const queryClient = useQueryClient();

  const deleteAllMockos = async () => {
    await db.mockos.clear();
    queryClient.invalidateQueries({ queryKey: [MOCKOS_QUERY_KEY] });
  };

  const seedMockos = async () => {
    const seedData = await fetch('/data/seed.json')
      .then((res) => res.json())
      .then(dbMockoSchema.array().parse);
    await db.mockos.bulkAdd(seedData);
    queryClient.invalidateQueries({ queryKey: [MOCKOS_QUERY_KEY] });
  };

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <Sheet>
      <SheetTrigger className="absolute bottom-8 right-8">
        <div className="bg-slate-400 w-24 rounded-full relative shadow-2xl transition-colors transition-2s duration-300">
          <img src={MockoLogo} className="p-4" />
          <p
            className="absolute z-10 bottom-2 left-[30%] text-center text-white font-extrabold text-xl"
            style={{ WebkitTextStroke: '1px black' }}
          >
            DEV
          </p>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Mockos</SheetTitle>
          <SheetDescription className="flex flex-col gap-2">
            <Button onClick={seedMockos} variant="outline">
              Seed
            </Button>
            <Button onClick={deleteAllMockos} variant="destructive">
              Delete all
            </Button>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
