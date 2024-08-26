import MockoCard from '@/components/MockoCard';
import { H1 } from '@/components/typography/h1';
import { buttonVariants } from '@/components/ui/button';
import useMockos from '@/hooks/useMockos';
import { Link, createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import MockoEyesClosed from '../../assets/mocko-eyes-closed.webp';
import { motion } from 'framer-motion';

export const Route = createLazyFileRoute('/mockos/')({
  component: Mockos,
});

function Mockos() {
  const { isSuccess, isLoading, data } = useMockos();
  const navigate = useNavigate();

  if (isSuccess && data.length == 0) navigate({ to: '/' });

  return (
    <main className="relative w-screen h-screen overflow-hidden p-12 bg-pattern">
      <header className="mb-8 flex justify-between items-center">
        <H1>My Mockos</H1>
        <Link
          className={buttonVariants({ variant: 'default' })}
          to="/mockos/new"
        >
          New Mocko
        </Link>
      </header>
      <section className="flex justify-center gap-6 flex-wrap">
        {isSuccess ? data.map((m) => <MockoCard mocko={m} />) : null}
        {isLoading ? <p>Loading...</p> : null}
      </section>
      <motion.div
        className="absolute -bottom-16 w-48 md:w-80 left-12"
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img src={MockoEyesClosed} className="-rotate-12" />
      </motion.div>
    </main>
  );
}
