import MockoCard from '@/components/MockoCard';
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

export const Route = createLazyFileRoute('/mockos/')({
  component: Mockos,
});

function Mockos() {
  const { isSuccess, isLoading, data } = useMockos();
  const [isGenerating, setIsGenerating] = useState(false);

  const { isOnboarded } = useIsOnboarded();

  return (
    <main className="relative w-screen h-screen overflow-hidden p-12 bg-pattern">
      <header className="mb-8 flex justify-between items-center">
        <H1>My Mockos</H1>
        <Link
          className={buttonVariants({ variant: 'default' })}
          to="/mockos/new"
          id="tour-new-mocko-button"
        >
          New Mocko
        </Link>
      </header>
      <section className="flex justify-center gap-6 flex-wrap">
        {!isOnboarded && <Onboarding />}
        {isSuccess
          ? data.map((m) => (
              <MockoCard
                key={m.id}
                mocko={m}
                disabled={isGenerating}
                afterGenerate={() => setIsGenerating(false)}
                onGenerate={() => setIsGenerating(true)}
              />
            ))
          : null}
        {isLoading ? <p>Loading...</p> : null}
      </section>
      <motion.div
        className="absolute -bottom-16 w-48 md:w-80 left-12 z-[10000]"
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        id="next-thing"
      >
        <img src={MockoEyesClosed} className="-rotate-12" alt="Mocko Logo" />
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
