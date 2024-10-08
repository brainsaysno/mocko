import { H1 } from '@/components/typography/h1';
import { buttonVariants } from '@/components/ui/button';
import useMockos from '@/hooks/useMockos';
import { Link, createLazyFileRoute } from '@tanstack/react-router';
import MockoLogo from '../assets/mocko-logo.webp';
import { P } from '@/components/typography/p';
import { motion } from 'framer-motion';
import Signature from '@/components/Signature';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  const { data } = useMockos();

  return (
    <main className="h-screen flex flex-col justify-center items-center gap-4 overflow-hidden p-0 bg-pattern">
      <motion.div
        className="h-1/4 md:h-1/3 w-fit"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img src={MockoLogo} className="h-full" alt="Mocko Logo" />
      </motion.div>
      <H1 className="text-center">Mocko</H1>
      <section className="text-center flex flex-col items-center gap-4">
        <P className="text-center">Generate and export friendly mock data</P>
        <Link className={buttonVariants()} to="/mockos">
          {data && data.length == 0 ? 'Get Started' : 'Go to Mockos'}
        </Link>
        <Signature className="justify-center" />
      </section>
    </main>
  );
}
