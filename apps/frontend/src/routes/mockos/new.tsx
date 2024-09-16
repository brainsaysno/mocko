import { createFileRoute, Link, useSearch } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import NewMockoTabs from '@/components/mocko/NewMockoTabs';
import { z } from 'zod';
import { LLMModel, MockoType } from '@/model/mocko';
import { createContext, useContext } from 'react';

const editMockoSchema = z
  .object({
    id: z.number(),
    type: z.nativeEnum(MockoType),
    name: z.string(),
    content: z.string(),
    example: z.string().optional(),
    structure: z.string().optional(),
    model: z.nativeEnum(LLMModel).optional(),
  })
  .optional();

export const Route = createFileRoute('/mockos/new')({
  component: NewMocko,
  validateSearch: z.object({
    edit: editMockoSchema,
  }),
});

const EditMockoContext =
  createContext<z.infer<typeof editMockoSchema>>(undefined);

export function useEditMockoContext() {
  const editMockoProps = useContext(EditMockoContext);

  return editMockoProps;
}

function NewMocko() {
  const { edit } = useSearch({ from: Route.fullPath });
  return (
    <main className="w-screen h-screen overflow-hidden p-12 bg-pattern">
      <EditMockoContext.Provider value={edit}>
        <NewMockoHeader />
        <NewMockoTabs defaultType={edit?.type} />
      </EditMockoContext.Provider>
    </main>
  );
}

function NewMockoHeader() {
  return (
    <motion.div initial="rest" whileHover="hover" className="mb-2">
      <Link to="/mockos" className="flex items-center gap-1">
        <ChevronLeft />
        <motion.p
          variants={{
            rest: { x: -5, opacity: 0 },
            hover: { x: 0, opacity: 100 },
          }}
        >
          Back to Mockos
        </motion.p>
      </Link>
    </motion.div>
  );
}
