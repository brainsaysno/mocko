import { H1 } from '@/components/typography/h1';
import { Button, buttonVariants } from '@/components/ui/button';
import useMockos from '@/hooks/useMockos';
import { Link, createLazyFileRoute } from '@tanstack/react-router';
import MockoEyesClosed from '../../assets/mocko-eyes-closed.webp';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useProductTourContext } from '@/context/ProductTourContext';
import { DialogTitle } from '@radix-ui/react-dialog';
import useIsOnboarded from '@/hooks/useIsOnboarded';
import Signature from '@/components/Signature';
import { cn } from '@/lib/utils';
import DragNDropMockoCards from '@/components/mocko/DragNDropMockoCards';

export const Route = createLazyFileRoute('/mockos/')({
  component: Mockos,
});

function Mockos() {
  const { isSuccess, isLoading, data } = useMockos();
  const [isGenerating, setIsGenerating] = useState(false);

  const { isOnboarded } = useIsOnboarded();

  return (
    <main className="min-h-screen w-screen p-12 bg-pattern bg-repeat">
      <header className="mb-8 flex justify-between items-center">
        <H1>My Mockos</H1>
        {isSuccess && data.length > 0 && (
          <Link
            className={buttonVariants({ variant: 'default' })}
            to="/mockos/new"
            id="tour-new-mocko-button"
          >
            New Mocko
          </Link>
        )}
      </header>
      <section className="flex justify-center gap-6 flex-wrap">
        {!isOnboarded && <Onboarding />}
        {isSuccess ? (
          <DragNDropMockoCards
            mockos={data}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        ) : null}
        {isSuccess && data.length === 0 ? (
          <div className="flex flex-col justify-center items-center gap-6">
            <p className="text-2xl font-medium">No mockos created yet!</p>
            <Link
              className={buttonVariants({ variant: 'default', size: 'lg' })}
              to="/mockos/new"
            >
              New Mocko
            </Link>
          </div>
        ) : null}
        {isLoading ? <p>Loading...</p> : null}
      </section>
      <motion.div
        className="fixed -bottom-16 w-48 md:w-80 left-12 z-[10000]"
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ rotate: 5, scale: 1.05 }}
        id="next-thing"
      >
        <img src={MockoEyesClosed} className="-rotate-12" alt="Mocko Logo" />
      </motion.div>
      <motion.div
        className="fixed bottom-4 w-48 md:w-80 left-56 md:left-[21rem] z-[10001]"
        initial={{ x: -300, y: 100 }}
        animate={{ x: 0, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Signature
          className={cn(
            'text-sm text-left',
            !isOnboarded && 'text-white stroke-white fill-white'
          )}
        />
      </motion.div>
    </main>
  );
}

function Onboarding() {
  const [open, setOpen] = useState(true);

  const {
    setState,
    state: { run },
  } = useProductTourContext();

  const startProductTour = () => {
    setOpen(false);
    setState({ run: true });
  };

  return (
    <Dialog open={open && !run}>
      <DialogContent
        className="max-w-full w-[75vw] p-8 sm:rounded-bl-none focus:outline-none -mt-8"
        hideClose
      >
        <DialogTitle className="text-4xl font-semibold">
          Hi there! I'm Mocko...
        </DialogTitle>
        <div className="space-y-4">
          <p className="md:text-xl whitespace-pre-wrap">
            Your friendly guide to{' '}
            <b>quick and reliable mock data generation</b>. Whether you're
            building a new app, testing APIs, or just need data fast, I've got
            you covered. Think of me as your{' '}
            <b>trusty sidekick in manual testing</b>—I'll help you generate and
            export <b>consistent, user-friendly mock data</b> in a snap. Ready
            to explore? Let me give you a quick tour of the app!
          </p>
          <div className="flex justify-center">
            <Button size="lg" onClick={startProductTour}>
              Let's Go!
            </Button>
          </div>
        </div>
        <div className="bg-white w-4 h-4 absolute -bottom-4 -left-[1px] rounded-br-full" />
      </DialogContent>
    </Dialog>
  );
}
